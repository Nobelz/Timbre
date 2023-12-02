import {calculateCompatibilityScore} from './matching_algorithm';
import {getRandomUsers} from './db_functions';

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
  
      return top3Matches;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  export { getTop3Matches };

// async function getTop3Matches(currSpotifyID) {
//     try {
//       const sampledUsers = await getRandomUsers(currSpotifyID);
//       const scores = [];
  
//       // calculate scores
//       for (const sampledUser of sampledUsers) {
//         const response = await calculateCompatibilityScore(currSpotifyID, sampledUser);
//         scores.push(response.data.score);
//       }
  
//       return scores;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   }
  
//   export { getTop3Matches };