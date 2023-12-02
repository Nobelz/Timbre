import { calculateCompatibilityScore, generateSpotifyData } from '../../../lib/matching_algorithm';
import { getUserIDFromSpotifyID, rejectFriendRequest } from "../../../lib/db_functions"
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
        switch (body.command) {
            case 'GENERATE_SPOTIFY_DATA':
                response = await generateSpotifyData(body.access_token);
                break;
            case 'CALCULATE_COMPATIBILITY':
                response = await calculateCompatibilityScore(body.id1, body.id2);
                break;
            case 'DENY_FRIEND_REQUEST':
                const response1 = await getUserIDFromSpotifyID(body.receive_id);
                const response2 = await getUserIDFromSpotifyID(body.send_id);
                const userID1 = response1.rows[0].search_user_from_id;
                const userID2 = response2.rows[0].search_user_from_id;
                response = await rejectFriendRequest(userID1, userID2);
                break;
        }
        
        return NextResponse.json({ message: 'Successful data entry', data: response.data });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Internal server error', error: err });
    }
}

export async function GET(request) {
    try {
        let sampledUsers = await getTop3Matches('jonathanlong19148');
        // let sampledUsers = await getUserInfo('jonathanlong19148')
    
        if (sampledUsers) {
            return NextResponse.json({ message: 'get successful', data: sampledUsers});
        } else {
            return NextResponse.json({ message: 'get failed' });
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Internal server error' });
    }
}
// look at this https://stackoverflow.com/questions/76214029/no-http-methods-exported-in-export-a-named-export-for-each-http-method
// name each method POST, GET, etc...