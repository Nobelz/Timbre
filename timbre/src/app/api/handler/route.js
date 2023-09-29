import { topTracks, getUsersPlaylists } from '../../lib/spotify';
import { getSession } from 'next-auth/react';

export async function GET(req, res) {
    const {
        token: { accessToken },
    } = await getSession({ req });
    const response = await topTracks(accessToken);
    const { items } = await response.json();
    return res.status(200).json({ items });
}