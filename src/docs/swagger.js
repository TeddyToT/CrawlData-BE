const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js MeU - Crawl Articles",
      version: "1.0.0",
      description:
        "Backend API for Crawling Articles from tuoitre.vn with Node.js and Express.js",
    },
    servers: [
      {
        url: "http://localhost:8000/",
      },
    ],
    components: {
      schemas: {
        Article: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            url: { type: "string" },
            thumbnail: { type: "string" },
            categoryId: { type: "string" },
            date: { type: "string", format: "date-time" },
            author: { type: "string" },
            sapo: { type: "string" },
            img: { type: "string" },
            photoCaption: { type: "string" },
            content: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            url: { type: "string" },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "..", "router", "api", "*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUiMiddleware: swaggerUi.serve,
  swaggerUiHandler: swaggerUi.setup(swaggerSpec),
};
