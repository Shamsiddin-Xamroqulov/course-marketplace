import adminDocs from "./admin.docs.js";
import authDocs from "./auth.docs.js";
import categoryDocs from "./category.docs.js";
import components from "./components.js";
import courseDocs from "./course.docs.js";
import instructorDocs from "./instructor.docs.js";
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
    ...adminDocs.paths,
    ...instructorDocs.paths,
    ...studentDocs.paths,
    ...categoryDocs.paths,
    ...courseDocs.paths
  },
};
