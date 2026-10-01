import { Type, type Static } from "@sinclair/typebox";
import { ClaimStatus, ItemStatus, ItemType } from "../../../generated/enums.js";

const ItemImageSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  imageUrl: Type.String(),
});

const CategorySchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
});

const ColorSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
});

const ClaimantSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String(),
  phone: Type.Union([Type.String(), Type.Null()]),
  profileKey: Type.Union([Type.String(), Type.Null()]),
  profileUrl: Type.Union([Type.String(), Type.Null()]),
});

const ClaimSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  message: Type.Union([Type.String(), Type.Null()]),
  status: Type.Enum(ClaimStatus),
  createdAt: Type.String(),
  claimant: ClaimantSchema,
});

export const GetItemClaimsResponseBodySchema = Type.Object({
  item: Type.Object({
    id: Type.String({ format: "uuid" }),
    title: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    type: Type.Enum(ItemType),
    status: Type.Enum(ItemStatus),
    location: Type.String(),
    dateLostOrFound: Type.String(),
    category: CategorySchema,
    color: ColorSchema,
    images: Type.Array(ItemImageSchema),
  }),

  claims: Type.Array(ClaimSchema),
});

export type GetItemClaimsResponseBody = Static<
  typeof GetItemClaimsResponseBodySchema
>;
