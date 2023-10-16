import json
import spotipy
import numpy as np
from spotipy.oauth2 import SpotifyOAuth
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util

# Import client id and secret
with open('./timbre/dev/secrets.json', 'r') as f:
    secrets = json.load(f)

client_id = secrets['CLIENT_ID']
client_secret = secrets['CLIENT_SECRET']

# Get user token
scope = "user-read-recently-played user-top-read"
token = util.prompt_for_user_token(scope=scope, client_id=client_id, client_secret=client_secret, redirect_uri="http://localhost:8888/callback", show_dialog=True)

if token:
    sp_user = spotipy.Spotify(auth=token)
    
    recently_played_tracks = sp_user.current_user_recently_played(15)
    top_tracks = sp_user.current_user_top_tracks(10)
    top_artists = sp_user.current_user_top_artists(5)

    artist_ids = []
    # Get the top 5 artists
    for item in top_artists['items']:
        artist_ids.append(item['id'])

    sp_general = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id=client_id, client_secret=client_secret))
    
    
    top_artist_tracks = np.empty((5, 5), dtype=np.dtype('U100'))

    # Get the top 5 track ids for each artist
    for i, artist_id in enumerate(artist_ids):
        top_tracks = sp_general.artist_top_tracks(artist_id)
        for j, item in enumerate(top_tracks['tracks'][:5]):
            top_artist_tracks[i][j] = item['id']


    # Get the track ids of the recently played tracks
    print('Test')
