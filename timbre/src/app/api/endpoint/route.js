import { insertSongRating, getSongRating } from "../../../lib/db_functions"
import { NextResponse } from 'next/server';

// Handler for PUT requests 
// Can potentially differentiate between which functions to call in db_functions using request.json() or request.text()
// That will get the body of the fetch request from the frontend: line 50 of homepage/page.js
// There might be a better method
export async function PUT(request) {
    const body = await request.json();
    try {
        let response = await insertSongRating(body.user_id, body.song_id, body.rating);
        if (response.data.success) {
            return NextResponse.json({ message: 'Insert user successful' })
        } else {
            return NextResponse.json({ message: 'Insert user failed' })
        }
    } catch (err) {
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