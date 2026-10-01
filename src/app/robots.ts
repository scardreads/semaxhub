import type { MetadataRoute } from "next";
import { robotsDocument } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return robotsDocument();
}
