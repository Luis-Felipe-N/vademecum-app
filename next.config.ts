import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "docs.uft.edu.br",
			},
			{
				protocol: "https",
				hostname: "8tp6hyi8fokrxfbb.public.blob.vercel-storage.com",
			},
		],
	},
};

export default nextConfig;
