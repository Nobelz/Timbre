from database import Database


def calculate_compatibility_score(email1: str, email2: str) -> float:
    db = Database.default_database()

    try:
        user_id1 = db.search_user_from_username(email1)[0]
        user_id2 = db.search_user_from_username(email2)[0]
    except TypeError:
        return None
    
    song_profiles1 = db.get_all_song_profiles(user_id1, 1)
    song_profiles2 = db.get_all_song_profiles(user_id2, 1)
        
    profiles1 = [{}] * 4
    profiles2 = [{}] * 4
    for song_profile in song_profiles1:
        temp = dict()
        temp['danceability'] = float(song_profile[1])
        temp['energy'] = float(song_profile[2])
        temp['loudness'] = float(song_profile[3])
        temp['speechiness'] = float(song_profile[4])
        temp['acousticness'] = float(song_profile[5])
        temp['instrumentalness'] = float(song_profile[6])
        temp['liveness'] = float(song_profile[7])
        temp['valence'] = float(song_profile[8])
        temp['tempo'] = float(song_profile[9])
        profiles1[song_profile[0] - 1] = temp

    for song_profile in song_profiles2:
        temp = dict()
        temp['danceability'] = float(song_profile[1])
        temp['energy'] = float(song_profile[2])
        temp['loudness'] = float(song_profile[3])
        temp['speechiness'] = float(song_profile[4])
        temp['acousticness'] = float(song_profile[5])
        temp['instrumentalness'] = float(song_profile[6])
        temp['liveness'] = float(song_profile[7])
        temp['valence'] = float(song_profile[8])
        temp['tempo'] = float(song_profile[9])
        profiles2[song_profile[0] - 1] = temp
    
    scores = [0] * 4
    weights = [0.2, 0.2, 0.3, 0.3]

    for i in range(4):
        if profiles1[i] and profiles2[i]:
            scores[i] = _calculate_compatibility(profiles1[i], profiles2[i])
        else:
            weights[i] = 0

    weights = [weight / sum(weights) for weight in weights]
    return sum([scores[i] * weights[i] for i in range(4)])
        
def _calculate_compatibility(profile1, profile2) -> float:
    diff = abs(profile1['danceability'] - profile2['danceability']) + \
        abs(profile1['energy'] - profile2['energy']) + \
        abs(profile1['loudness'] - profile2['loudness']) + \
        abs(profile1['speechiness'] - profile2['speechiness']) + \
        abs(profile1['acousticness'] - profile2['acousticness']) + \
        abs(profile1['instrumentalness'] - profile2['instrumentalness']) + \
        abs(profile1['liveness'] - profile2['liveness']) + \
        abs(profile1['valence'] - profile2['valence']) + \
        abs(profile1['tempo'] - profile2['tempo'])
    return 1 - (diff) / 9

print(f'Compatibility Score: {round(calculate_compatibility_score("nobelzhou19@gmail.com", "wtl2255@gmail.com") * 100, 1)}%')
