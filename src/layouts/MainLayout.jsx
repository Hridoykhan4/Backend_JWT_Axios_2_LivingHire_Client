import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

const MainLayout = () => {
  const navigation = useNavigation();
  return (
    <>
      <header>
        <Navbar></Navbar>
      </header>

      <main className="min-h-[calc(100vh-302px)]">
        {navigation.state === "loading" ? (
          <LoadingSpinner></LoadingSpinner>
        ) : (
          <Outlet></Outlet>
        )}
      </main>

      <>
        <Footer></Footer>
      </>
    </>
  );
};

export default MainLayout;
