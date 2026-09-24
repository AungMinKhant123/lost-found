import fp from "fastify-plugin";
import { Client } from "minio";

export default fp(async (fastify) => {
  const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: Number(process.env.MINIO_PORT || 9000),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY || "",
    secretKey: process.env.MINIO_SECRET_KEY || "",
  });

  const bucketName = process.env.MINIO_BUCKET || "lost-found";

  const bucketExists = await minioClient.bucketExists(bucketName);

  if (!bucketExists) {
    await minioClient.makeBucket(bucketName);
    fastify.log.info(`MinIO bucket "${bucketName}" created`);
  }

  fastify.decorate("minio", minioClient);
  fastify.log.info(`MinIO connected: ${bucketName}`);
});
