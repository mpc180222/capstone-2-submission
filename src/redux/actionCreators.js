import axios from 'axios';



export function getAlbumFromApi(id, token) {

    return async function (dispatch) {
        let res = await axios.get(`https://api.spotify.com/v1/albums/${id}`, { headers: { 'Authorization': 'Bearer ' + token } });

        dispatch({
            type: "LOAD-ALBUM",
            payload: res.data
        });

    }
}

export function getSearchResultFromApi(token, searchTerm) {

    return async function (dispatch) {
        let res = await axios.get(`https://api.spotify.com/v1/search?type=album&q=${searchTerm}`, { headers: { 'Authorization': 'Bearer ' + token } });

        dispatch({
            type: "LOAD-SEARCH-RESULTS",
            payload: res.data
        });

    }
}

export function getAllReviewsFromApi() {

    return async function (dispatch) {
        let res = await axios.get(`/reviews`);

        dispatch({
            type: "LOAD-REVIEW-LIST",
            payload: res.data
        });
    }
}

export function getAllArtistsFromApi() {

    return async function (dispatch) {
        let res = await axios.get(`/reviews/artists`);

        dispatch({
            type: "LOAD-ARTISTS-LIST",
            payload: res.data
        });
    }
}

export function getArtistReviewsFromApi(artist) {

    return async function (dispatch) {
        let res = await axios.get(`/reviews/artists/${artist}`);

        dispatch({
            type: "LOAD-ARTIST-REVIEW-LIST",
            payload: res.data
        });
    }
}

export function getReviewIndexFromApi() {

    return async function (dispatch) {
        let res = await axios.get(`/reviews/index`);

        dispatch({
            type: "LOAD-REVIEW-INDEX",
            payload: res.data
        });
    }
}


export function checkUser() {

    return async function (dispatch) {
        let res = await axios.get('/auth/whoami');
        dispatch({
            type: "LOAD-CURR-USER",
            payload: res.data
        })

    }

}

export function getSingleReviewFromApi(id) {

    return async function (dispatch) {
        let res = await axios.get(`/reviews/${id}`);
        dispatch({
            type: "LOAD-ACTIVE-REVIEW",
            payload: res.data
        });

    }
}


