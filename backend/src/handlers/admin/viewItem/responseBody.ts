import { Type, type Static } from "@sinclair/typebox";
import { ClaimStatus, ItemStatus, ItemType, UserProfession } from "../../../generated/enums.js";

const PosterSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: "email" }),

  phone: Type.Optional(Type.String()),
  socialMedia: Type.Optional(Type.String()),

  profession: Type.Optional(
    Type.Unsafe<UserProfession>({
      type: "string",
      enum: ["STUDENT", "TEACHER", "WORKER"],
    }),
  ),
});

const ClaimantSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
    firstName: Type.String(),
    lastName: Type.String(),

    profileKey: Type.Union([
        Type.String(),
        Type.Null(),
    ]),
});

const ClaimHistorySchema = Type.Object({
    id: Type.String({ format: "uuid" }),

    message: Type.Union([
        Type.String(),
        Type.Null(),
    ]),

    status: Type.Enum(ClaimStatus),

    createdAt: Type.String({
        format: "date-time",
    }),

    claimant: ClaimantSchema,
});

const ImageSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
    imageUrl: Type.String(),
});

const ViewItemSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
    title: Type.String(),
    type: Type.Enum(ItemType),
    status: Type.Enum(ItemStatus),

    description: Type.Union([
        Type.String(),
        Type.Null(),
    ]),

    location: Type.String(),

    dateLostOrFound: Type.String({
        format: "date-time",
    }),

    category: Type.Object({
        id: Type.String({ format: "uuid" }),
        name: Type.String(),
    }),

    color: Type.Object({
        id: Type.String({ format: "uuid" }),
        name: Type.String(),
    }),

    images: Type.Array(ImageSchema),

    poster: PosterSchema,

    claims: Type.Array(ClaimHistorySchema),
});

export const ViewItemResponseBodySchema = Type.Object({
  data: ViewItemSchema,
});

export type ViewItemResponseBody = Static<typeof ViewItemResponseBodySchema>;
