import {a} from "vite/dist/node/types.d-aGj9QkWt";
import NavbarList from "../molecules/NavbarList.tsx";
import NavbarBrand from "../atoms/NavbarBrand.tsx";

export default function Navbar() {
    return <>
        <div className="navbar bg-base-300 mb-3">
            <div className="flex-1">
                <NavbarBrand/>
            </div>
            <div className="flex-none">
                <NavbarList/>
            </div>
        </div>
    </>
}