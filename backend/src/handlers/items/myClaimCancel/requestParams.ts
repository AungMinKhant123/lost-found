import { Type, type Static } from '@sinclair/typebox'

export const MyClaimCancelRequestParamsSchema = Type.Object({
    claimId: Type.String({ format: "uuid" }),
})

export type MyClaimCancelRequestParams =
    Static<typeof MyClaimCancelRequestParamsSchema>