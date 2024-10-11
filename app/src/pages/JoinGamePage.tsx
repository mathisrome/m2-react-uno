import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import {GlobalContext} from "../GlobalContext.tsx";
import {jwtDecode} from "jwt-decode";
import {joinGame} from "../services/gameService.ts";
import {GameState} from "../enums/GameState.ts";

export default function JoinGamePage() {
    const {token} = useContext(GlobalContext)
    const {gameId} = useParams()
    const {socket} = useContext(GlobalContext)
    const navigate = useNavigate()

    useEffect(() => {
        const {id} = jwtDecode(token)

        joinGame(
            token,
            gameId,
            GameState.JOIN,
            id
        )

        socket.emit("joinGame", {
            gameId: gameId,
            id: id
        })
    })

    socket.on("startGame", (gameId: string) => {
        console.log(gameId)
        navigate("/game/" + gameId)
    })

    return <>
        Vous avez été ajouté à la partie, lancement de la partie dans quelques minutes
    </>
}