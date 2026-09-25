const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

    if (req.url === "/") {

        const html = fs.readFileSync("index.html");

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(html);

        return;
    }

    if (req.url === "/contact-owner") {

        console.log("🚨 Someone requested the car owner!");

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            success: true,
            message: "Owner contact request received!"
        }));

        return;
    }

    res.writeHead(404, {
        "Content-Type": "text/plain"
    });

    res.end("Not found");
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});