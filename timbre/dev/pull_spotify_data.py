import json
import spotipy
import numpy as np
from spotipy.oauth2 import SpotifyOAuth
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util
from database import Database

def _weighted_average(features, weights):
    temp = dict()

    danceability_values = [feature['danceability'] for feature in features]
    temp['danceability'] = sum([danceability_values[i] * weights[i] for i in range(len(weights))])
    energy_values = [feature['energy'] for feature in features]
    temp['energy'] = sum([energy_values[i] * weights[i] for i in range(len(weights))])
    loudness_values = [feature['loudness'] for feature in features]
    temp['loudness'] = sum([loudness_values[i] * weights[i] for i in range(len(weights))])
    speechiness_values = [feature['speechiness'] for feature in features]
    temp['speechiness'] = sum([speechiness_values[i] * weights[i] for i in range(len(weights))])
    acousticness_values = [feature['acousticness'] for feature in features]
    temp['acousticness'] = sum([acousticness_values[i] * weights[i] for i in range(len(weights))])
    instrumentalness_values = [feature['instrumentalness'] for feature in features]
    temp['instrumentalness'] = sum([instrumentalness_values[i] * weights[i] for i in range(len(weights))])
    liveness_values = [feature['liveness'] for feature in features]
    temp['liveness'] = sum([liveness_values[i] * weights[i] for i in range(len(weights))])
    valence_values = [feature['valence'] for feature in features]
    temp['valence'] = sum([valence_values[i] * weights[i] for i in range(len(weights))])
    tempo_values = [feature['tempo'] for feature in features]
    temp['tempo'] = sum([tempo_values[i] * weights[i] for i in range(len(weights))])

    return temp
    
def generate_weights(num_ranks: int):
    weights = [num_ranks - i for i in range(num_ranks)]
    return [weight / sum(weights) for weight in weights]

# Import client id and secret
with open('./timbre/dev/secrets.json', 'r') as f:
    secrets = json.load(f)

client_id = secrets['CLIENT_ID']
client_secret = secrets['CLIENT_SECRET']

# Get user token
scope = "user-read-recently-played user-top-read user-read-email"
token = util.prompt_for_user_token(scope=scope, client_id=client_id, client_secret=client_secret, redirect_uri="http://localhost:8888/callback", show_dialog=True)

if token:
    sp_user = spotipy.Spotify(auth=token) # Used to get Spotify user information
    sp_general = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)) # Used to get Spotify general information
    database = Database.default_database() # Used to access the database

    recently_played_tracks = sp_user.current_user_recently_played(15)
    top_tracks = sp_user.current_user_top_tracks(10, time_range='short_term')
    top_artists = sp_user.current_user_top_artists(5)
    email = sp_user.current_user()['email']

    # TODO: If username does not exist in database, add it

    artist_ids = []
    # Get the top 5 artists
    for item in top_artists['items']:
        artist_ids.append(item['id'])

    top_artist_track_ids = np.empty((5, 5), dtype=np.dtype('U100'))

    # Get the top 5 track ids for each artist
    for i, artist_id in enumerate(artist_ids):
        top_tracks = sp_general.artist_top_tracks(artist_id)
        for j, item in enumerate(top_tracks['tracks'][:5]):
            top_artist_track_ids[i][j] = item['id']

    # Get recently played ids
    recently_played_track_ids = []
    for item in recently_played_tracks['items']:
        recently_played_track_ids.append(item['track']['id'])

    # Get top track ids
    top_track_ids = []
    for item in top_tracks['tracks']:
        top_track_ids.append(item['id'])

    # Get top ratings
    user_id = database.search_user_from_username(email)[0]
    top_ratings = database.get_top_ratings(user_id, 10)

    top_rating_ids = [rating[0] for rating in top_ratings]

    # Concatenate track ID's
    track_ids = np.concatenate((top_artist_track_ids.flatten(), top_track_ids, recently_played_track_ids, top_rating_ids), axis=0)
    removed_track_ids = track_ids[track_ids != '']
    
    # Get audio features for each track
    audio_features = sp_general.audio_features(removed_track_ids)

    scaled_audio_features = []
    # Processing of audio features
    for feature in audio_features:
        temp = dict()
        temp['danceability'] = feature['danceability']
        temp['energy'] = feature['energy']
        temp['loudness'] = (feature['loudness'] / 60) + 1
        temp['speechiness'] = feature['speechiness']
        temp['acousticness'] = feature['acousticness']
        temp['instrumentalness'] = feature['instrumentalness']
        temp['liveness'] = feature['liveness']
        temp['valence'] = feature['valence']
        temp['tempo'] = min(np.log(feature['tempo']) / np.log(300), 1) # Scale tempo to be between 0 and 1 using log function
        scaled_audio_features.append(temp)

    # Determine artist component of score
    artist_scores = []
    i = 0
    for j in range(len(top_artist_track_ids)):
        num_artist_tracks = len(top_artist_track_ids[j])
        artist_scores.append(_weighted_average(scaled_audio_features[i:i+num_artist_tracks], generate_weights(num_artist_tracks)))
        i = i + num_artist_tracks
    
    num_artist_tracks = i
    artist_score = _weighted_average(artist_scores, generate_weights(len(artist_scores)))

    # Determine top track component of score
    top_track_score = _weighted_average(scaled_audio_features[i:i+len(top_track_ids)], generate_weights(len(top_track_ids)))
    i = i + len(top_track_ids)

    # Determine recently played component of score
    recently_played_score = _weighted_average(scaled_audio_features[i:i+len(recently_played_track_ids)], [1 / len(recently_played_track_ids) for i in range(len(recently_played_track_ids))])
    i = i + len(recently_played_track_ids)

    # Determine top rating component of score
    top_ratings = [float(rating[1]) for rating in top_ratings]
    top_rating_score = _weighted_average(scaled_audio_features[i:i+len(top_rating_ids)], [rating / sum(top_ratings) for rating in top_ratings])

    scores = []
    weights = []
    if num_artist_tracks > 0:
        database.insert_song_profile(user_id, 1, artist_score['acousticness'], artist_score['danceability'], artist_score['energy'], artist_score['instrumentalness'], artist_score['liveness'], artist_score['loudness'], artist_score['speechiness'], artist_score['valence'], artist_score['tempo'])
        scores.append(artist_score)
        weights.append(0.2)
    
    if len(top_track_ids) > 0:
        database.insert_song_profile(user_id, 2, top_track_score['acousticness'], top_track_score['danceability'], top_track_score['energy'], top_track_score['instrumentalness'], top_track_score['liveness'], top_track_score['loudness'], top_track_score['speechiness'], top_track_score['valence'], top_track_score['tempo'])
        scores.append(top_track_score)
        weights.append(0.3)

    if len(recently_played_track_ids):
        database.insert_song_profile(user_id, 3, recently_played_score['acousticness'], recently_played_score['danceability'], recently_played_score['energy'], recently_played_score['instrumentalness'], recently_played_score['liveness'], recently_played_score['loudness'], recently_played_score['speechiness'], recently_played_score['valence'], recently_played_score['tempo'])
        scores.append(recently_played_score)
        weights.append(0.2)
    
    if len(top_ratings):
        database.insert_song_profile(user_id, 4, top_rating_score['acousticness'], top_rating_score['danceability'], top_rating_score['energy'], top_rating_score['instrumentalness'], top_rating_score['liveness'], top_rating_score['loudness'], top_rating_score['speechiness'], top_rating_score['valence'], top_rating_score['tempo'])
        scores.append(top_rating_score)
        weights.append(0.3)

    weights = [weight / sum(weights) for weight in weights] # Normalize weights
    final_score = _weighted_average(scores, weights)
    
    for feature, value in final_score.items():
        print(f"{feature}: {value}")
