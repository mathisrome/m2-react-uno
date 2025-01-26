import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../GlobalContext.tsx";
import {useNavigate} from "react-router-dom";

export default function DashboardPage () {
    const [gameId, setGameId] = useState()
    const navigate = useNavigate()

    return <>
        <h1 className="text-3xl font-bold mb-3 uppercase">Dashboard</h1>
        <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Rejoindre une partie ?</h2>
                <p>Copier coller le code, que le créateur de la partie vous a envoyé</p>
                <input value={gameId} onChange={e => setGameId(e.target.value)} type="text" placeholder="Code de la partie" className="input input-bordered w-full max-w-xs" />
                <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={() => {
                        if (gameId) {
                            navigate("/join-game/" + gameId)
                        }
                    }}>Rejoindre</button>
                </div>
            </div>
        </div>
    </>
}