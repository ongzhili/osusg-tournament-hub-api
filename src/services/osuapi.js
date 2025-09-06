const { RateLimiter } = require("limiter");
const { getToken } = require("./osuapiTokenManager");
const axios = require("axios");

class osuAPIV2 {
    constructor(options = {}) {
        this.disableRateLimiting = options.disableRateLimiting || false;
        this.requestsPerMinute = options.requestsPerMinute || 60;
        this.baseURL = options.baseURL || "https://osu.ppy.sh/api/v2";
        
        if (!this.disableRateLimiting) {
            this.bucket = new RateLimiter({
                tokensPerInterval: this.requestsPerMinute, 
                interval: "minute",
            });
        }
    }

    getBeatmaps(ids) {
      const params = new URLSearchParams();
      ids.forEach(id => params.append('ids[]', id));
      const endpoint = `/beatmaps?${params.toString()}`;
      return this.get(endpoint);
    }

    async post(endpoint, payload) {
        let accessToken = await getToken();

        if (this.bucket) 
            await this.bucket.removeTokens(1);
        
        const { data } = await axios.post(this.baseURL + endpoint, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data;
    }

    async get(endpoint) {
        let accessToken = await getToken();
        console.log(endpoint)
        if (this.bucket) 
            await this.bucket.removeTokens(1);
        
        const { data } = await axios.get(this.baseURL + endpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data;
    }
}

const osu = new osuAPIV2(process.env.OSU_CLIENT_ID, process.env.OSU_CLIENT_SECRET);

module.exports = osu;