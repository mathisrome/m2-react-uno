import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../GlobalContext.tsx";
import {jwtDecode} from "jwt-decode";
import {createGame} from "../services/gameManager.ts";
import {NavLink, useNavigate} from "react-router-dom";
import {getUser} from "../services/userManager.ts";
import Button from "../components/atoms/Button.tsx";
import {PlayIcon} from "../components/atoms/Icon.tsx";

export default function CreateGamePage() {
    const [gameId, setGameId] = useState(null)
    const {socket, token} = useContext(GlobalContext)
    const [player, setPlayer] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        const {id} = jwtDecode(token)

        createGame(token, id).then(r => {
            return r.json()
        }).then(data => {
            setGameId(data.gameId)

            socket.emit("createGame", data.gameId)
        })
    }, [])

    socket.on("gameJoined", async (userId) => {
       setPlayer(await getUser(token, userId))
    })

    const startGame = () => {
        socket.emit("startGame", gameId)
        navigate("/game/" + gameId)
    }

    return <>
        <h1 className="text-3xl font-bold mb-3 uppercase">Création de la partie</h1>

        {player ? (player.firstname + " " + player.lastname) : ""}

        <p className={"mb-5"}>Copier le code de la partie en</p>
        <button className="btn btn-neutral" onClick={() => {
            navigator.clipboard.writeText(gameId)
        }}>Cliquant ici</button>

        {player ? <Button classNameString={"btn"} icon={<PlayIcon/>} onClickCallback={startGame}>Lancer la partie</Button> : ""}
    </>
}