import authDocs from "./auth.docs.js";


export default {
    openapi: "3.0.0",
    info: {
        title: "Course-marketplace",
        version: "1.0.0",
    },
    paths: {
        ...authDocs.paths
    },
};