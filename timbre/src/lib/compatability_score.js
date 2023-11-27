
export const calculateCompatibilityScore = (email1, email2) => {
    try {
        const user_id1 = getUserIDFromUsername(email1);
        const user_id2 = getUserIDFromUsername(email2);

    } catch (error) {
        console.log(error);
    }
    
    const songProfiles1 = getSongProfiles(user_id1, 1);
    const songProfiles2 = getSongProfiles(user_id2, 1);

    profiles1 = [{}];
    profiles2 = [{}];

    for (const songProfile of songProfiles1) {
        const temp = {};
        temp['danceability'] = parseFloat(songProfile[1]);
        temp['energy'] = parseFloat(songProfile[2]);
        temp['loudness'] = parseFloat(songProfile[3]);
        temp['speechiness'] = parseFloat(songProfile[4]);
        temp['acousticness'] = parseFloat(songProfile[5]);
        temp['instrumentalness'] = parseFloat(songProfile[6]);
        temp['liveness'] = parseFloat(songProfile[7]);
        temp['valence'] = parseFloat(songProfile[8]);
        temp['tempo'] = parseFloat(songProfile[9]);
        profiles1[songProfile[0] - 1] = temp;
    }

    for (const songProfile of songProfiles2) {
        const temp = {};
        temp['danceability'] = parseFloat(songProfile[1]);
        temp['energy'] = parseFloat(songProfile[2]);
        temp['loudness'] = parseFloat(songProfile[3]);
        temp['speechiness'] = parseFloat(songProfile[4]);
        temp['acousticness'] = parseFloat(songProfile[5]);
        temp['instrumentalness'] = parseFloat(songProfile[6]);
        temp['liveness'] = parseFloat(songProfile[7]);
        temp['valence'] = parseFloat(songProfile[8]);
        temp['tempo'] = parseFloat(songProfile[9]);
        profiles2[songProfile[0] - 1] = temp;
    }
    
    console.log(profiles1);
};
