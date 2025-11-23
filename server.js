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
    let data = await response.text();
    
    // AGGRESSIVE: Strip frame-busting scripts and meta tags
    data = data.replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');
    data = data.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '');
    data = data.replace(/if\s*\(\s*top\s*!=\s*self\s*\)/gi, 'if(false)');
    data = data.replace(/if\s*\(\s*top\s*!==\s*self\s*\)/gi, 'if(false)');
    
    const contentType = response.headers.get('content-type') || 'text/html';
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    
    res.send(data);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy running on port ' + PORT));
