export default {
  paths: {
    "/api/category/create": {
      post: {
        summary: "Create Category",
        description: "Only Super admin and Admin can create Category",
        tags: ["Category"],
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
                $ref: "#/components/schemas/CategoryBody",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Category successfully created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Category successfully created",
                    },
                    status: {
                      type: "integer",
                      example: 201,
                    },
                    data: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 1,
                        },
                        name: {
                          type: "string",
                          example: "IT",
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
    "/api/category/all": {
      get: {
        summary: "Get all categories",
        description: "Fetched categories",
        tags: ["Category"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Categories fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/ResponseCategory",
                  },
                },
              },
            },
          },
          404: {
            description: "No categories found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No Categories have been created",
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
    "/api/category/get/by/{id}": {
      get: {
        summary: "Get single Category",
        description: "Fetch a single category by ID",
        tags: ["Category"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the Category to fetch",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Category fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseCategory",
                },
              },
            },
          },
          404: {
            description: "Category not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Category not found",
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
    "/api/category/update/by/{id}": {
      put: {
        summary: "Update Category",
        description: "Only Super admin and Admin can update category",
        tags: ["Category"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the category to update",
            required: true,
            schema: { type: "integer", example: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CategoryBody",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Category successfully updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Category successfully updated",
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
            description: "Category not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Category not found",
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
    "/api/category/delete/by/{id}": {
      delete: {
        summary: "Delete Category",
        description: "Only Super admin and Admin can delete category",
        tags: ["Category"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the category to update",
            required: true,
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Category successfully deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Category successfully deleted",
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
            description: "Category not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Category not found",
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
