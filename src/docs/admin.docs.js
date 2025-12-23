export default {
  paths: {
    "/api/admin/create": {
      post: {
        summary: "Create Admin",
        description: "Create Admin",
        tags: ["Admin"],
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
            description: "Admin successfully created",
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
            description: "Admin already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Admin already exists",
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
    "/api/admin/all": {
      get: {
        summary: "Get all admins",
        description: "Fetch all admins",
        tags: ["Admin"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Admins fetched successfully",
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
            description: "No admins found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No admins have been created",
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
    "/api/admin/by/{id}": {
      get: {
        summary: "Get single admin",
        description: "Fetch a single admin by ID",
        tags: ["Admin"],
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
            description: "Admin fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StudentById",
                },
              },
            },
          },
          404: {
            description: "Admin not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Admin not found" },
                    status: { type: "integer", example: 404 },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/admin/update/by/{id}": {
      put: {
        summary: "Update admin",
        description: "Update an existing admin's information",
        tags: ["Admin"],
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
            description: "Admin successfully updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Admin successfully updated!",
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
            description: "Admin not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Admin not found" },
                    status: { type: "integer", example: 404 },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/admin/delete/by/{id}": {
      delete: {
        summary: "Delete admin",
        description: "Delete an existing admin by ID",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the admin to delete",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Admin successfully deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Admin successfully deleted !",
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
            description: "Admin not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Admin not found" },
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
