const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('URL required');
  
  try {
    const response = await fetch(url);
    const data = await response.text();
    
    // Get content type
    const contentType = response.headers.get('content-type') || 'text/html';
    
    // Set headers WITHOUT frame-blocking ones
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // DO NOT copy X-Frame-Options or CSP headers
    
    res.send(data);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy running on port ' + PORT));
