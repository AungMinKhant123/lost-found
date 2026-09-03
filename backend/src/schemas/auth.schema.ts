export const registerSchema = {
  body: {
    type: "object",
    required: ["username", "email", "password", "position"],
    additionalProperties: false,
    properties: {
      username: {
        type: "string",
        minLength: 1,
      },
      email: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
        minLength: 2,
      },
      phone: {
        type: "string",
        minLength: 1,
      },
      profileUrl: {
        type: "string",
        minLength: 1,
      },
      lineUsername: {
        type: "string",
        minLength: 1,
      },
      facebookUsername: {
        type: "string",
        minLength: 1,
      },
      instagramUsername: {
        type: "string",
        minLength: 1,
      },
      class: {
        type: "string",
        minLength: 1,
      },
      position: {
        type: "string",
        enum: ["STUDENT", "TEACHER", "WORKER"],
      },
    },
  },
} as const;

export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    additionalProperties: false,
    properties: {
      email: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
        minLength: 2,
      },
    },
  },
} as const;
