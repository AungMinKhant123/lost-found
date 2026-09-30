import { Type, type Static } from "@sinclair/typebox";
import { ClaimStatus, ItemType } from "../../../generated/enums.js";

const MyClaimDetailsResponseSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  status: Type.Enum(ClaimStatus),
  message: Type.String(),
  createdAt: Type.String({ format: "date-time" }),

  item: Type.Object({
    id: Type.String({ format: "uuid" }),
    type: Type.Enum(ItemType),
    title: Type.String(),
    location: Type.String(),
    dateLostOrFound: Type.String({ format: "date-time" }),

    images: Type.Array(
      Type.Object({
        id: Type.String({ format: "uuid" }),
        objectKey: Type.String(),
      }),
    ),
  }),

  poster: Type.Optional(
    Type.Object({
      firstName: Type.String(),
      lastName: Type.String(),
      phone: Type.Optional(Type.String()),
      email: Type.String(),
      profileKey: Type.Optional(Type.String()),
    }),
  ),
});

export const MyClaimDetailsResponseBodySchema = Type.Object({
  data: MyClaimDetailsResponseSchema,
});

export type MyClaimDetailsResponseBody = Static<
  typeof MyClaimDetailsResponseBodySchema
>;