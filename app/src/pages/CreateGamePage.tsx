import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../GlobalContext.tsx";
import {jwtDecode} from "jwt-decode";
import {createGame} from "../services/gameService.ts";
import {NavLink} from "react-router-dom";
import {getUser} from "../services/userService.ts";
import Button from "../components/atoms/Button.tsx";
import {PlayIcon} from "../components/atoms/Icon.tsx";

export default function CreateGamePage() {
    const {token} = useContext(GlobalContext)
    const [gameId, setGameId] = useState(null)
    const {socket} = useContext(GlobalContext)
    const [player, setPlayer] = useState(null)


    useEffect(() => {
        const {id} = jwtDecode(token)

        createGame(token, id).then(r => {
            return r.json()
        }).then(data => {
            setGameId(data.gameId)

            socket.emit("createGame", data.gameId)
        })
    }, [])

    socket.on("joinGame", async (userId) => {
       setPlayer(await getUser(token, userId))
    })

    const startGame = () => {
        console.log(gameId)
        socket.emit("startGame", gameId)
    }

    return <>
        <h1 className="text-3xl font-bold mb-3 uppercase">Création de la partie</h1>

        {player ? (player.firstname + " " + player.lastname) : ""}

        <p>Inviter des personnes sur le lien suivant <NavLink
            to={"/join-game/" + gameId}>{"/join-game/" + gameId}</NavLink></p>

        {player ? <Button classNameString={"btn"} icon={<PlayIcon/>} onClickCallback={startGame}>Lancer la partie</Button> : ""}
    </>
}