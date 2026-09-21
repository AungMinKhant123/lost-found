import { Type, type Static } from "@sinclair/typebox";

const ItemCategorySchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
})

const ItemColorSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
})

const ItemImageSchema = Type.Object({
  id: Type.String(),
  imageUrl: Type.String(),
})

const ItemSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.Union([
    Type.String(),
    Type.Null()
  ]),
  type: Type.String(),
  status: Type.String(),
  location: Type.String(),
  dateLostOrFound: Type.String(),

  category: ItemCategorySchema,
  color: ItemColorSchema,

  images: Type.Array(ItemImageSchema),
});

export const ItemListsResponseBodySchema = Type.Object({
  data: Type.Array(ItemSchema),

  pagination: Type.Object({
    page: Type.Number(),
    limit: Type.Number(),
    total: Type.Number(),
    totalPages: Type.Number(),
  }),
});

export type ItemListsResponseBody = Static<typeof ItemListsResponseBodySchema>;
