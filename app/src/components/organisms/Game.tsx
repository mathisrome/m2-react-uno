import {DefaultColors, generateCardList, generatePlayer} from "../../services/gameService.ts";
import User from "../../models/user.ts";
import {getUser} from "../../services/userManager.ts";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../GlobalContext.tsx";
import {jwtDecode} from "jwt-decode";
import Hand from "../molecules/Hand.tsx";
import Player from "../../models/game/player.ts";
import {useParams} from "react-router-dom";

export default function Game() {
    const cardList = generateCardList(DefaultColors)
    const [player1, setPlayer1] = useState<Player|null>(null)
    const [player2, setPlayer2] = useState<Player|null>(null)
    const {socket, token} = useContext(GlobalContext)
    const params = useParams()


    useEffect(() => {
        const {id} = jwtDecode(token)

        getUser(token, id)
            .then(data => {
                const user = new User(
                    data.firstname,
                    data.lastname,
                    data.username,
                    data.email,
                    data.password,
                    data.id,
                )

                const player = generatePlayer(user, cardList)

                setPlayer1(player)

                socket.emit("updateHand", params.gameId, player)
            })

    }, [])

    useEffect(() => {
        socket.on("updateHand", (player: Player) => {
            if (player.user !== player1?.user) {
                setPlayer2(player)
            }
        })
    }, [player2, player1]);

    return <>
        <ul>
            <li>
                {player1 !== null ? <Hand cards={player1.hand.cards}/> : ""}
            </li>
            <li>
                {player2 !== null ? <Hand cards={player2.hand.cards} hideCard={true}/> : ""}
            </li>
        </ul>
    </>
}