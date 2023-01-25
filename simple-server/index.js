const http = require('http')
const fs = require('fs')
const url = require('url');

const hostname = '127.0.0.1'
const port = '8080'

const server = http.createServer((req, res) => {

    const q = url.parse(req.url, true);

  let filename = q.pathname === '/' ? 'index.html' : q.pathname.substring(1) + '.html';

if (!fs.existsSync(filename)) filename = '404.html'

    fs.readFile(filename, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
          } 

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})