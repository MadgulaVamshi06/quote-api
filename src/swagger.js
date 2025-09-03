const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quote API",
      version: "1.0.0",
      description: "API that returns random inspirational quotes with IP-based rate limiting",
    },
    servers: [
      { url: "http://localhost:3000" }
    ],
  },
  apis: ["./src/index.js"],
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUi, specs };
