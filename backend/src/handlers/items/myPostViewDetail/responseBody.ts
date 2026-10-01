import { Type, type Static } from '@sinclair/typebox';
import { ClaimStatus, ItemStatus, ItemType } from '../../../generated/enums.js';

const ClaimantSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
    firstName: Type.String(),
    lastName: Type.String(),
    profileKey: Type.Optional(Type.String()),
});

const ClaimSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
    message: Type.Optional(Type.String()),
    status: Type.Enum(ClaimStatus),

    claimant: ClaimantSchema,
});

const ItemImageSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  objectKey: Type.String(),
});

const MyPostDetailsSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  type: Type.Enum(ItemType),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  location: Type.String(),
  dateLostOrFound: Type.String({ format: "date-time" }),
  status: Type.Enum(ItemStatus),

  category: Type.Object({
    id: Type.String({ format: "uuid" }),
    name: Type.String(),
  }),

  color: Type.Object({
    id: Type.String({ format: "uuid" }),
    name: Type.String(),
  }),

  images: Type.Array(ItemImageSchema),
  claims: Type.Array(ClaimSchema),
});

export const MyPostViewDetailResponseBodySchema = Type.Object({
    data: MyPostDetailsSchema,
})

export type MyPostViewDetailResponseBody =
    Static<typeof MyPostViewDetailResponseBodySchema>