const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// For testing purposes, export the app
module.exports = app;

// Only listen if not in a test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Backend app listening at http://localhost:${port}`);
  });
}
