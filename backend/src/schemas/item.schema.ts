export const itemImageSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    itemId: {
      type: "string",
    },
    imageUrl: {
      type: "string",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["id", "itemId", "imageUrl", "createdAt"],
} as const;

export const itemSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    userId: {
      type: "string",
    },
    type: {
      type: "string",
      enum: ["LOST", "FOUND"],
    },
    title: {
      type: "string",
    },
    description: {
      type: "string",
      nullable: true,
    },
    categoryId: {
      type: "string",
    },
    location: {
      type: "string",
    },
    colorId: {
      type: "string",
    },
    dateLostOrFound: {
      type: "string",
      format: "date-time",
    },
    status: {
      type: "string",
      enum: ["OPEN", "RESOLVED"],
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
    createdById: {
      type: "string",
    },
    updatedById: {
      type: "string",
    },
    images: {
      type: "array",
      items: itemImageSchema,
    },
  },
  required: [
    "id",
    "userId",
    "type",
    "title",
    "categoryId",
    "location",
    "colorId",
    "dateLostOrFound",
    "status",
    "createdAt",
    "updatedAt",
    "createdById",
    "updatedById",
    "images",
  ],
} as const;

export const createItemBodySchema = {
  type: "object",
  required: [
    "type",
    "title",
    "categoryId",
    "location",
    "colorId",
    "dateLostOrFound",
  ],
  additionalProperties: false,
  properties: {
    type: {
      type: "string",
      enum: ["LOST", "FOUND"],
    },
    title: {
      type: "string",
      minLength: 1,
    },
    description: {
      type: "string",
      minLength: 1,
    },
    categoryId: {
      type: "string",
      minLength: 1,
    },
    location: {
      type: "string",
      minLength: 1,
    },
    colorId: {
      type: "string",
      minLength: 1,
    },
    dateLostOrFound: {
      type: "string",
      format: "date-time",
    },
    imageUrls: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
      },
      uniqueItems: true,
    },
  },
} as const;
