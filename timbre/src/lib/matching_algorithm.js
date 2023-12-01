import { createUser, getUserIDFromSpotifyID, getSongProfiles, getProfileCharacteristics, getTopRatings } from './db_functions';
import { recentlyPlayed, topTracks, topArtists, profileInfo, artistTopTracks, trackFeatures } from './spotify';

export const calculateCompatibilityScore = async (id1, id2) => {
    // ACCESSORY FUNCTIONS
    // Accessory Function: Calculate the score between each profile
    const calculateScore = async (profile1, profile2) => {
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
        total += (parseFloat(dataRow.max) - parseFloat(dataRow.min));
    }

    let scores = new Array(4);
    let weights = [0.2, 0.2, 0.3, 0.3]; // Weights for each type of profile

    // Check for each song profile type
    for (let i = 0; i < 4; i++) {
        if (isEmpty(profiles1[i]) || isEmpty(profiles2[i]))  // If song profile doesn't exist for one of the users, disregard
            weights[i] = 0;
        else 
            scores[i] = await calculateScore(profiles1[i], profiles2[i]); // Calculate subscore for each profile type
    }

    // Normalize weights
    weights = weights.map(weight => weight / weights.reduce((a, b) => a + b, 0));

    // Calculate final score
    let sum = 0;
    for (let i = 0; i < 4; i++) {
        if (weights[i] > 0)
            sum += scores[i] * weights[i];
    }
    
    // Formulate API response
    let response = {};
    response.rowCount = 1;
    response.command = "CALCULATE_SCORE";
    response.rows = [{ // TODO change to username
        'email1': email1,
        'email2': email2,
        'score': sum
    }];

    // Return API response
    return response;
};

export const generateSpotifyData = async(access_token) => { // TODO add spotify last refresh
    // ACCESSORY FUNCTIONS
    // Accessory Function: Calculate the weighted average
    const calculateWeightedAverage = async (features, weights) => {
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
    const generateWeights = async (num_ranks) => {
        const weights = [];

        for (let i = 0; i < num_ranks; i++) {
            weights.push(num_ranks - i);
        }

        const sumWeights = weights.reduce((sum, weight) => sum + weight, 0);
        return weights.map(weight => weight / sumWeights);
    };
    
    console.log('Test');
    
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

    try {
        let userID = await getUserIDFromSpotifyID(spotifyID);

        if (userID.rows.length === 0) {
            await createUser(spotifyID, email, displayName, profileURL);
            userID = await getUserIDFromSpotifyID(spotifyID); // Get new user id that was just inserted
        }
        
        userID = userID.rows[0].search_user_from_id;
        
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
        if (topSongs.tracks) {
            for (const item of topSongs.tracks) {
                topIDs.push(item.id);
            }
        }

        // Get top rating IDs
        let topRatings = await getTopRatings(userID, 10);

        // TODO I WAS HERE
        topRatings = topRatings.rows.map(row => [row.song_id, row.rating]);
        console.log(topRatings);

        const topRatingIDs = topRatings.map(rating => rating[0]);

        // Concatenate all track IDs into one Spotify API call to reduce number of API calls
        const trackIDs = [...topArtistTrackIDs.flat(), ...topIDs, ...recentlyPlayedIDs, ...topRatingIDs];
        const removedTrackIDs = trackIDs.filter(trackID => trackID !== '');

        const audioFeatures = await trackFeatures(removedTrackIDs);

        console.log(audioFeatures);
        const scaled_audio_features = audio_features.map(feature => {
            return {
                danceability: feature.danceability,
                energy: feature.energy,
                loudness: (feature.loudness / 60) + 1,
                speechiness: feature.speechiness,
                acousticness: feature.acousticness,
                instrumentalness: feature.instrumentalness,
                liveness: feature.liveness,
                valence: feature.valence,
                tempo: Math.min(Math.log(feature.tempo) / Math.log(300), 1)
            };
        });

        const artist_scores = [];
        let i = 0;
        for (let j = 0; j < top_artist_track_ids.length; j++) {
            const num_artist_tracks = top_artist_track_ids[j].filter(track_id => track_id !== '').length;
            artist_scores.push(_weighted_average(scaled_audio_features.slice(i, i + num_artist_tracks), Array(num_artist_tracks).fill(1 / num_artist_tracks)));
            i += num_artist_tracks;
        }

        const num_artist_tracks = i;
        const artist_score = _weighted_average(artist_scores, generate_weights(artist_scores.length));

        const top_track_score = _weighted_average(scaled_audio_features.slice(i, i + top_track_ids.length), generate_weights(top_track_ids.length));
        i += top_track_ids.length;

        const recently_played_score = _weighted_average(scaled_audio_features.slice(i, i + recently_played_track_ids.length), Array(recently_played_track_ids.length).fill(1 / recently_played_track_ids.length));
        i += recently_played_track_ids.length;

        const top_ratings_scores = top_ratings.map(rating => parseFloat(rating[1]));
        const top_rating_score = _weighted_average(scaled_audio_features.slice(i, i + top_rating_ids.length), top_ratings_scores.map(rating => rating / top_ratings_scores.reduce((sum, rating) => sum + rating, 0)));

        const scores = [];
        const weights = [];
        if (num_artist_tracks > 0) {
            database.insert_song_profile(user_id, 1, artist_score.acousticness, artist_score.danceability, artist_score.energy, artist_score.instrumentalness, artist_score.liveness, artist_score.loudness, artist_score.speechiness, artist_score.valence, artist_score.tempo);
            scores.push(artist_score);
            weights.push(0.2);
        }

        if (top_track_ids.length > 0) {
            database.insert_song_profile(user_id, 2, top_track_score.acousticness, top_track_score.danceability, top_track_score.energy, top_track_score.instrumentalness, top_track_score.liveness, top_track_score.loudness, top_track_score.speechiness, top_track_score.valence, top_track_score.tempo);
            scores.push(top_track_score);
            weights.push(0.3);
        }

        if (recently_played_track_ids.length > 0) {
            database.insert_song_profile(user_id, 3, recently_played_score.acousticness, recently_played_score.danceability, recently_played_score.energy, recently_played_score.instrumentalness, recently_played_score.liveness, recently_played_score.loudness, recently_played_score.speechiness, recently_played_score.valence, recently_played_score.tempo);
            scores.push(recently_played_score);
            weights.push(0.2);
        }

        if (top_rating_ids.length > 0) {
            database.insert_song_profile(user_id, 4, top_rating_score.acousticness, top_rating_score.danceability, top_rating_score.energy, top_rating_score.instrumentalness, top_rating_score.liveness, top_rating_score.loudness, top_rating_score.speechiness, top_rating_score.valence, top_rating_score.tempo);
            scores.push(top_rating_score);
            weights.push(0.3);
        }

        const normalized_weights = weights.map(weight => weight / weights.reduce((sum, weight) => sum + weight, 0));
        const final_score = _weighted_average(scores, normalized_weights);

        for (const [feature, value] of Object.entries(final_score)) {
            console.log(`${feature}: ${value}`);
        }
    } catch (error) {
        console.log(error);
    }
    
    // console.log(user_id);
    // console.log(recentSongs);
    // console.log(topSongs);
    // console.log(topMusicians);
    // console.log(personalInfo);

    console.log(display_name);
    console.log(profile_URL);
    console.log(username);
    console.log(profile_pic);
    
    return token;
};
