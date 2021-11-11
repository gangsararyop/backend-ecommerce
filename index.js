require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5005;
const cors = require("cors");
const bearerToken = require("express-bearer-token");
const morgan = require("morgan");
const { connection } = require("./src/connection");

const { authRoutes, productRoutes } = require("./src/routes");

// Middleware global start
morgan.token("date", (req, res) => {
  return new Date();
});
app.use(
  morgan("method :url :status :res[content-length] - :response-time ms :date")
);
app.use(express.json());
app.use(
  cors({
    exposedHeaders: [
      "x-token-verify",
      "x-token-access",
      "x-token-refresh",
      "x-total-count",
    ], // To put token in headers
  })
);
app.use(bearerToken());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.listen(5005, () => console.log(`API running`));
