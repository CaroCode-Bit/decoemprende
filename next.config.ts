import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hay un package.json en C:\Users\jj que Next confunde con la raíz del proyecto.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
