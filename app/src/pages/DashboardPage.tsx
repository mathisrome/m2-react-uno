import {useContext, useEffect} from "react";
import {GlobalContext} from "../GlobalContext.tsx";
import {useNavigate} from "react-router-dom";

export default function DashboardPage () {
    return <>
        <h1 className="text-3xl font-bold mb-3 uppercase">Dashboard</h1>
    </>
}