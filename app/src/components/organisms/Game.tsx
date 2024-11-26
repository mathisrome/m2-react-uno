import {playCard, setupGame} from "../../services/gameService.ts";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../GlobalContext.tsx";
import Hand from "../molecules/Hand.tsx";
import Player from "../../models/game/player.ts";
import {useParams} from "react-router-dom";
import Card from "../../models/game/card.ts";
import CardComponent from "../atoms/Card.tsx";

export default function Game() {
    const [pileOfCards, setPileOfCards] = useState<Card[]>([])
    const [lastCardPlayed, setLastCardPlayed] = useState<Card>(null)
    const [game, setGame] = useState(null)
    const [connectedUserId, setConnectedUserId] = useState<number | null>(null)
    const [players, setPlayers] = useState<Player[]>([])
    const {socket, token} = useContext(GlobalContext)
    const params = useParams()

    useEffect(() => {
        setupGame(token, socket, params.gameId)
            .then(data => {
                if (data.length === 5) {
                    setConnectedUserId(data[0])
                    setGame(data[1])
                    setPileOfCards(data[2])
                    setPlayers(data[3])
                    setLastCardPlayed(data[4])
                } else {
                    setConnectedUserId(data[0])
                    setGame(data[1])
                }
            })
    }, [])

    socket.on("updatePlayers", (players: Player[]) => {
        setPlayers(players)
    })

    socket.on("lastCardPlayed", (card: Card) => {
        console.log(card)
        setLastCardPlayed(card)
    })

    socket.on("pileOfCards", (cards: Card[]) => {
        setPileOfCards(cards)
    })

    return <>
        {
            players.length > 0 ?
                <div>
                    <Hand playCard={playCard} cards={players[0].hand.cards} hideCard={players[0].user.id !== connectedUserId}/>
                {lastCardPlayed ? <CardComponent hide={false} color={lastCardPlayed.color.name} number={lastCardPlayed.number}/> : ""}
                {pileOfCards.length > 0 ? <CardComponent hide={true} color={pileOfCards[0].color.name} number={pileOfCards[0].number}/> : ""}
                    <Hand playCard={playCard} cards={players[1].hand.cards} hideCard={players[1].user.id !== connectedUserId}/>
                </div> : ''
        }

    </>
}