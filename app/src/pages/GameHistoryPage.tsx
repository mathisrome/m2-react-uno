import {useContext, useEffect, useState} from "react";
import {getGames} from "../services/gameManager.ts";
import {GlobalContext} from "../GlobalContext.tsx";

export default function GameHistoryPage () {
    const {token} = useContext(GlobalContext)
    const [games, setGames] = useState()

    useEffect(() => {
        getGames(token)
            .then(response => response.json())
            .then(games => {
                console.log(games)
                setGames(games)
            })
    }, []);

    return <>
        <h1 className="text-3xl font-bold mb-3 mt-3 text-center uppercase">Historique des parties</h1>

        {games ? games.map((game) => { return <div className="flex w-full">
            <div className="card bg-base-300 rounded-box grid h-32 flex-grow place-items-center">
                <h2 className={'text-center font-bold text-2xl uppercase'}>Joueur 1</h2>
                <h3 className={'text-center font-bold text-xl'}>
                     {game.creator}
                </h3>
                {game.creator === game.winner ? <div className="badge badge-primary">Gagnant</div> : <div className="badge badge-secondary">Perdant</div>}

            </div>
            <div className="divider divider-horizontal">VS</div>
            <div className="card bg-base-300 rounded-box grid h-32 flex-grow place-items-center">
                <h2 className={'text-center font-bold text-2xl uppercase'}>Joueur 2</h2>
                <h3 className={'text-center font-bold text-xl'}>
                    {game.player}
                </h3>
                {game.player === game.winner ? <div className="badge badge-primary">Gagnant</div> : <div className="badge badge-secondary">Perdant</div>}
            </div>
        </div>}) : ""}
    </>
}