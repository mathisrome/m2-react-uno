import {pickOneCardRandomly, setupGame} from "../../services/gameService.ts";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../GlobalContext.tsx";
import Hand from "../molecules/Hand.tsx";
import Player from "../../models/game/player.ts";
import {useNavigate, useParams} from "react-router-dom";
import Card from "../../models/game/card.ts";
import CardComponent from "../atoms/Card.tsx";
import {updateGame} from "../../services/gameManager.ts";
import {GameState} from "../../enums/GameState.ts";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;

export default function Game() {
    const [pileOfCards, setPileOfCards] = useState<Card[]>([])
    const [lastCardPlayed, setLastCardPlayed] = useState<Card>(null)
    const [game, setGame] = useState(null)
    const [connectedUserId, setConnectedUserId] = useState<number | null>(null)
    const [players, setPlayers] = useState<Player[]>([])
    const [lastPlayerPlayed, setLastPlayerPlayed] = useState<Player | null>()
    const {socket, token} = useContext(GlobalContext)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        setupGame(token, socket, params.gameId)
            .then(data => {
                if (data.length === 5) {
                    setConnectedUserId(data[0])
                    setGame(data[1])
                    setPileOfCards(data[2])
                    setPlayers(data[3])
                    setLastCardPlayed(data[4])
                    setLastPlayerPlayed(data[3][1])
                    socket.emit("lastPlayerPlayed", params.gameId, data[3][1])
                } else {
                    setConnectedUserId(data[0])
                    setGame(data[1])
                }

            })
    }, [])

    useEffect(() => {
        const winner = players.find(player => {
            return player.hand.cards.length === 0
        })
        if (winner && winner.user.id === connectedUserId) {
            const loser = players.find(player => {
                return winner.user.id !== player.user.id
            })

            let score = 0;

            loser.hand.cards.forEach(card => {
                score = score + card.number
            })

            updateGame(
                token,
                params.gameId,
                GameState.FINISH,
                loser.user.id,
                score,
                winner.user.id
            ).then(response => {
                return response.json()
            }).then(data => {
                console.log(data)
                socket.emit("gameEnd", data.id, data.id)
                navigate("/end-game/" + data.id)
            })
        }
    }, [connectedUserId, navigate, params.gameId, players, socket, token]);

    socket.on("updatePlayers", (players: Player[]) => {
        setPlayers(players)
    })

    socket.on("lastCardPlayed", (card: Card) => {
        setLastCardPlayed(card)
    })

    socket.on("lastPlayerPlayed", (player: Player) => {
        setLastPlayerPlayed(player)
    })

    socket.on("pileOfCards", (cards: Card[]) => {
        setPileOfCards(cards)
    })

    socket.on("gameEnd", (gameId: string) => {
        navigate("/end-game/" + gameId)
    })

    if (players.length > 0) {
        return <>
            {players.map((player) => {
                if (player.user.id === connectedUserId && lastPlayerPlayed) {
                    return (
                        <div>
                            {players.filter(item => item !== player).map(item => {
                                return <Hand setLastPlayerPlayed={setLastPlayerPlayed} lastCardPlayed={lastCardPlayed}
                                             setLastCardPlayed={setLastCardPlayed} setPlayers={setPlayers}
                                             gameId={game.id} players={players} player={item} isPlaying={false}
                                             hideCard={true}/>
                            })}

                            {lastCardPlayed ? <CardComponent hide={false} color={lastCardPlayed.color.name}
                                                             number={lastCardPlayed.number}/> : ""}

                            {pileOfCards.length > 0 ? <CardComponent hide={true} color={pileOfCards[0].color.name}
                                                                     number={pileOfCards[0].number} playCard={() => {
                                if (lastPlayerPlayed.user.id !== player.user.id) {
                                    const pickedCard = pickOneCardRandomly(socket, pileOfCards)
                                    player.hand.cards.push(pickedCard)
                                    setPlayers([...players])
                                    setLastPlayerPlayed(player)
                                    socket.emit("lastPlayerPlayed", game.id, player)
                                    socket.emit("updatePlayers", game.id, players)
                                }
                            }}/> : ""}

                            <Hand pileOfCards={pileOfCards} setLastPlayerPlayed={setLastPlayerPlayed}
                                  lastCardPlayed={lastCardPlayed} setLastCardPlayed={setLastCardPlayed}
                                  setPlayers={setPlayers} gameId={game.id} players={players} player={player}
                                  isPlaying={lastPlayerPlayed.user.id !== player.user.id} hideCard={false}/>
                        </div>
                    )
                }
            })}
        </>
    }
}