import { createUser, getUserIDFromSpotifyID, getSongProfiles, getProfileCharacteristics, getTopRatings, insertSongProfile, updateUser } from './db_functions';
import { recentlyPlayed, topTracks, topArtists, profileInfo, artistTopTracks, trackFeatures } from './spotify';

export const calculateCompatibilityScore = async (id1, id2) => {
    // ACCESSORY FUNCTIONS
    // Accessory Function: Calculate the score between each profile
    const calculateScore = async (profile1, profile2, total) => {
        const diff = Math.abs(profile1['danceability'] - profile2['danceability']) +
            Math.abs(profile1['energy'] - profile2['energy']) +
            Math.abs(profile1['loudness'] - profile2['loudness']) +
            Math.abs(profile1['speechiness'] - profile2['speechiness']) +
            Math.abs(profile1['acousticness'] - profile2['acousticness']) +
            Math.abs(profile1['instrumentalness'] - profile2['instrumentalness']) +
            Math.abs(profile1['liveness'] - profile2['liveness']) +
            Math.abs(profile1['valence'] - profile2['valence']) +
            Math.abs(profile1['tempo'] - profile2['tempo']);
        return 1 - (diff / total);
    };
    
    // Accessory Function: Check if dictionary is empty
    const isEmpty = (dict) => {
        return Object.keys(dict).length === 0;
    };
    
    // Get User IDs from emails
    const user_id1 = await getUserIDFromSpotifyID(id1);
    const user_id2 = await getUserIDFromSpotifyID(id2);

    const user_ids = [user_id1.rows[0].search_user_from_id, user_id2.rows[0].search_user_from_id]

    // Get all song profiles for each user
    const songProfiles1 = await getSongProfiles(user_ids[0], 1);
    const songProfiles2 = await getSongProfiles(user_ids[1], 1);
    
    // Parse song profiles for each user
    const profiles1 = [{}, {}, {}, {}];
    const profiles2 = [{}, {}, {}, {}];

    let dataRow;

    // Pull each song characteristic into an accessible dictionary, song profile 1
    for (dataRow of songProfiles1.rows) {
        const temp = {};
        temp['danceability'] = parseFloat(dataRow.danceability);
        temp['energy'] = parseFloat(dataRow.energy);
        temp['loudness'] = parseFloat(dataRow.loudness);
        temp['speechiness'] = parseFloat(dataRow.speechiness);
        temp['acousticness'] = parseFloat(dataRow.acousticness);
        temp['instrumentalness'] = parseFloat(dataRow.instrumentalness);
        temp['liveness'] = parseFloat(dataRow.liveness);
        temp['valence'] = parseFloat(dataRow.valence);
        temp['tempo'] = parseFloat(dataRow.tempo);
        profiles1[dataRow.type_id - 1] = temp;
    }

    // Pull each song characteristic into an accessible dictionary, song profile 2
    for (dataRow of songProfiles2.rows) {
        const temp = {};
        temp['danceability'] = parseFloat(dataRow.danceability);
        temp['energy'] = parseFloat(dataRow.energy);
        temp['loudness'] = parseFloat(dataRow.loudness);
        temp['speechiness'] = parseFloat(dataRow.speechiness);
        temp['acousticness'] = parseFloat(dataRow.acousticness);
        temp['instrumentalness'] = parseFloat(dataRow.instrumentalness);
        temp['liveness'] = parseFloat(dataRow.liveness);
        temp['valence'] = parseFloat(dataRow.valence);
        temp['tempo'] = parseFloat(dataRow.tempo);
        profiles2[dataRow.type_id - 1] = temp;
    }

    // Get profile characteristics for max and min
    const characteristics = await getProfileCharacteristics();

    // Determine final sum by summing the max - min for each characteristic
    let total = 0;
    for (dataRow of characteristics.rows) {
        total += (parseFloat(dataRow.c_max) - parseFloat(dataRow.c_min));
    }

    let scores = new Array(4);
    let weights = [0.2, 0.2, 0.3, 0.3]; // Weights for each type of profile

    // Check for each song profile type
    for (let i = 0; i < 4; i++) {
        if (isEmpty(profiles1[i]) || isEmpty(profiles2[i]))  // If song profile doesn't exist for one of the users, disregard
            weights[i] = 0;
        else 
            scores[i] = await calculateScore(profiles1[i], profiles2[i], total); // Calculate subscore for each profile type
    }

    // Normalize weights
    weights = weights.map(weight => weight / weights.reduce((a, b) => a + b, 0));

    // Calculate final score
    let sum = 0;
    for (let i = 0; i < 4; i++) {
        if (weights[i] > 0)
            sum += scores[i] * weights[i];
    }

    // Return API response
    return {
        command: 'CALCULATE_COMPATIBILITY',
        data: {
            success: true,
            score: sum
        }
    };
};

export const generateSpotifyData = async(access_token) => {
    // ACCESSORY FUNCTIONS
    // Accessory Function: Calculate the weighted average
    const calculateWeightedAverage = (features, weights) => {
        const temp = {};

        // Iterate over each feature
        for (const featureKey in features[0]) {
            if (features[0].hasOwnProperty(featureKey)) {
                const featureValues = features.map(feature => feature[featureKey]);
                temp[featureKey] = featureValues.reduce((sum, value, i) => sum + value * weights[i], 0);
            }
        }

        return temp;
    };

    // Accessory Function: Generate the weights
    const generateWeights = (num_ranks) => {
        const weights = [];

        for (let i = 0; i < num_ranks; i++) {
            weights.push(num_ranks - i);
        }

        const sumWeights = weights.reduce((sum, weight) => sum + weight, 0);
        return weights.map(weight => weight / sumWeights);
    };
        
    let recentSongs = await recentlyPlayed(access_token);
    let topSongs = await topTracks(access_token);
    let topMusicians = await topArtists(access_token);
    let personalInfo = await profileInfo(access_token); 

    let displayName = personalInfo.display_name;
    let profileURL = personalInfo.external_urls.spotify;
    let spotifyID = personalInfo.id;
    let email = personalInfo.email;
    let country = personalInfo.country;
    let profilePic;

    if (personalInfo.images.length === 0) { // Check if there is a profile picture
        profilePic = null;
    } else {
        profilePic = personalInfo.images[1].url;
    }

    let userID = await getUserIDFromSpotifyID(spotifyID);

    if (userID.rows.length === 0) {
        await createUser(spotifyID, email, displayName, profileURL);
        userID = await getUserIDFromSpotifyID(spotifyID); // Get new user id that was just inserted
    }
    userID = userID.rows[0].search_user_from_id;
    await updateUser(userID, email, displayName, profilePic);

    let artistIds = [];
    // Get the top 5 artists
    if (topMusicians.items) {
        for (let i = 0; i < topMusicians.items.length; i++) {
            const item = topMusicians.items[i];
            artistIds.push(item.id);
        }
    }

    // Make empty array of 5 artists, 5 tracks each
    const topArtistTrackIDs = new Array(5).fill('').map(() => new Array(5).fill(''));

    // Get the top 5 track IDs for each artist
    for (let i = 0; i < artistIds.length; i++) {
        const artistID = artistIds[i];
        const topArtistSongs = await artistTopTracks(access_token, artistID, country);
        for (let j = 0; j < Math.min(5, topArtistSongs.tracks.length); j++) {
            if (topArtistSongs.tracks[j]) {
                topArtistTrackIDs[i][j] = topArtistSongs.tracks[j].id;
            }
        }
    }

    // Get recently played IDs
    const recentlyPlayedIDs = [];
    for (const item of recentSongs.items) {
        recentlyPlayedIDs.push(item.track.id);
    }

    // Get top track IDs
    const topIDs = [];
    if (topSongs.items) {
        for (const item of topSongs.items) {
            topIDs.push(item.id);
        }
    }

    // Get top rating IDs
    let topRatings = await getTopRatings(userID, 10);
    topRatings = topRatings.rows.map(row => [row.song_id, parseFloat(row.rating)]);
    const topRatingIDs = topRatings.map(rating => rating[0]);

    // Concatenate all track IDs into one Spotify API call to reduce number of API calls
    const trackIDs = [...topArtistTrackIDs.flat(), ...topIDs, ...recentlyPlayedIDs, ...topRatingIDs];
    const removedTrackIDs = trackIDs.filter(trackID => trackID !== '');
    const trackIDString = removedTrackIDs.join(',');

    let audioFeatures = await trackFeatures(access_token, trackIDString);
    audioFeatures = audioFeatures.audio_features;

    const scaledAudioFeatures = audioFeatures.map(feature => {
        return {
            danceability: feature.danceability,
            energy: feature.energy,
            loudness: (feature.loudness / 60) + 1,
            speechiness: feature.speechiness,
            acousticness: feature.acousticness,
            instrumentalness: feature.instrumentalness,
            liveness: feature.liveness,
            valence: feature.valence,
            tempo: Math.max(Math.min(Math.log(feature.tempo) / Math.log(300), 1), 0)
        };
    });

    const artistScores = [];
    let i = 0;
    for (let j = 0; j < topArtistTrackIDs.length; j++) {
        const numArtistTracks = topArtistTrackIDs[j].filter(trackID => trackID !== '').length;
        artistScores.push(calculateWeightedAverage(scaledAudioFeatures.slice(i, i + numArtistTracks), Array(numArtistTracks).fill(1 / numArtistTracks)));
        i += numArtistTracks;
    }

    const numArtistTracks = i;
    const artistScore = calculateWeightedAverage(artistScores, generateWeights(artistScores.length));

    const topTrackScore = calculateWeightedAverage(scaledAudioFeatures.slice(i, i + topIDs.length), generateWeights(topIDs.length));
    i += topIDs.length;

    const recentlyPlayedScore = calculateWeightedAverage(scaledAudioFeatures.slice(i, i + recentlyPlayedIDs.length), Array(recentlyPlayedIDs.length).fill(1 / recentlyPlayedIDs.length));
    i += recentlyPlayedIDs.length;

    const topRatingScores = topRatings.map(rating => parseFloat(rating[1]));
    const topRatingScore = calculateWeightedAverage(scaledAudioFeatures.slice(i, i + topRatingIDs.length), topRatingScores.map(rating => rating / topRatingScores.reduce((sum, rating) => sum + rating, 0)));

    if (numArtistTracks > 0) {
        await insertSongProfile(userID, 1, artistScore.acousticness, artistScore.danceability, artistScore.energy, artistScore.instrumentalness, artistScore.liveness, artistScore.loudness, artistScore.speechiness, artistScore.valence, artistScore.tempo);
    }

    if (topIDs.length > 0) {
        await insertSongProfile(userID, 2, topTrackScore.acousticness, topTrackScore.danceability, topTrackScore.energy, topTrackScore.instrumentalness, topTrackScore.liveness, topTrackScore.loudness, topTrackScore.speechiness, topTrackScore.valence, topTrackScore.tempo);
    }

    if (recentlyPlayedIDs.length > 0) {
        await insertSongProfile(userID, 3, recentlyPlayedScore.acousticness, recentlyPlayedScore.danceability, recentlyPlayedScore.energy, recentlyPlayedScore.instrumentalness, recentlyPlayedScore.liveness, recentlyPlayedScore.loudness, recentlyPlayedScore.speechiness, recentlyPlayedScore.valence, recentlyPlayedScore.tempo);
    }

    if (topRatingIDs.length > 0) {
        await insertSongProfile(userID, 4, topRatingScore.acousticness, topRatingScore.danceability, topRatingScore.energy, topRatingScore.instrumentalness, topRatingScore.liveness, topRatingScore.loudness, topRatingScore.speechiness, topRatingScore.valence, topRatingScore.tempo);
    }

    return {
        command: 'GENERATE_SPOTIFY_DATA',
        data: {
            success: true,
            user_id: userID,
            spotify_id: spotifyID,
        },
    };
};
