const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

let userData = {}; // store temporary data

const server = http.createServer((req, res) => {

  // LOGIN PAGE
  if (req.url === "/" && req.method === "GET") {
    fs.readFile("login.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  // LOGIN SUBMIT
  else if (req.url === "/login" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const data = querystring.parse(body);
      userData.username = data.username;
      res.writeHead(302, { Location: "/purchase" });
      res.end();
    });
  }

  // PURCHASE PAGE
  else if (req.url === "/purchase" && req.method === "GET") {
    fs.readFile("purchase.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  // PURCHASE SUBMIT
  else if (req.url === "/purchase" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const data = querystring.parse(body);
      userData.product = data.product;
      userData.price = data.price;
      res.writeHead(302, { Location: "/profile" });
      res.end();
    });
  }

  // PROFILE PAGE
  else if (req.url === "/profile" && req.method === "GET") {
    fs.readFile("profile.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  // PROFILE SUBMIT + SAVE TO TXT
  else if (req.url === "/profile" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const data = querystring.parse(body);
      userData.name = data.name;
      userData.email = data.email;

      const record = `
Username: ${userData.username}
Product: ${userData.product}
Price: ${userData.price}
Name: ${userData.name}
Email: ${userData.email}
---------------------------
`;

      fs.appendFile("data.txt", record, () => {
        res.writeHead(302, { Location: "/logout" });
        res.end();
      });
    });
  }

  // LOGOUT PAGE
  else if (req.url === "/logout" && req.method === "GET") {
    fs.readFile("logout.html", (err, data) => {
      userData = {}; // clear data
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  // NOT FOUND
  else {
    res.writeHead(404);
    res.end("Page not found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
