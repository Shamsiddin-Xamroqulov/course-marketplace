export default {
  paths: {
    "/api/course/create": {
      post: {
        summary: "Create course",
        description: "Only Instructor can create course",
        tags: ["Course"],
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
                $ref: "#/components/schemas/CourseBody",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Course successfully created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CourseResponse",
                },
              },
            },
          },
          400: {
            description: "Validation Error",
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
        },
      },
    },
    "/api/course/all": {
      get: {
        summary: "Get all courses",
        description: "Fetched courses",
        tags: ["Course"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Courses fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/ResponseCourse",
                  },
                },
              },
            },
          },
          404: {
            description: "No courses found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No Courses have been created",
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
    "/api/course/get/by/{id}": {
      get: {
        summary: "Get single Course",
        description: "Fetch a single course by ID",
        tags: ["Course"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the Course to fetch",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Course fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseCourse",
                },
              },
            },
          },
          404: {
            description: "Course not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Course not found",
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
    "/api/course/update/by/{id}": {
      put: {
        summary: "Update Course",
        description: "Only Super admin and Admin this Instructor can update Course",
        tags: ["Course"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the course to update",
            required: true,
            schema: { type: "integer", example: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CourseBody",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Course successfully updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Course successfully updated",
                    },
                    status: {
                      type: "integer",
                      example: 200,
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Course not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Course not found",
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
    "/api/course/delete/by/{id}": {
      delete: {
        summary: "Delete Course",
        description: "Only Super admin and Admin this Instructor can delete course",
        tags: ["Course"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the course to update",
            required: true,
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Course successfully deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Course successfully deleted",
                    },
                    status: {
                      type: "integer",
                      example: 200,
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Course not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Course not found",
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
  },
};
