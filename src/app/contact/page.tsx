import { generatePageMetadata } from "@/lib/metadata";
import Contact from "@/components/sections/Contact";

export const metadata = generatePageMetadata('contact');

export default function ContactPage() {
  return (
    <div className="pt-24">
      <Contact />
    </div>
  );
}