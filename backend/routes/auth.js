const db = require("../db");
const express = require("express");
const router = new express.Router();
const cookieParser = require("cookie-parser")
router.use(cookieParser());
const axios = require('axios');
const CLIENT_ID = '53ca0767b1094ac688996ae59682e82b';
const CLIENT_SECRET = '6946e45af0da4d03bf26de3faf426ac6';
const jwt = require("jsonwebtoken");
const { refreshTokenHelper, getSpotifyApiResult } = require('./helpers')
let REDIRECT_URI = 'http://localhost:5000/auth/callback';
const SPOTIFY_AUTH_REDIRECT = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const initVector = crypto.randomBytes(16);
const securityKey = crypto.randomBytes(32);
const Url = require('url');
const SpotifyClientService = require("../models/SpotifyClientService");
const UserManager = require("../models/UserManager");




// ** GET / get overview of user associated with session ID


router.get("/whoami", async function (req, res, next) {

    try {
        if (!req.cookies.sessionId) return res.json({ noUser: 'User not detected' });
        let reviewifyTokenResp = jwt.verify(req.cookies.sessionId, CLIENT_SECRET);
        if (reviewifyTokenResp) return res.json({ isUser: reviewifyTokenResp.username });


    } catch (err) {
        return next(err);
    }
})

// Clear the session ID from the client

router.post("/logout", async function (req, res, next) {

    try {

        res.clearCookie('sessionId');
        res.end();
    }

    catch (err) {
        return next(err);
    }
})

// Initial login route redirecting to Spotify authorization.

router.get("/login", async function (req, res, next) {

    try {
        res.redirect(SPOTIFY_AUTH_REDIRECT);
    }
    catch (err) {
        return next(err);
    }
})


// Route that takes query string from 'login' route and produces access token and refresh token.

router.get("/callback", async function (req, res, next) {

    try {

        let tokenData = await SpotifyClientService.getSpotifyToken(req.query.code);
        let sessionId = await SpotifyClientService.validateUserAndGetSessionId(tokenData);
        res.cookie("sessionId", sessionId, {
            expire: 1 / 24,
            path: '/',
            httpOnly: true
        });
        res.redirect('http://localhost:3000')

    } catch (err) {
        console.log(err);
        return next(err);
    }
})



router.get("/search/:searchTerm", async function (req, res, next) {

    try {
        if (!req.cookies.sessionId) {
            return res.json({ message: 'no token found' })
        }
        else if (req.cookies.sessionId) {
            let result = await SpotifyClientService.getSpotifyApiResult(`search?type=album&q=${req.params.searchTerm}`,
                req.cookies.sessionId);

            if (result === 401) {
                console.log('ATTEMPTING REFRESH TOKEN - INSIDE 401')
                let newTokenCall = await UserManager.checkForAndActivateRefreshToken(req.cookies.sessionId);
                if (!newTokenCall) return res.json({ message: 'No refresh token available.' })
                console.log('REFRESH TOKEN FOUND', newTokenCall)
                let newResult = await SpotifyClientService.getSpotifyApiResult(`search?type=album&q=${req.params.searchTerm}`,
                    sessionId, newTokenCall.token)
                return res.json(newResult.albums.items);
            }
            return res.json(result.albums.items);
        }
    }
    catch (e) {
        console.log(e);
        return next(e);

    }
})


module.exports = {
    router: router
}