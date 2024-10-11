import {NavLink, useNavigate} from "react-router-dom";
import DarkMode from "./DarkMode.tsx";
import {useContext} from "react";
import {GlobalContext} from "../../GlobalContext.tsx";
import DialogJoinGame from "../organisms/DialogJoinGame.tsx";

export default function NavbarList() {
    const {saveToken} = useContext(GlobalContext)
    const navigate = useNavigate()
    const logout = () => {
        saveToken(null)
        navigate("/auth/login")
    }

    return <>
        <DarkMode/>

        <ul className="menu menu-horizontal px-1 gap-2">
            <li>
                <NavLink to={"/"}>Dashboard</NavLink>
            </li>
            <li>
                <NavLink to={"/create-game"}>Créer une partie</NavLink>
            </li>
            <li>
                <DialogJoinGame/>
            </li>
            <li>
                <a onClick={logout}>Se déconnecter</a>
            </li>
        </ul>
    </>
}