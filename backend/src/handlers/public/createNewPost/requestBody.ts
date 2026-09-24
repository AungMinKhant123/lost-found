import { Type, type Static } from "@sinclair/typebox";
import { ItemType } from "../../../generated/enums.js";

export const CreateNewPostRequestBodySchema = Type.Object({
  type: Type.Enum(ItemType),

  title: Type.String({ minLength: 1 }),

  categoryId: Type.String({ format: "uuid" }),

  location: Type.String({ minLength: 1 }),

  colorId: Type.String({ format: "uuid" }),

  dateLostOrFound: Type.String({ format: "date-time" }),

  description: Type.String(),

  // images: Type.Optional(
  //   Type.Array(
  //     Type.String({ format: "uri" })
  //   )
  // ),
});

export type CreateNewPostRequestBody = Static<
  typeof CreateNewPostRequestBodySchema
>;