const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Tous Les Jours API",
    description: "Tous Les Jours Backend API",
  },
  host: "localhost:5000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);