export default {
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  first_name: {
                    type: "string",
                    minLength: 2,
                    maxLength: 50,
                    default: "Leo",
                  },
                  last_name: {
                    type: "string",
                    minLength: 2,
                    maxLength: 50,
                    default: "Messi",
                  },
                  email: { type: "string", default: "leomessi@gmail.com" },
                  password: {
                    type: "string",
                    minLength: 2,
                    maxLength: 100,
                    default: "leomessi123",
                  },
                  phone_number: {
                    type: "string",
                    pattern: /^\+998[0-9]{9}$/,
                    default: "+998971922227",
                  },
                  role: {
                    type: "string",
                    enum: ["admin", "instructor", "student"],
                    default: "student",
                  },
                },
                required: [
                  "firs_name",
                  "last_name",
                  "email",
                  "password",
                  "phone_number",
                ],
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: "object",
              properties: {
                email: {
                  type: "stpring",
                  default: "leomessi@gmail.com"
                },
                password: {
                  type: "string",
                  minLength: 2,
                  maxLength: 100,
                  default: "leomessi123"
                },
              },
              required: ["email", "password"]
            },
          },
        },
      },
    },
  },
};
