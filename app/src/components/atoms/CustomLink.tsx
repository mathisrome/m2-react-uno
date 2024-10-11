import {NavLink} from "react-router-dom";

export default function CustomLink({to, children}) {
    return <NavLink to={to} className={"link"}>{children}</NavLink>
}