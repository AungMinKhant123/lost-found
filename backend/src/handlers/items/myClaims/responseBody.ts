import { Type, type Static } from "@sinclair/typebox";
import { ClaimStatus, ItemType } from "../../../generated/enums.js";

const MyClaimItemSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  status: Type.Enum(ClaimStatus),
  createdAt: Type.String(),

  item: Type.Object({
    id: Type.String({ format: "uuid" }),
    type: Type.Enum(ItemType),
    title: Type.String(),
    location: Type.String(),
    dateLostOrFound: Type.String(),

    category: Type.Object({
      id: Type.String({ format: "uuid" }),
      name: Type.String(),
    }),

    color: Type.Object({
      id: Type.String({ format: "uuid" }),
      name: Type.String(),
    }),

    images: Type.Array(
      Type.Object({
        id: Type.String({ format: "uuid" }),
        objectKey: Type.String(),
      }),
    ),
  }),
});

export const MyClaimsResponseBodySchema = Type.Object({
  data: Type.Array(MyClaimItemSchema),

  pagination: Type.Object({
    page: Type.Number(),
    limit: Type.Number(),
    total: Type.Number(),
    totalPages: Type.Number(),
  }),

  counts: Type.Object({
    all: Type.Number(),
    pending: Type.Number(),
    accepted: Type.Number(),
    declined: Type.Number(),
  }),
});

export type MyClaimsResponseBody = Static<typeof MyClaimsResponseBodySchema>;
