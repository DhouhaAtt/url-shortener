require('dotenv').config();
const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const { shortenUrl, getUrl } = require('./utils/shorten');
const validUrl = require('valid-url');

const app = express();
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to shorten URLs
app.post('/api/shorten', async (req, res) => {
  const { targetUrl } = req.body;

  // Validate URL format
  if (!targetUrl || !validUrl.isUri(targetUrl)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const shortUrlId = shortenUrl(targetUrl);
  const shortUrl = `http://${HOSTNAME}:${PORT}/${shortUrlId}`;

  try {
    // Generate the QR code
    const qrCode = await QRCode.toDataURL(shortUrl);
    // Return both short URL and QR code
    res.json({ shortUrl, qrCode });
  } catch (err) {
    console.error('QR code generation error:', err);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Redirect shortened URLs
app.get('/:shortUrlId', (req, res) => {
  const targetUrl = getUrl(req.params.shortUrlId);

  if (targetUrl) {
    res.redirect(targetUrl);
  } else {
    res.status(404).send('Short URL not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});