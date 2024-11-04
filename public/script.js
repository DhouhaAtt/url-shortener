async function shortenUrl() {
  const urlInput = document.getElementById('urlInput').value.trim();
  const messageDiv = document.getElementById('message');
  const resultDiv = document.getElementById('result');

  // Basic URL validation
  if (!urlInput || urlInput.includes(' ')) {
    messageDiv.textContent = 'Invalid URL format. Please enter a valid URL.';
    messageDiv.className = 'message error';
    messageDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    return;
  }

  try {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUrl: urlInput })
    });

    const data = await response.json();

    if (response.ok) {
      resultDiv.innerHTML = `
        <p>Shortened URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
        <span class="copy-icon" onclick="copyToClipboard('${data.shortUrl}')">📋</span></p>
        <img src="${data.qrCode}" alt="QR Code" style="margin-top: 10px;">
      `;
      messageDiv.textContent = 'Success! Your URL has been shortened.';
      messageDiv.className = 'message success';
      resultDiv.style.display = 'block';
    } else {
      messageDiv.textContent = data.error || 'An error occurred. Please try again.';
      messageDiv.className = 'message error';
      resultDiv.style.display = 'none';
    }
  } catch (error) {
    messageDiv.textContent = 'Network error. Please try again later.';
    messageDiv.className = 'message error';
    resultDiv.style.display = 'none';
  }

  messageDiv.style.display = 'block';
}

// Copy the shortened URL to clipboard and update the success message
function copyToClipboard(url) {
  navigator.clipboard.writeText(url).then(() => {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'URL copied to clipboard!';
      messageDiv.className = 'message success';
      messageDiv.style.display = 'block';
  }).catch(err => {
      console.error('Failed to copy: ', err);
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'Failed to copy URL. Please try again.';
      messageDiv.className = 'message error';
      messageDiv.style.display = 'block';
  });
}
