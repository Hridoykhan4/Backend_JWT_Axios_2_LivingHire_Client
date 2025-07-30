import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      <header>
        <Navbar></Navbar>
      </header>

      <main className="min-h-[calc(100vh-302px)]">
        <Outlet></Outlet>
      </main>

      <>
        <Footer></Footer>
      </>
    </>
  );
};

export default MainLayout;
