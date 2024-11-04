const crypto = require('crypto');

// In-memory URL database
const urlDatabase = {};

// Generate a short URL ID using a secure hash
function generateShortUrlId(url) {
  return crypto.createHash('sha256').update(url).digest('base64').slice(0, 6);
}

// Shorten the URL and store it in the database
function shortenUrl(targetUrl) {
  const shortUrlId = generateShortUrlId(targetUrl);
  urlDatabase[shortUrlId] = targetUrl;
  return shortUrlId;
}

// Get the original URL from the short ID
function getUrl(shortUrlId) {
  return urlDatabase[shortUrlId];
}

module.exports = { shortenUrl, getUrl };
