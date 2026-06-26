import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Luxembourg School Calendar",
    short_name: "School Dates",
    description: "Open days, enrollment windows, and holidays for Luxembourg schools.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#534AB7",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
