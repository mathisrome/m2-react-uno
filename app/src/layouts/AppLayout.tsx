import {NavLink, Outlet, useNavigate} from "react-router-dom";
import {a} from "vite/dist/node/types.d-aGj9QkWt";
import Navbar from "../components/organisms/Navbar.tsx";
import {useContext, useEffect} from "react";
import {GlobalContext} from "../GlobalContext.tsx";

export default function AppLayout() {
    const {isAuthenticated, token} = useContext(GlobalContext)

    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated()) {
            console.log('in')
            navigate("/auth/login")
        }
    })

    return <>
        <Navbar/>
        <main className="px-16">
            <Outlet/>
        </main>
    </>
}