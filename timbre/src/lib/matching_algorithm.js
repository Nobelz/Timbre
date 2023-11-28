import { getUserIDFromUsername, getSongProfiles, getProfileCharacteristics } from './db_functions';
import { recentlyPlayed } from './spotify';

export const calculateCompatibilityScore = async (email1, email2) => {
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
    const user_id1 = await getUserIDFromUsername(email1);
    const user_id2 = await getUserIDFromUsername(email2);

    const user_ids = [user_id1.rows[0].search_user_from_username, user_id2.rows[0].search_user_from_username]

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
    response.rows = [{
        'email1': email1,
        'email2': email2,
        'score': sum
    }];

    // Return API response
    return response;
};

export const pullSpotifyData = async() => {
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
    
    let recent = await recentlyPlayed();

    console.log(recent);

    return token;
};
