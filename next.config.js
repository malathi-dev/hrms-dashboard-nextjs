/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next 13+ uses the app directory by default; the `experimental.appDir`
  // option is no longer recognized and causes a warning when running
  // `next dev`/`next build`.
  // experimental: {
  //   appDir: true
  // },
};
export default nextConfig;
