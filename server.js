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
       res.send(data);
     } catch (error) {
       res.status(500).send('Error: ' + error.message);
     }
   });

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log('Proxy running on port ' + PORT));
```
   Click **"Commit new file"**

### **Step 4: Copy Your Repository URL**

On your GitHub repo page, look at the top - you'll see a URL like:
```
https://github.com/YOUR_USERNAME/webos-proxy
