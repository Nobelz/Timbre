import { insertSongRating, getSongRating } from "../../../lib/db_functions"
import { calculateCompatibilityScore, generateSpotifyData } from '../../../lib/matching_algorithm';
import { NextResponse } from 'next/server';

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
                console.log(response.data.score);
                break;
        }

        return NextResponse.json({ message: 'Successful data entry' })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Internal server error' })
    }
}

export async function GET(request) {
    try {
        let response = await getSongRating();

        if (response.rows) {
            return NextResponse.json({ message: 'get successful', data: response.rows })
        } else {
            return NextResponse.json({ message: 'get failed' })
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Internal server error' })
    }
}
// look at this https://stackoverflow.com/questions/76214029/no-http-methods-exported-in-export-a-named-export-for-each-http-method
// name each method POST, GET, etc...