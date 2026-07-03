const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tous Les Jours API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/uploads",express.static(path.join(__dirname, "uploads")));


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

module.exports = app;