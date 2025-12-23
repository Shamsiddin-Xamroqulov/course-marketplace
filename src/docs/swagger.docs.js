import authDocs from "./auth.docs.js";

export default {
  openapi: "3.0.0",
  info: {
    title: "Course-marketplace",
    version: "1.0.0",
    description: "Course-marketplace Api docmentation"
  },
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  servers: [{ url: "http://localhost:4000", description: "Local server" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    ...authDocs.paths,
  },
};
