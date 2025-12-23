import adminDocs from "./admin.docs.js";
import authDocs from "./auth.docs.js";
import components from "./components.js";
import studentDocs from "./student.docs.js";

export default {
  openapi: "3.0.0",
  info: {
    title: "Course-marketplace",
    version: "1.0.0",
    description: "Course-marketplace Api docmentation",
  },
  servers: [{ url: "http://127.0.0.1:4000", description: "Local server" }],
  components: {
    schemas: {
      ...components.schemas,
    },
    securitySchemes: {
      ...components.securitySchemes,
    },
  },
  paths: {
    ...authDocs.paths,
    ...studentDocs.paths,
    ...adminDocs.paths
  },
};
