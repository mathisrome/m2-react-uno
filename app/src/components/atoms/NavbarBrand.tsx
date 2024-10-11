import {NavLink} from "react-router-dom";

export default function NavbarBrand (to) {
    return <NavLink className="text-xl navbar-brand-container" to={to}>
        <img src="/uno.png" alt="Logo Uno" className={"navbar-brand"}/> <span>Uno</span>
    </NavLink>
}