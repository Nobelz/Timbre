import {calculateCompatibilityScore} from './matching_algorithm';
import {getRandomUsers, getUserInfo} from './db_functions';

async function getTop3Matches(currSpotifyID) {
    try {
      const sampledUsers = await getRandomUsers(currSpotifyID);
      const userDict = {};
  
      // calculate scores
      for (const sampledUser of sampledUsers) {
        const response = await calculateCompatibilityScore(currSpotifyID, sampledUser);
        userDict[sampledUser] = response.data.score;
      }
  
      // sort dictionary by score and select top 3
      const sortedEntries = Object.entries(userDict)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .slice(0, 3);

      const top3Matches = Object.fromEntries(sortedEntries);
  
      const matchInfo = {}
      for (const id in top3Matches) {
        const userInfo = await getUserInfo(id);
        
        matchInfo[id] = {Spotify_id: id,
                         display_name: userInfo.rows[0].display_name,
                         profile_pic: userInfo.rows[0].pic_link, 
                         user_bio: userInfo.rows[0].bio};
      }

      return matchInfo;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  export { getTop3Matches };