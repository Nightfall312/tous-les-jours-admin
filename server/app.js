const multer = require("multer");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const path = require("path");


const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tous Les Jours API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/uploads",express.static(path.join(__dirname, "uploads")));


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.message && err.message.includes("Only JPG")) {
    return res.status(400).json({
      message: err.message,
    });
  }

  next(err);
});
app.use(errorHandler);

module.exports = app;