const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const outputFile = "./swagger.json";
const endpointsFiles = ["./server.js"];

const doc = {
  info: {
    title: "Koala Time-Map API",
    description: "Description",
  },
  host: "localhost:3001",
  schemes: ["http"],
};
swaggerAutogen(outputFile, endpointsFiles, doc);
