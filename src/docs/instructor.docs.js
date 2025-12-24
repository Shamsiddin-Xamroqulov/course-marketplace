export default {
  paths: {
    "/api/instructor/create": {
      post: {
        summary: "Create Instructor",
        description: "Only Super admin and Admin can create",
        tags: ["Instructor"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "appliaction/json": {
              schema: {
                $ref: "#/components/schemas/RegisterBody",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Instructor successfully created",
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
            description: "Instructor already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Instructor already exists",
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
    "/api/insturctor/all": {
      get: {
        summary: "Get all insturctors",
        description: "Only Super admin and Admin can fetched instructors",
        tags: ["Instructor"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Instructors fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/StudentById" },
                },
              },
            },
          },
          404: {
            description: "No instructors found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No instructors have been created",
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
    "/api/instructor/get/by/{id}": {
      get: {
        summary: "Get single instructor",
        description:
          "Only Super admin and Admin can fetch a single instructor by ID",
        tags: ["Instructor"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the Instructor to fetch",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Instructor fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StudentById",
                },
              },
            },
          },
          404: {
            description: "Instructor not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Instructor not found",
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
    "/api/instructor/update/by/{id}": {
      put: {
        summary: "Update Instructor",
        description:
          "Only Super admin and Admin this Instructor can update an existing instructor's information",
        tags: ["Instructor"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the instructor to update",
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
            description: "Instructor successfully updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Instructor successfully updated!",
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
            description: "Instructor not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Instructor not found",
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
    "/api/insturctor/delete/by/{id}": {
      delete: {
        summary: "Delete Instructor",
        description:
          "Only Super admin and Admin can delete an existing instructor by ID",
        tags: ["Instructor"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the instructor to delete",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Instructor successfully deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Instructor successfully deleted !",
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
            description: "Intructor not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Instructor not found",
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
