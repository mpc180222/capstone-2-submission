const axios = require('axios');
const db = require("../db");
const Url = require('url');
const CLIENT_ID = '53ca0767b1094ac688996ae59682e82b';
const CLIENT_SECRET = '6946e45af0da4d03bf26de3faf426ac6';

// General-purpose function for returning data from Spotify API

// async function getSpotifyApiResult(endpoint, retrievedToken) {
//     try {
//         let result = await axios.get(`https://api.spotify.com/v1/${endpoint}`,
//             { headers: { 'Authorization': 'Bearer ' + retrievedToken } });
//         return result.data;
//     }
//     catch (e) {
//         console.log(e)
//         return e.response.status;
//     }
// }

// // If a user has a refresh token in the database, exchange it for an access token, otherwise return null/false.

// async function refreshTokenHelper(sessionId) {
//     console.log('refreshfunc')


//     let refreshTokenQuery = await db.query(`SELECT
//     spotify_refresh_token FROM users WHERE reviewify_session_id = $1`, [sessionId]);
//     if (!refreshTokenQuery.rows[0].spotify_refresh_token) return false;
//     console.log(refreshTokenQuery)
//     let refreshToken = refreshTokenQuery.rows[0].spotify_refresh_token;


//     let buffer = new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`);
//     let base64 = buffer.toString('base64');
//     let params = new Url.URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken })
//     let result = await axios.post('https://accounts.spotify.com/api/token', params.toString(), {
//         headers: {
//             'Authorization': 'Basic ' + base64,
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     });

//     let updateUserDbQuery = await db.query(`UPDATE users
//         SET spotify_access_token = $1, spotify_refresh_token = $2
//         WHERE reviewify_session_id = $3
//         RETURNING spotify_access_token`,
//         [result.data.access_token, null, sessionId]);

//     return { token: updateUserDbQuery.rows[0] }
// }

// async function GetArtistInfoHelper(artist_id, sessionId) {

//     let tokenQuery = await db.query(`SELECT
//     spotify_access_token FROM users WHERE reviewify_session_id = $1`, [sessionId]);
//     let retrievedToken = tokenQuery.rows[0].spotify_access_token;

//     let result = await getSpotifyApiResult(`artists/${artist_id}`, retrievedToken);
//     if (result === 401) {
//         let newTokenCall = await refreshTokenHelper(sessionId);
//         if (!newTokenCall) return res.json({ message: 'No refresh token available.' })
//         let newResult = getSpotifyApiResult(`artists/${artist_id}`, newTokenCall.token.spotify_access_token)
//         return newResult;
//     }
//     return result;
// }

// module.exports = { refreshTokenHelper, getSpotifyApiResult, GetArtistInfoHelper };

