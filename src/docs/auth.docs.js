export default {
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register",
        description: "Create new user account",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterBody"
              },
            },
          },
        },
        responses: {
          201: {
            description: "User successfully created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseData"
                },
              },
            },
          },
          400: {
            description: "Validation error",
          },
          409: {
            description: "User already exists",
          },
        },
      },
    },

    "/api/auth/verify": {
      post: {
        summary: "Verify user by OTP",
        description: "Verify user email using OTP sent during registration",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "leomessi@gmail.com",
                  },
                  otp: {
                    type: "string",
                    example: "123456",
                  },
                },
                required: ["email", "otp"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "User successfully verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User successfully verified !",
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
          400: {
            description: "Invalid or expired OTP / Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "OTP invalid",
                    },
                    status: {
                      type: "integer",
                      example: 400,
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User not found",
                    },
                    status: {
                      type: "integer",
                      example: 404,
                    },
                  },
                },
              },
            },
          },
          409: {
            description: "User already verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User already verified",
                    },
                    status: {
                      type: "integer",
                      example: 409,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/resend/otp": {
      post: {
        summary: "Resend OTP",
        description: "Resend OTP to user email if user is not verified",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EmailOnly"
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP sent successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "OTP has been sent, check your email !",
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
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Email is required",
                    },
                    status: {
                      type: "integer",
                      example: 400,
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User not found",
                    },
                    status: {
                      type: "integer",
                      example: 404,
                    },
                  },
                },
              },
            },
          },
          409: {
            description: "User already verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User alredy verified",
                    },
                    status: {
                      type: "integer",
                      example: 409,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/forgot/password": {
      post: {
        summary: "Forgot password",
        description: "Send OTP to user email for password recovery",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EmailOnly"
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP sent successfully for password recovery",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "OTP has been sent, check your email",
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
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Email is required",
                    },
                    status: {
                      type: "integer",
                      example: 400,
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "User not founded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User not founded",
                    },
                    status: {
                      type: "integer",
                      example: 404,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/change/password": {
      post: {
        summary: "Change password",
        description: "Change user password after OTP verification",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "leomessi@gmail.com",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    maxLength: 100,
                    example: "newStrongPassword123",
                  },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password successfully updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Password successfully updated !",
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
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Password is required",
                    },
                    status: {
                      type: "integer",
                      example: 400,
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User not found",
                    },
                    status: {
                      type: "integer",
                      example: 404,
                    },
                  },
                },
              },
            },
          },
          409: {
            description: "User already verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User already verified",
                    },
                    status: {
                      type: "integer",
                      example: 409,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login",
        description: "Login user with email and password",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "leomessi@gmail.com",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    maxLength: 100,
                    example: "leomessi123",
                  },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "User successfully logged in",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User successfully logged in !",
                    },
                    status: {
                      type: "integer",
                      example: 200,
                    },
                    accessToken: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error / Invalid password",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Password invalid",
                    },
                    status: {
                      type: "integer",
                      example: 400,
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User not found",
                    },
                    status: {
                      type: "integer",
                      example: 404,
                    },
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
