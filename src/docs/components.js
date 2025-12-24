export default {
  schemas: {
    EmailOnly: {
      type: "object",
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "leomessi@gmail.com",
        },
      },
      required: ["email"],
    },
    RegisterBody: {
      type: "object",
      properties: {
        first_name: {
          type: "string",
          minLength: 2,
          maxLength: 50,
          example: "Leo",
        },
        last_name: {
          type: "string",
          minLength: 2,
          maxLength: 50,
          example: "Messi",
        },
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
        phone_number: {
          type: "string",
          pattern: "^\\+998[0-9]{9}$",
          example: "+998971922227",
        },
        role: {
          type: "string",
          enum: ["admin", "instructor", "student"],
          example: "student",
        },
      },
      required: [
        "first_name",
        "last_name",
        "email",
        "password",
        "phone_number",
      ],
    },
    ResponseData: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
        message: {
          type: "string",
          example: "User successfully created !",
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
            first_name: {
              type: "string",
              example: "Leo",
            },
            last_name: {
              type: "string",
              example: "Messi",
            },
            email: {
              type: "string",
              format: "email",
              example: "leomessi@gmail.com",
            },
            role: {
              type: "string",
              enum: ["admin", "instructor", "student"],
              example: "student",
            },
            is_verified: {
              type: "boolean",
              example: false,
            },
          },
        },
      },
    },
    StudentById: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        first_name: { type: "string", example: "Leo" },
        last_name: { type: "string", example: "Messi" },
        email: {
          type: "string",
          format: "email",
          example: "leomessi@gmail.com",
        },
        role: { type: "string", enum: ["student"], example: "student" },
        is_verified: { type: "boolean", example: true },
        phone_number: { type: "string", example: "+998971922227" },
      },
    },
    UpdateStudentBody: {
      type: "object",
      properties: {
        first_name: {
          type: "string",
          minLength: 2,
          maxLength: 50,
          example: "Leo",
        },
        last_name: {
          type: "string",
          minLength: 2,
          maxLength: 50,
          example: "Messi",
        },
        email: {
          type: "string",
          format: "email",
          example: "leomessi@gmail.com",
        },
        password: {
          type: "string",
          minLength: 6,
          maxLength: 100,
          example: "newpassword123",
        },
        phone_number: {
          type: "string",
          pattern: "^\\+998[0-9]{9}$",
          example: "+998971922227",
        },
        role: {
          type: "string",
          enum: ["student", "instructor", "admin"],
          example: "student",
        },
      },
    },
    UpdateStudentFormBody: {
      type: "object",
      properties: {
        first_name: {
          type: "string",
          minLength: 2,
          maxLength: 50,
          example: "Leo",
        },
        last_name: {
          type: "string",
          minLength: 2,
          maxLength: 50,
          example: "Messi",
        },
        email: {
          type: "string",
          format: "email",
          example: "leomessi@gmail.com",
        },
        password: {
          type: "string",
          minLength: 6,
          maxLength: 100,
          example: "newpassword123",
        },
        phone_number: {
          type: "string",
          pattern: "^\\+998[0-9]{9}$",
          example: "+998971922227",
        },
        role: {
          type: "string",
          enum: ["student", "instructor", "admin"],
          example: "student",
        },
        avatar: {
          type: "string",
          format: "binary",
          description: "Student avatar image",
        },
      },
    },
    CategoryBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
          maxLength: 50,
          example: "IT",
        },
      },
      required: ["name"],
    },
    ResponseCategory: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "IT" },
      },
      required: ["name"],
    },
    CourseBody: {
      type: "object",
      properties: {
        instructor_id: {
          type: "integer",
          example: 1,
        },
        category_id: {
          type: "integer",
          example: 2,
        },
        name: {
          type: "string",
          example: "Backend (Bootcamp)",
        },
        description: {
          type: "string",
          example: "Node.js (Bootcamp) course covers the latest technologies",
        },
        price: {
          type: "number",
          example: 1200000.0,
        },
        level: {
          type: "array",
          items: {
            type: "string",
            enum: ["beginner", "intermediate", "advanced"],
          },
          example: "beginner",
        },
        is_free: {
          type: "boolean",
          example: false,
        },
        lesson_count: {
          type: "integer",
          example: 3,
        },
        technologies: {
          type: "array",
          items: {
            type: "string",
            enum: ["Node.js", "Python", "PHP", "..."],
          },
          example: ["Node.js", "TypeScript", "Express"],
        },
      },
      required: [
        "instructor_id",
        "course_id",
        "name",
        "description",
        "price",
        "level",
        "is_free",
        "lesson_count",
        "technologies",
      ],
    },
    CourseResponse: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
        message: {
          type: "string",
          example: "Course successfully created",
        },
        status: {
          type: "integer",
          example: 201,
        },
        data: {
          type: "object",
          properties: {
            instructor_id: {
              type: "integer",
              example: 1,
            },
            category_id: {
              type: "integer",
              example: 2,
            },
            name: {
              type: "string",
              example: "Backend (Bootcamp)",
            },
            description: {
              type: "string",
              example:
                "Node.js (Bootcamp) course covers the latest technologies",
            },
            price: {
              type: "number",
              example: 1200000.0,
            },
            level: {
              type: "array",
              items: {
                type: "string",
                enum: ["beginner", "intermediate", "advanced"],
              },
              example: "beginner",
            },
            is_free: {
              type: "boolean",
              example: false,
            },
            lesson_count: {
              type: "integer",
              example: 3,
            },
            technologies: {
              type: "array",
              items: {
                type: "string",
                enum: ["Node.js", "Python", "PHP", "..."],
              },
              example: ["Node.js", "TypeScript", "Express"],
            },
          },
        },
      },
    },
    ResponseCourse: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        instructor_id: {
          type: "integer",
          example: 1,
        },
        category_id: {
          type: "integer",
          example: 2,
        },
        name: {
          type: "string",
          example: "Backend (Bootcamp)",
        },
        description: {
          type: "string",
          example: "Node.js (Bootcamp) course covers the latest technologies",
        },
        price: {
          type: "number",
          example: 1200000.0,
        },
        level: {
          type: "array",
          items: {
            type: "string",
            enum: ["beginner", "intermediate", "advanced"],
          },
          example: "beginner",
        },
        is_free: {
          type: "boolean",
          example: false,
        },
        lesson_count: {
          type: "integer",
          example: 3,
        },
        technologies: {
          type: "array",
          items: {
            type: "string",
            enum: ["Node.js", "Python", "PHP", "..."],
          },
          example: ["Node.js", "TypeScript", "Express"],
        },
      },
    },
  },
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};
