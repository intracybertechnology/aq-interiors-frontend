import { generatePageMetadata } from "@/lib/metadata";
import Projects from "@/components/sections/Projects";

export const metadata = generatePageMetadata('projects');

export default function ProjectsPage() {
  return (
    <div className="pt-24">
      <Projects />
    </div>
  );
}