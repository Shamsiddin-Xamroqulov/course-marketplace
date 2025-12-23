export default {
  paths: {
    "/api/student/create": {
      post: {
        summary: "Create student",
        description: "Create new student",
        tags: ["Student"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterBody",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Student successfully created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResponseData" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Validation error message",
                    },
                    status: { type: "integer", example: 400 },
                  },
                },
              },
            },
          },
          409: {
            description: "Student already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Student already exists",
                    },
                    status: { type: "integer", example: 409 },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/student/all": {
      get: {
        summary: "Get all students",
        description: "Fetch all students",
        tags: ["Student"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Students fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Student" },
                },
              },
            },
          },
          404: {
            description: "No students found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "No students have been created",
                    },
                    status: { type: "integer", example: 404 },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/student/by/{id}": {
      get: {
        summary: "Get single student",
        description: "Fetch a single student by ID",
        tags: ["Student"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the student to fetch",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Student fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StudentById",
                },
              },
            },
          },
          404: {
            description: "Student not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Student not found" },
                    status: { type: "integer", example: 404 },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/student/update/by/{id}": {
      put: {
        summary: "Update student",
        description: "Update an existing student's information",
        tags: ["Student"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the student to update",
            schema: { type: "integer", example: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateStudentBody",
              },
            },
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/UpdateStudentFormBody",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Student successfully updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Student successfully updated!",
                    },
                    status: { type: "integer", example: 200 },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Validation error message",
                    },
                    status: { type: "integer", example: 400 },
                  },
                },
              },
            },
          },
          404: {
            description: "Student not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Student not found" },
                    status: { type: "integer", example: 404 },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/student/delete/by/{id}": {
      delete: {
        summary: "Delete student",
        description: "Delete an existing student by ID",
        tags: ["Student"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the student to delete",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Student successfully deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Student successfully deleted !",
                    },
                    status: { type: "integer", example: 200 },
                  },
                },
              },
            },
          },
          400: {
            description: "Params Id is required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Params Id is required",
                    },
                    status: { type: "integer", example: 400 },
                  },
                },
              },
            },
          },
          404: {
            description: "Student not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Student not found" },
                    status: { type: "integer", example: 404 },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
