import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/Nav";
import CartDrawer from "@/components/CartDrawer";
import Stage from "@/components/Stage";
import SceneMount from "@/components/SceneMount";
import Director from "@/components/Director";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Story from "@/components/sections/Story";
import Types from "@/components/sections/Types";
import Colors from "@/components/sections/Colors";
import Materials from "@/components/sections/Materials";
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
      <Stage />
      <SceneMount />

      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Story />
        <Types />
        <Colors />
        <Materials />
        <Shop />
        <Reviews />
      </main>
      <Footer />

      <Director />
    </>
  );
}
