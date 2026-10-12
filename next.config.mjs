/** Cloudflare Pages static build. The full Next.js version remains on main for Vercel. */
/** @type {import('next').NextConfig} */
const config = {output:'export',trailingSlash:true,images:{unoptimized:true}};
export default config;
