import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../GlobalContext.tsx";
import {getGame} from "../services/gameManager.ts";
import {useParams} from "react-router-dom";
import {getUser} from "../services/userManager.ts";
import User from "../models/user.ts";

export default function EndGamePage() {
    const {token} = useContext(GlobalContext)
    const params = useParams()
    const [creator, setCreator] = useState()
    const [player, setPlayer] = useState()
    const [game, setGame] = useState()

    useEffect(() => {
        getGame(token, params.gameId)
            .then(response => {
                return response.json()
            })
            .then(game => {
                setGame(game)
                getUser(token, game.creator)
                    .then(user => {
                        setCreator(user)
                    })
                getUser(token, game.player)
                    .then(user => {
                        setPlayer(user)
                    })
            })
    }, []);

    return <>
        <h1 className={"text-center font-bold text-3xl mb-5"}>Information sur la partie : {game ? game.id : ""}</h1>
        <div className="flex w-full">
            <div className="card bg-base-300 rounded-box grid h-32 flex-grow place-items-center">
                <h2 className={'text-center font-bold text-2xl uppercase'}>Joueur 1</h2>
                <h3 className={'text-center font-bold text-xl'}>
                    {creator ? creator.firstname : ""} {creator ? creator.lastname : ''}
                </h3>
                {creator && creator.id === game.winner ? <div className="badge badge-primary">Gagnant</div> : <div className="badge badge-secondary">Perdant</div>}

            </div>
            <div className="divider divider-horizontal">VS</div>
            <div className="card bg-base-300 rounded-box grid h-32 flex-grow place-items-center">
                <h2 className={'text-center font-bold text-2xl uppercase'}>Joueur 2</h2>
                <h3 className={'text-center font-bold text-xl'}>
                    {player ? player.firstname : ""} {player ? player.lastname : ''}
                </h3>
                {player && player.id === game.winner ? <div className="badge badge-primary">Gagnant</div> : <div className="badge badge-secondary">Perdant</div>}
            </div>
        </div>
    </>
}