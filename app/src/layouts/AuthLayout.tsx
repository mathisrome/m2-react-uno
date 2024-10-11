import {Outlet} from "react-router-dom";

export default function AuthLayout() {
    return <>
        <div className="card bg-base-100 w-96 shadow-xl mx-auto p-6 mt-3">
            <Outlet/>
        </div>
    </>
}