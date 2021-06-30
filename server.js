const fs = require('fs');
const path = require('path');
const express = require('express');
const https = require('https');
const favicon = require('express-favicon');
const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// Https redirect
app.use((req, res, next) => {
    if (!req.secure) {
        const redirectTo = 'https://' + req.headers.host.split(':')[0] + req.url;
        console.log(redirectTo);
        return res.redirect(redirectTo);
    }

    return next();
});

app.use(express.json());
app.use(express.static('public'));

app.use(favicon('public/assets/icons/icons8-coordinate-system-30.png'));

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const key = fs.readFileSync(path.join(__dirname, 'https', 'key.pem'));
const cert = fs.readFileSync(path.join(__dirname, 'https', 'cert.pem'));

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});

// Only for local development
if (!process.env.PORT) {
    https.createServer({key: key, cert: cert}, app).listen(443, () => {
        console.log(`Local https server listening on port 443...`);
    });
}
