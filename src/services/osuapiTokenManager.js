const axios = require("axios");
require("dotenv").config();

const CLIENT_ID = process.env.osuapi_client_id;
const CLIENT_SECRET = process.env.osuapi_client_secret;
const TOKEN_URL = "https://osu.ppy.sh/oauth/token";

let cachedToken = null;
let tokenExpiry = null;

/**
 * Get osu! API access token.
 * @param {boolean} forceRefresh - If true, fetch a new token even if cached.
 */
async function getToken(forceRefresh = false) {
    const now = Date.now();

    if (!forceRefresh && cachedToken && tokenExpiry && now < tokenExpiry) {
        console.log("returning token")
        return cachedToken;
    }

    try {
        const params = new URLSearchParams();
        params.append("client_id", CLIENT_ID);
        params.append("client_secret", CLIENT_SECRET);
        params.append("grant_type", "client_credentials");
        params.append("scope", "public");

        const response = await axios.post(TOKEN_URL, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
        });

        const data = response.data;
        cachedToken = data.access_token;
        tokenExpiry = now + data.expires_in * 1000 - 5000; // 5s buffer
        console.log(data.expires_in);
        return cachedToken;
    } catch (err) {
        console.error("Error fetching osu token:", err.response?.data || err.message);
        throw err;
    }
}

module.exports = { getToken };
