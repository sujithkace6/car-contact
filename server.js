require("dotenv").config();

const http = require("http");
const fs = require("fs");
const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const server = http.createServer(async (req, res) => {

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

        console.log(
            "Environment check:",
            "OWNER =", !!process.env.OWNER_PHONE_NUMBER,
            "TWILIO =", !!process.env.TWILIO_PHONE_NUMBER,
            "SID =", !!process.env.TWILIO_ACCOUNT_SID,
            "TOKEN =", !!process.env.TWILIO_AUTH_TOKEN
        );

        try {

            console.log("📡 About to contact Twilio...");

            const call = await client.calls.create({
                to: process.env.OWNER_PHONE_NUMBER,
                from: process.env.TWILIO_PHONE_NUMBER,
                twiml: "<Response><Say>Someone needs you at your car.</Say></Response>"
            });

            console.log("✅ Twilio responded.");
            console.log("📞 Call started:", call.sid);

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                success: true,
                message: "Owner contact request received!"
            }));

        } catch (error) {

            console.error("❌ Twilio error:", error);

            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                success: false,
                message: "Could not call the owner."
            }));
        }

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