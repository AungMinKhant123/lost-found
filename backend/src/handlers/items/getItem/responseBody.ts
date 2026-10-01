import { Type, type Static } from "@sinclair/typebox";
import { ItemStatus, ItemType } from "../../../generated/enums.js";

const ItemImageSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  imageUrl: Type.String(),
});

const ItemCategorySchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
});

const ItemColorSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
});

export const GetItemResponseBodySchema = Type.Object({
  id: Type.String({ format: "uuid" }),

  title: Type.String(),

  description: Type.Union([Type.String(), Type.Null()]),

  type: Type.Enum(ItemType),

  status: Type.Enum(ItemStatus),

  location: Type.String(),

  dateLostOrFound: Type.String(),

  category: ItemCategorySchema,

  color: ItemColorSchema,

  images: Type.Array(ItemImageSchema),
});

export type GetItemResponseBody = Static<typeof GetItemResponseBodySchema>;
