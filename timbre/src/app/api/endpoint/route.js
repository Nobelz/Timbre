import { insertUser } from "../../../lib/db_functions"
import { NextResponse } from 'next/server';

// Handler for PUT requests 
// Can potentially differentiate between which functions to call in db_functionsusing request.json() or request.text()
// That will get the body of the fetch request from the frontend: line 50 of homepage/page.js
// There might be a better method
export async function PUT(request) {
    // const body = await request.json(); // or request.text()
    // console.log(body);
    try {
        let response = await insertUser(1, "billy");
        if (response.data.success) {
            return NextResponse.json({ message: 'Insert user successful' })
        } else {
            return NextResponse.json({ message: 'Insert user failed' })
        }
    } catch (err) {
        return NextResponse.json({ message: 'Internal server error' })
    }
}

// look at this https://stackoverflow.com/questions/76214029/no-http-methods-exported-in-export-a-named-export-for-each-http-method
// name each method POST, GET, etc...