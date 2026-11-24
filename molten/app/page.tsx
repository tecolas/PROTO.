import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/Nav";
import CartDrawer from "@/components/CartDrawer";
import SceneMount from "@/components/SceneMount";
import JarDirector from "@/components/JarDirector";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Story from "@/components/sections/Story";
import Flavors from "@/components/sections/Flavors";
import Ingredients from "@/components/sections/Ingredients";
import Shop from "@/components/sections/Shop";
import Reviews from "@/components/sections/Reviews";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Nav />
      <CartDrawer />
      <SceneMount />

      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Story />
        <Flavors />
        <Ingredients />
        <Shop />
        <Reviews />
      </main>
      <Footer />

      <JarDirector />
    </>
  );
}
