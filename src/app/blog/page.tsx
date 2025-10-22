import { generatePageMetadata } from "@/lib/metadata";
import Blog from "@/components/sections/Blog";

export const metadata = generatePageMetadata('blog');

export default function BlogPage() {
  return (
    <div className="pt-24">
      <Blog />
    </div>
  );
}