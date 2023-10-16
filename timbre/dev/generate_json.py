import json
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util

# Import client id and secret
with open('./timbre/dev/secrets.json', 'r') as f:
    secrets = json.load(f)

client_id = secrets['CLIENT_ID']
client_secret = secrets['CLIENT_SECRET']
username = secrets['USERNAME']

# Get user token
scope = "user-read-recently-played"
token = util.prompt_for_user_token(username, scope, client_id=client_id, client_secret=client_secret, redirect_uri="http://localhost:8888/callback")

if token:
    sp = spotipy.Spotify(auth=token)
    
    results = sp.current_user_recently_played()
    