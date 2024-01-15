/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
const { env } = await import("./src/env.js");

const bucketImgDomains = [env.AWS_IMAGES_BUCKET_NAME].flatMap((x) => [
  `${x}.s3.amazonaws.com`,
  `${x}.s3.${env.AWS_REGION}.amazonaws.com`,
]);

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "cdn.discordapp.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      ...bucketImgDomains,
    ],
  },
};

export default config;
