const compression = require('compression');
const express = require('express');
const app = express();
const port = process.env.PORT || 4200;

// Gzip
app.use(compression());

// Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/dist'));

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/dist/fuse/index.html');
});

// Start the app by listening on the default Heroku port
app.listen(port);

console.log(`Servidor esta escutando na porta ${port}`);