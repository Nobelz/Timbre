import { calculateCompatibilityScore, generateSpotifyData } from '../../../lib/matching_algorithm';
import { getSongRating, addSong, insertSongRating, checkFriends, getUserInfo, getUserIDFromSpotifyID, getUserIDFromEmail, rejectFriendRequest, acceptFriendRequest, makeFriendRequest, getFriendRequests, getFriends, makeRecommendation, getRecommendations, updateUserBio, getSongInformation, getSongArtistInformation } from "../../../lib/db_functions"
import { topTracks } from '../../../lib/spotify';
import { NextResponse } from 'next/server';
import { getTop3Matches } from "../../../lib/matching"

// Handler for PUT requests 
export async function PUT(request) {
    const body = await request.json();
    try {
        switch (body.command) {
            case 'GENERATE_SPOTIFY_DATA':
                /*
                    access_token: The API access token
                */
                let spotifyDataResponse = await generateSpotifyData(body.access_token);
                return NextResponse.json({ message: 'Successful PUT request', success: true, data: spotifyDataResponse.data });
            case 'DENY_FRIEND_REQUEST':
                /*
                    current_id: The Spotify ID of the current user
                    friend_id: The Spotify ID of the friend whose request is being denied
                */
                let denyResponse1 = await getUserIDFromSpotifyID(body.current_id);
                let denyResponse2 = await getUserIDFromSpotifyID(body.friend_id);
                let denyResponse = await rejectFriendRequest(denyResponse1.rows[0].search_user_from_id, denyResponse2.rows[0].search_user_from_id);
                return NextResponse.json({ message: 'Successful PUT request', success: true, data: denyResponse });
            case 'ACCEPT_FRIEND_REQUEST':
                /*
                    current_id: The Spotify ID of the current user
                    friend_id: The Spotify ID of the friend whose request is being accepted
                */
                let acceptResponse1 = await getUserIDFromSpotifyID(body.current_id);
                let acceptResponse2 = await getUserIDFromSpotifyID(body.friend_id);
                let acceptResponse = await acceptFriendRequest(acceptResponse1.rows[0].search_user_from_id, acceptResponse2.rows[0].search_user_from_id);
                return NextResponse.json({ message: 'Successful PUT request', success: true, data: acceptResponse });
            case 'MAKE_FRIEND_REQUEST':
                /*
                    current_id: The Spotify ID of the current user
                    email: The email address of the potential friend
                */
                let friendReqResponse1 = await getUserIDFromEmail(body.email);
                let friendReqResponse2 = await getUserIDFromSpotifyID(body.current_id);
                let friendReqResponse;
                if (friendReqResponse1) {
                    if (friendReqResponse1.rows[0].search_user_from_email === friendReqResponse2.rows[0].search_user_from_id) {
                        friendReqResponse = {
                            data:
                            {
                                code: 400,
                                message: `You can't add yourself as a friend!`,
                            }
                        }
                    } else {
                        let friendReqResponse3 = await checkFriends(friendReqResponse1.rows[0].search_user_from_email, friendReqResponse2.rows[0].search_user_from_id);
                        if (friendReqResponse3.rows[0].check_friends) {
                            friendReqResponse = {
                                data:
                                {
                                    code: 400,
                                    message: 'You are already friends with this user!',
                                }
                            };
                        } else {
                            friendReqResponse = await makeFriendRequest(friendReqResponse2.rows[0].search_user_from_id, friendReqResponse1.rows[0].search_user_from_email);
                        }
                    }
                } else {
                    friendReqResponse = {
                        data:
                        {
                            code: 404,
                            message: 'User not found',
                        }
                    };
                }
                return NextResponse.json({ message: 'Successful PUT request', success: true, data: friendReqResponse.data });
            case 'MAKE_FRIEND_REQUEST_WITH_ID':
                /*
                    match_id: The Spotify ID of the user to be added as a friend
                    current_id: The Spotify ID of the current user
                */
                let makeFriendResponse1 = await getUserIDFromSpotifyID(body.match_id);
                let makeFriendResponse2 = await getUserIDFromSpotifyID(body.current_id);
                let makeFriendResponse = await makeFriendRequest(makeFriendResponse2.rows[0].search_user_from_id, makeFriendResponse1.rows[0].search_user_from_id);
                return NextResponse.json({ message: 'Successful PUT request', success: true, data: makeFriendResponse });
            case 'MAKE_RECOMMENDATION':
                /*
                    current_id: The Spotify ID of the current user
                    friend_id: The User ID of the friend receiving the recommendation
                    song: The song being recommended
                */
                let recResponse1 = await getUserIDFromSpotifyID(body.current_id);
                let recResponse = await makeRecommendation(recResponse1.rows[0].search_user_from_id, body.friend_id, body.song);
                return NextResponse.json({ message: 'Successful PUT request', success: true, data: recResponse });
            case 'UPDATE_BIO':
                /*
                    spotify_id: The Spotify ID of the current user
                    new_bio: The bio to update to
                */
                let bioResponse1 = await getUserIDFromSpotifyID(body.spotify_id);
                let bioResponse = await updateUserBio(bioResponse1.rows[0].search_user_from_id, body.new_bio);
                return NextResponse.json({ message: 'Successful PUT request', success: true, data: bioResponse });
            case 'RATE_SONG':
                let rateResponse1 = await getUserIDFromSpotifyID(body.spotify_id);
                let rateResponse = await insertSongRating(rateResponse1.rows[0].search_user_from_id, body.track_id, body.rating);
                return NextResponse.json({ message: 'Successful PUT request', success: true, data: rateResponse });
            default:
                return NextResponse.json({ message: 'Internal server error', success: false });
        }
        return NextResponse.json({ message: 'Internal server error', success: false });
    } catch (err) {
        return NextResponse.json({ message: 'Internal server error', success: false, error: err });
    }
    return NextResponse.json({ message: 'Internal server error', success: false });
}

// Handler for POST requests
export async function POST(request) {
    const body = await request.json();

    try {
        switch (body.command) {
            case 'CALCULATE_COMPATIBILITY':
                /*
                    id1: The Spotify ID of the first user
                    id2: The Spotify ID of the second user
                    Returns: The compatibility score between the two users
                */
                let compatResponse = await calculateCompatibilityScore(body.id1, body.id2);
                return NextResponse.json({ message: 'Successful POST request', success: true, data: compatResponse });
            case 'GET_FRIENDS':
                /*
                    spotify_id: The Spotify ID of the current user
                    Returns: The friends of the current user
                */
                let getFriendsResponse1 = await getUserIDFromSpotifyID(body.spotify_id);
                let getFriendsResponse = await getFriends(getFriendsResponse1.rows[0].search_user_from_id);
                return NextResponse.json({ message: 'Successful POST request', success: true, data: getFriendsResponse });
            case 'GET_FRIEND_REQUESTS':
                /*
                    spotify_id: The Spotify ID of the current user
                    Returns: The friend requests of the current user
                */
                let friendReqResponse1 = await getUserIDFromSpotifyID(body.spotify_id);
                let friendReqResponse = await getFriendRequests(friendReqResponse1.rows[0].search_user_from_id);
                return NextResponse.json({ message: 'Successful POST request', success: true, data: friendReqResponse });
            case 'GET_RECOMMENDATIONS':
                /*
                    spotify_id: The Spotify ID of the current user
                    Returns: The recommendations of the current user, along with the user that recommended them
                */
                let recResponse1 = await getUserIDFromSpotifyID(body.spotify_id);
                let recResponse2 = await getRecommendations(recResponse1.rows[0].search_user_from_id);
            
                let recIDs = recResponse2.rows.map((rec) => rec.song_id);
                recIDs = Array.from(new Set(recIDs)); // Remove recommendation duplicates
                recIDs = recIDs.slice(0, 20); 

                let recommendedTracks = [];
                for (const id of recIDs) {
                    let track = {};
                    track.song_id = id;

                    let recResponse3 = await getSongInformation(recResponse1.rows[0].search_user_from_id, id);
                    let songInfo = recResponse3.rows[0];
                    track.title = songInfo.title;
                    track.uri = songInfo.uri;
                    track.albumImageUrl = songInfo.album_image_url;
                    track.rating = parseFloat(songInfo.rating);

                    let recResponse4 = await getSongArtistInformation(id);
                    track.artists = [];
                    track.artist_ids = [];
                    let artistInfo = recResponse4.rows;
                    for (const artist of artistInfo) {
                        track.artists.push(artist.artist_name);
                        track.artist_ids.push(artist.artist_id);
                    }

                    recommendedTracks.push(track);
                }

                let recResponse = {tracks: recommendedTracks};
                return NextResponse.json({ message: 'Successful POST request', success: true, data: recResponse });
            case 'GET_USER_PROFILE':
                /*
                    spotify_id: The Spotify ID of the current user
                    Returns: The profile of the current user
                */
                let profileResponse = await getUserInfo(body.spotify_id);
                return NextResponse.json({ message: 'Successful POST request', success: true, data: profileResponse });
            case 'GET_MATCHES':
                /*
                    spotify_id: The Spotify ID of the current user
                    Returns: The matches of the current user
                */
                let matchResponse = await getTop3Matches(body.spotify_id);
                return NextResponse.json({ message: 'Successful POST request', success: true, data: matchResponse });
            case 'GET_TOP_TRACKS':
                /*
                    spotify_id: The Spotify ID of the current user
                    tracks: The Spotify top tracks result
                    Returns: The top tracks of the current user
                */
                let spotifyTopTracksResponse = await topTracks(body.access_token); 
                let topTrackResponse1 = await getUserIDFromSpotifyID(body.spotify_id);
                
                let topSongs = [];
                for (const item of spotifyTopTracksResponse.items) {
                    let track = {};
                    track.song_id = item.id;
                    track.title = item.name;
                    track.uri = item.uri;
                    track.albumImageUrl = item.album.images[0].url;
                    
                    track.artists = [];
                    track.artist_ids = [];
                    for (const artist of item.artists) {
                        track.artists.push(artist.name);
                        track.artist_ids.push(artist.id);
                    }
                    
                    // Add song to database
                    await addSong(track.song_id, track.title, track.uri, track.albumImageUrl, track.artists, track.artist_ids); 
                    
                    // Get song rating (if exists)
                    let ratingResponse = await getSongRating(topTrackResponse1.rows[0].search_user_from_id, track.song_id);
                    if (ratingResponse.rows.length > 0) {
                        track.rating = parseFloat(ratingResponse.rows[0].rating);
                    } else {
                        track.rating = null;
                    }

                    topSongs.push(track);
                }
                console.log(topSongs);
                return NextResponse.json({ message: 'Successful POST request', success: true, data: topSongs }); 
            default:
                return NextResponse.json({ message: 'Internal server error', success: false });
        }
        return NextResponse.json({ message: 'Internal server error', success: false });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Internal server error', success: false, error: err });
    }
    return NextResponse.json({ message: 'Internal server error', success: false });
}

export async function GET(request) {
    return NextResponse.json({ message: 'Internal server error', success: false });
}
