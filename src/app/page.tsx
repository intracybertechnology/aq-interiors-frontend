import { generatePageMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import About from "@/components/sections/AboutUs";

export const metadata = generatePageMetadata('home');

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Projects />
      <Blog />
      <Contact />
    </>
  );
}