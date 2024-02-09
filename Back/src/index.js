const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const UserRoutes = require("./routes/user-routes");
const cors = require("cors");
const app = express();
const port = 4000;

const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Voilà la réponse du serveur !");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//server.listen(process.env.PORT || 3000);

mongoose.connect(
  "mongodb+srv://thiziri:ziri00@cluster0.7qep7x4.mongodb.net/nom-de-votre-base-de-données",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "Erreur de connexion à la base de données :")
);
db.once("open", () => {
  console.log("Connexion réussie à la base de données MongoDB");
});

app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Autoriser l'envoi de cookies avec la requête
  })
);
app.use("/users", UserRoutes);
