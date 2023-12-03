import { calculateCompatibilityScore, generateSpotifyData } from '../../../lib/matching_algorithm';
import { getUserIDFromSpotifyID, getUserIDFromEmail, rejectFriendRequest, acceptFriendRequest, makeFriendRequest, getFriendRequests, getFriends, makeRecommendation, getRecommendations } from "../../../lib/db_functions"
import { NextResponse } from 'next/server';
import { getTop3Matches } from "../../../lib/matching"

// Handler for PUT requests 
// Can potentially differentiate between which functions to call in db_functions using request.json() or request.text()
// That will get the body of the fetch request from the frontend: line 50 of homepage/page.js
// There might be a better method

export async function PUT(request) {
    const body = await request.json();
    try {
        let response;
        let response1;
        let response2;
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
                    friend_id: The email address of the potential friend
                */
                response1 = await getUserIDFromEmail(body.email);
                response = await makeFriendRequest(body.current_id, response1.rows[0].search_user_from_email);
                break;
            case 'MAKE_RECOMMENDATION':
                /*
                    current_id: The Spotify ID of the current user
                    friend_id: The Spotify ID of the friend receiving the recommendation
                    song_id: The Spotify ID of the song being recommended
                */
                response1 = await getUserIDFromSpotifyID(body.current_id);
                response2 = await getUserIDFromSpotifyID(body.friend_id);
                response = await makeRecommendation(response1.rows[0].search_user_from_id, response2.rows[0].search_user_from_id, body.song_id);
                break;
        }

        return NextResponse.json({ message: 'Successful data entry', data: response.data });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Internal server error', error: err });
    }
}

export async function POST(request) {
    const body = await request.json();

    try {
        let response;
        let response1;
        let response2;
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
                response = await getRecommendations(body.spotify_id);
                break;
        }

        return NextResponse.json({ message: 'get successful', data: response });
    } catch (err) {
        return NextResponse.json({ message: 'Internal server error' });
    }
}

export async function GET(request) {

}
// look at this https://stackoverflow.com/questions/76214029/no-http-methods-exported-in-export-a-named-export-for-each-http-method
// name each method POST, GET, etc...