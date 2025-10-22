import { generatePageMetadata } from "@/lib/metadata";
import About from "@/components/sections/AboutUs";

export const metadata = generatePageMetadata('about');

export default function AboutPage() {
  return (
    <div className="pt-24">
      <About />
    </div>
  );
}