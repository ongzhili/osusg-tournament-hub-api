require("dotenv").config();

// Middleware to check API key
function simpleAPIKeyVerifier(req, res, next) {
  const apiKey = req.get("X-Api-Key"); // read from request header

  if (apiKey !== process.env.api_key) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

module.exports = simpleAPIKeyVerifier;
