/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        HOST: process.env.HOST,
    },
    output:"standalone"
};

export default nextConfig;
