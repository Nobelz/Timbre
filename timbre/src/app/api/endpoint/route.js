import { calculateCompatibilityScore, generateSpotifyData } from '../../../lib/matching_algorithm';
import { checkFriends, getUserInfo, getUserIDFromSpotifyID, getUserIDFromEmail, rejectFriendRequest, acceptFriendRequest, makeFriendRequest, getFriendRequests, getFriends, makeRecommendation, getRecommendations, updateUserBio, getSongInformation, getSongArtistInformation } from "../../../lib/db_functions"
import { NextResponse } from 'next/server';
import { getTop3Matches } from "../../../lib/matching"

// Handler for PUT requests 
// Can potentially differentiate between which functions to call in db_functions using request.json() or request.text()
// That will get the body of the fetch request from the frontend: line 50 of homepage/page.js
// There might be a better method

// TODO fix the response garbage, it's possibly causing errors
export async function PUT(request) {
    const body = await request.json();
    try {
        let response;
        let response1;
        let response2;
        let response3;
        switch (body.command) {
            case 'GENERATE_SPOTIFY_DATA':
                /*
                    access_token: The API access token
                */
                response = await generateSpotifyData(body.access_token);
                break;
            case 'DENY_FRIEND_REQUEST':
                /*
                    current_id: The Spotify ID of the current user
                    friend_id: The Spotify ID of the friend whose request is being denied
                */
                response1 = await getUserIDFromSpotifyID(body.current_id);
                response2 = await getUserIDFromSpotifyID(body.friend_id);
                response = await rejectFriendRequest(response1.rows[0].search_user_from_id, response2.rows[0].search_user_from_id);
                break;
            case 'ACCEPT_FRIEND_REQUEST':
                /*
                    current_id: The Spotify ID of the current user
                    friend_id: The Spotify ID of the friend whose request is being accepted
                */
                response1 = await getUserIDFromSpotifyID(body.current_id);
                response2 = await getUserIDFromSpotifyID(body.friend_id);
                response = await acceptFriendRequest(response1.rows[0].search_user_from_id, response2.rows[0].search_user_from_id);
            case 'MAKE_FRIEND_REQUEST':
                /*
                    current_id: The Spotify ID of the current user
                    email: The email address of the potential friend
                */
                response1 = await getUserIDFromEmail(body.email);
                response2 = await getUserIDFromSpotifyID(body.current_id);
                if (response1) {
                    if (response1.rows[0].search_user_from_email === response2.rows[0].search_user_from_id) {
                        response = {
                            data:
                            {
                                code: 400,
                                message: `You can't add yourself as a friend!`,
                            }
                        }
                    } else {
                        response3 = await checkFriends(response1.rows[0].search_user_from_email, response2.rows[0].search_user_from_id);
                        if (response3.rowCount > 0) {
                            response = {
                                data:
                                {
                                    code: 400,
                                    message: 'You are already friends with this user!',
                                }
                            };
                        } else {
                            response = await makeFriendRequest(response2.rows[0].search_user_from_id, response1.rows[0].search_user_from_email);
                        }
                    }
                } else {
                    response = {
                        data:
                        {
                            code: 404,
                            message: 'User not found',
                        }
                    };   
                }
                break;
            case 'MAKE_RECOMMENDATION':
                /*
                    current_id: The Spotify ID of the current user
                    friend_id: The User ID of the friend receiving the recommendation
                    song: The song being recommended
                */
                response1 = await getUserIDFromSpotifyID(body.current_id);
                response = await makeRecommendation(response1.rows[0].search_user_from_id, body.friend_id, body.song);
                break;
            case 'UPDATE_BIO':
                /*
                    spotify_id: The Spotify ID of the current user
                    new_bio: The bio to update to
                */
                response1 = await getUserIDFromSpotifyID(body.spotify_id);
                response = await updateUserBio(response1.rows[0].search_user_from_id, body.new_bio )
                break;
            default:
                return NextResponse.json({ message: 'Internal server error', success: false });
        }
        return NextResponse.json({ message: 'Successful PUT request', success: true, data: response.data });
    } catch (err) {
        return NextResponse.json({ message: 'Internal server error', success: false, error: err });
    }

    return NextResponse.json({ message: 'Internal server error', success: false});
}

export async function POST(request) {
    const body = await request.json();

    try {
        let response;
        let response1;
        let response2;
        let response3;
        let response4;
        switch (body.command) {
            case 'CALCULATE_COMPATIBILITY':
                /*
                    id1: The Spotify ID of the first user
                    id2: The Spotify ID of the second user
                    Returns: The compatibility score between the two users
                */
                response = await calculateCompatibilityScore(body.id1, body.id2);
                break;
            case 'GET_FRIENDS':
                /*
                    spotify_id: The Spotify ID of the current user
                    Returns: The friends of the current user
                */
                response1 = await getUserIDFromSpotifyID(body.spotify_id);
                response = await getFriends(response1.rows[0].search_user_from_id);
                break;
            case 'GET_FRIEND_REQUESTS':
                /*
                    spotify_id: The Spotify ID of the current user
                    Returns: The friend requests of the current user
                */
                response1 = await getUserIDFromSpotifyID(body.spotify_id);
                response = await getFriendRequests(response1.rows[0].search_user_from_id);
                break;
            case 'GET_RECOMMENDATIONS':
                /*
                    spotify_id: The Spotify ID of the current user
                    Returns: The recommendations of the current user, along with the user that recommended them
                */
                response1 = await getUserIDFromSpotifyID(body.spotify_id);
                response2 = await getRecommendations(response1.rows[0].search_user_from_id);
            
                let recIDs = response2.rows.map((rec) => rec.song_id);
                recIDs = Array.from(new Set(recIDs)); // Remove recommendation duplicates
                recIDs = recIDs.slice(0, 20); 

                let recommendedTracks = [];
                for (const id of recIDs) {
                    let track = {};
                    track.song_id = id;

                    response3 = await getSongInformation(response1.rows[0].search_user_from_id, id);
                    let songInfo = response3.rows[0];
                    track.title = songInfo.title;
                    track.uri = songInfo.uri;
                    track.albumImageUrl = songInfo.album_image_url;
                    track.rating = parseFloat(songInfo.rating);

                    response4 = await getSongArtistInformation(id);
                    track.artists = [];
                    track.artist_ids = [];
                    let artistInfo = response4.rows;
                    for (const artist of artistInfo) {
                        track.artists.push(artist.artist_name);
                        track.artist_ids.push(artist.artist_id);
                    }

                    recommendedTracks.push(track);
                }

                response = {tracks: recommendedTracks};
                break;
            case 'GET_USER_PROFILE':
                /*
                    spotify_id: The Spotify ID of the current user
                    Returns: The profile of the current user
                */
               response = await getUserInfo(body.spotify_id);
               break;
            default:
                return NextResponse.json({ message: 'Internal server error', success: false });
        }

        return NextResponse.json({ message: 'Successful POST request', success: true, data: response });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Internal server error', success: false, error: err });
    }

    return NextResponse.json({ message: 'Internal server error', success: false});
}

export async function GET(request) {
    return NextResponse.json({ message: 'Internal server error', success: false});
}
// look at this https://stackoverflow.com/questions/76214029/no-http-methods-exported-in-export-a-named-export-for-each-http-method
// name each method POST, GET, etc...