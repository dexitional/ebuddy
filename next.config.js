/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    loader: "akamai",
    path: "/",
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
  
}
