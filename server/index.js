require("dotenv").config();

const express = require("express");
const { connectDB } = require("./db");
const path = require("path");

const app = express();
app.use(express.json()); // middleware to read json objects from the request body\

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

const router = require("./routes");

app.use("/api", router);

const port = process.env.PORT || 4444;

async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
startServer();
