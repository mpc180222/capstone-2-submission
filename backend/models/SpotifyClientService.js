const db = require("../db");
const User = require("./UserManager");
const express = require("express");
const router = new express.Router();
const cookieParser = require("cookie-parser")
router.use(cookieParser());
const axios = require('axios');
const CLIENT_ID = '53ca0767b1094ac688996ae59682e82b';
const CLIENT_SECRET = '6946e45af0da4d03bf26de3faf426ac6';
const jwt = require("jsonwebtoken");
const { refreshTokenHelper, getSpotifyApiResult } = require('../routes/helpers')
let REDIRECT_URI = 'http://localhost:5000/auth/callback';
const SPOTIFY_AUTH_REDIRECT = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const initVector = crypto.randomBytes(16);
const securityKey = crypto.randomBytes(32);
const Url = require('url');

class SpotifyClientService {

    static async getSpotifyApiResult(endpoint, sessionId, newlyRefreshedToken) {
        try {
            let retrievedToken = !newlyRefreshedToken ? await User.getUserToken(sessionId) : newlyRefreshedToken;
            let result = await axios.get(`https://api.spotify.com/v1/${endpoint}`,
                { headers: { 'Authorization': 'Bearer ' + retrievedToken } });
            return result.data;
        }
        catch (e) {
            console.log(e)
            return e.response.status;
        }
    }

    static async getSpotifyToken(code) {

        let buffer = new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`);
        let base64 = buffer.toString('base64');
        let params = new Url.URLSearchParams({ grant_type: "authorization_code", code: `${code}`, redirect_uri: `${REDIRECT_URI}` })
        let result = await axios.post('https://accounts.spotify.com/api/token', params.toString(), {
            headers: {
                'Authorization': 'Basic ' + base64,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log(result.data);
        return result.data;
    }


    static async validateUserAndGetSessionId(data) {

        let userReq = await axios.get('https://api.spotify.com/v1/me',
            { headers: { 'Authorization': 'Bearer ' + data.access_token } });
        let userDetails = userReq.data;
        let sessionIdPayload = { username: userDetails.display_name };
        let sessionId = jwt.sign(sessionIdPayload, CLIENT_SECRET);
        await User.addUpdateUser(userDetails.display_name, sessionId, data);
        return sessionId;

    }



}


module.exports = SpotifyClientService;