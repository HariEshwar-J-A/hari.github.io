const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {

    // Build file path
    let filePath = path.join(
        __dirname,
        req.url === '/' ? 'index.html' : req.url
    );

    // Extension of file
    let extname = path.extname(filePath);

    //Initial content type
    let contentType = "text.html";

    // Check ext and set content type
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
    }

    // Read file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                //Page Not Found
                fs.readFile(path.join(__dirname, '404.html'), (err, cont) => {
                    res.writeHead(200, { 'Content-type': 'text/html' });
                    res.end(cont, 'utf8');
                })
            } else {
                // Some server error
                res.writeHead(500);
                res.end(content, 'utf8');
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-type': contentType });
            res.end(content, 'utf8');
        }
    })
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log('Server running on PORT: ' + PORT));