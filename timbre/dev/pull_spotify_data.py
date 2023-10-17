import json
import spotipy
import numpy as np
from spotipy.oauth2 import SpotifyOAuth
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util
from database import Database

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

    # Determine artist component of score
    i = 0
    for j in range(len(top_artist_track_ids)):
        num_artist_tracks = len(top_artists[j])

    # Get the track ids of the recently played tracks
    print('Test')
