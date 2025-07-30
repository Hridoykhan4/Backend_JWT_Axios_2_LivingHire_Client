import { useContext } from "react";
import { Outlet } from "react-router-dom";
import AuthContext from "../provider/AuthContext";

const MainLayout = () => {
    const {signInWithGoogle} = useContext(AuthContext)
    return (
        <>
            <header>
                    <h1>Hii</h1>
            </header>     

            <button onClick={signInWithGoogle}>Google</button>

            <main>
                <Outlet></Outlet>
            </main>

            <footer>

            </footer>
        </>
    );
};

export default MainLayout;