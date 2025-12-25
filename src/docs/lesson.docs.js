export default {
  paths: {
    "/api/lesson/create": {
      post: {
        summary: "Create Lesson",
        description: "Only Instructor can create lesson",
        tags: ["Lesson"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/LessonBody",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Lesson successfully created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Lesson successfully created",
                    },
                    status: { type: "integer", example: 201 },
                    data: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 1,
                        },
                        course_id: {
                          type: "integer",
                          example: 2,
                        },
                        title: {
                          type: "string",
                          example: "Introduction to JavaScript",
                        },
                        duration: {
                          type: "string",
                          example: "1:30",
                        },
                        video_url: {
                          type: "string",
                          example:
                            "https://res.cloudinary.com/deavssvrp/video/upload/v1766428239/course_marketplace/videos/xpgjewwjj0nwupqp9y7t.mp4",
                        },
                        video_id: {
                          type: "string",
                          example:
                            "course_marketplace/videos/xpgjewwjj0nwupqp9y7t",
                        },
                      },
                    },
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
                      example: "Validation error",
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
    "/api/lesson/all": {
      get: {
        summary: "Get all lessons",
        description: "Fetched lessons",
        tags: ["Lesson"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Lessons fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/LessonResponse" },
                },
              },
            },
          },
          404: {
            description: "No lessons found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No lessons have been created",
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
    "/api/lesson/get/by/{id}": {
      get: {
        summary: "Get single lesson",
        description: "Fetch a single admin by ID",
        tags: ["Lesson"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the lesson to fetch",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Lesson fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LessonResponse",
                },
              },
            },
          },
          404: {
            description: "Lesson not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Lesson not found" },
                    status: { type: "integer", example: 404 },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/lesson/update/by/{id}": {
      put: {
        summary: "Update admin",
        description:
          "Only Super admin and Admin this Instructor can update an existing lesson's information",
        tags: ["Lesson"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the admin to update",
            schema: { type: "integer", example: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LessonBodyJson",
              },
            },
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/LessonBody",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Lesson successfully updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Lesson successfully updated!",
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
            description: "Lesson not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Lesson not found" },
                    status: { type: "integer", example: 404 },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/lesson/delete/by/{id}": {
      delete: {
        summary: "Delete single lesson",
        description: "Only Super admin and Admin this Intructor fetch a single lesson delete by ID",
        tags: ["Lesson"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the lesson to delete",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Lesson successfully deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Lesson successfully deleted",
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
            description: "Lesson not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Lesson not found" },
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
