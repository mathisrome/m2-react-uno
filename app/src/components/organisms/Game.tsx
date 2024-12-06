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

    if (players.length > 0) {
        if (players[0].user.id === connectedUserId) {
            return (
                <div>
                    Joueur ayant créé la partie ({players[0].user.email})
                    <Hand setPlayers={setPlayers} gameId={game.id} players={players} playCard={playCard} player={players[1]} hideCard={true}/>

                    {lastCardPlayed ? <CardComponent hide={false} color={lastCardPlayed.color.name} number={lastCardPlayed.number}/> : ""}
                    {pileOfCards.length > 0 ? <CardComponent hide={true} color={pileOfCards[0].color.name} number={pileOfCards[0].number}/> : ""}

                    <Hand setPlayers={setPlayers} gameId={game.id} players={players} playCard={playCard} player={players[0]}  hideCard={false}/>
                </div>
            )
        } else {
            return (
                <div>
                    Joueur ayant rejoint la partie ({players[1].user.email})
                    <Hand setPlayers={setPlayers} gameId={game.id} players={players} player={players[0]}  hideCard={true}/>

                    {lastCardPlayed ? <CardComponent hide={false} color={lastCardPlayed.color.name} number={lastCardPlayed.number}/> : ""}
                    {pileOfCards.length > 0 ? <CardComponent hide={true} color={pileOfCards[0].color.name} number={pileOfCards[0].number}/> : ""}

                    <Hand setPlayers={setPlayers} gameId={game.id} players={players} player={players[1]}  hideCard={false}/>
                </div>
            )
        }
    }
}