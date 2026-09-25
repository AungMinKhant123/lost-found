import type { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";
import { UserProfession } from "../../../generated/enums.js";

import type { ProfileEditResponseBody } from "./responseBody.js";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function profileEditHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ProfileEditResponseBody> {
  const userId = request.user.userId;

  // Get the current user's existing profile.
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profileKey: true,
      socialMedia: true,
      profession: true,
      aboutMe: true,
    },
  });

  // The authenticated user should exist.
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  let fullName: string | undefined;
  let phone: string | undefined;
  let socialMedia: string | undefined;
  let profession: string | undefined;
  let aboutMe: string | undefined;

  let newProfileKey: string | undefined;

  let databaseUpdated = false;

  const bucketName = process.env.MINIO_BUCKET || "lost-found";

  try {
    const parts = request.parts();

    for await (const part of parts) {
      if (part.type === "field") {
        switch (part.fieldname) {
          case "fullName":
            fullName = String(part.value);
            break;

          case "phone":
            phone = String(part.value);
            break;

          case "socialMedia":
            socialMedia = String(part.value);
            break;

          case "profession":
            profession = String(part.value);
            break;

          case "aboutMe":
            aboutMe = String(part.value);
            break;

          default:
            // Ignore unknown text fields.
            break;
        }

        continue;
      }

      if (part.type === "file") {
        if (part.fieldname !== "profileImage") {
          part.file.resume();

          throw new AppError("Only profileImage is allowed.", 400);
        }

        if (!ALLOWED_IMAGE_TYPES.includes(part.mimetype)) {
          part.file.resume();

          throw new AppError(
            "Only JPEG, PNG, and WebP images are allowed.",
            400,
          );
        }

        const extension =
          part.filename.split(".").pop()?.toLowerCase() || "jpg";

        newProfileKey = `profiles/${userId}/avatar-${randomUUID()}.${extension}`;

        await request.server.minio.putObject(
          bucketName,
          newProfileKey,
          part.file,
        );
      }
    }

    // Validate fullName if the client sent it.
    if (fullName !== undefined) {
      fullName = fullName.trim();

      if (!fullName) {
        throw new AppError("Full name cannot be empty.", 400);
      }
    }

    // Keep the existing name by default.
    let firstName = user.firstName;
    let lastName = user.lastName;

    // Update firstName/lastName only when fullName was provided.
    if (fullName !== undefined) {
      const nameParts = fullName.split(/\s+/);

      firstName = nameParts[0];

      lastName = nameParts.slice(1).join(" ");
    }

    // Validate profession.
    let professionValue: UserProfession | undefined;

    if (profession !== undefined) {
      const isValidProfession = Object.values(UserProfession).includes(
        profession as UserProfession,
      );

      if (!isValidProfession) {
        throw new AppError(
          "Invalid profession. Allowed values: STUDENT, TEACHER, WORKER.",
          400,
        );
      }

      professionValue = profession as UserProfession;
    }

    // Update the user's profile.
    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        firstName,
        lastName,

        phone: phone !== undefined ? phone : user.phone,

        socialMedia: socialMedia !== undefined ? socialMedia : user.socialMedia,

        profession:
          professionValue !== undefined ? professionValue : user.profession,

        aboutMe: aboutMe !== undefined ? aboutMe : user.aboutMe,

        ...(newProfileKey !== undefined && {
          profileKey: newProfileKey,
        }),
      },
    });

    databaseUpdated = true;

    // Delete the old profile image only after the database update succeeds.
    if (newProfileKey && user.profileKey && user.profileKey !== newProfileKey) {
      try {
        await request.server.minio.removeObject(bucketName, user.profileKey);
      } catch (error) {
        // Do not rollback the database update.
        request.log.error(error, "Failed to delete old profile image");
      }
    }

    return reply.send({
      message: "Profile updated successfully",

      ...(newProfileKey && {
        profileKey: newProfileKey,
      }),
    });
  } catch (error) {
    // If MinIO upload succeeded but database update failed,
    // remove the newly uploaded image.
    if (newProfileKey && !databaseUpdated) {
      try {
        await request.server.minio.removeObject(bucketName, newProfileKey);
      } catch (cleanupError) {
        request.log.error(
          cleanupError,
          "Failed to clean up uploaded profile image",
        );
      }
    }

    throw error;
  }
}
