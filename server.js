const path = require('path');
const express = require('express');
const favicon = require('express-favicon');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));
app.use(favicon('public/assets/icons/icons8-coordinate-system-30.png'));

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
