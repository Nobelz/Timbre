import {calculateCompatibilityScore} from './matching_algorithm';
import {getRandomUsers} from './db_functions';

// async function getTop3Matches(currUser) {
//     try {
//       const sampledUsers = await getRandomUsers();
//       const userDict = {};
  
//       // calculate scores
//       for (const sampledUser of sampledUsers) {
//         const score = calculateCompatibilityScore(currUser, sampledUser);
//         userDict[sampledUser] = score;
//       }
  
//       // sort dictionary by score and select top 3
//       const sortedEntries = Object.entries(userDict)
//         .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
//         .slice(0, 3);

//       const top3Matches = Object.fromEntries(sortedEntries);
  
//       return top3Matches;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   }
  
//   export { getTop3Matches };

async function getTop3Matches(currUser) {
    try {
      const sampledUsers = await getRandomUsers();
      const scores = [];
  
      // calculate scores
      for (const sampledUser of sampledUsers) {
        const score = calculateCompatibilityScore(currUser, sampledUser);
        scores.push(score);
      }
  
      return scores;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  export { getTop3Matches };