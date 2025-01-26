import Card from "../atoms/Card.tsx";
import {useContext} from "react";
import {GlobalContext} from "../../GlobalContext.tsx";
import {playCard} from "../../services/gameService.ts";

export default function Hand({players, setPlayers, lastCardPlayed, setLastCardPlayed, setLastPlayerPlayed, player, gameId, pileOfCards, isPlaying = false, hideCard = false}) {
    const {socket} = useContext(GlobalContext)

    const title = isPlaying ? "À vous de jouer" : null
    return <>
        <h2 className={"text-5xl font-bold text-center mt-10"}>{title}</h2>
        <ul className={'hand'}>
            {player.hand.cards.map((card, index) => {
                if (isPlaying) {
                    return <li key={index}><Card hide={hideCard} color={card.color.name} number={card.number}
                                                 playCard={() => {
                                                     players = playCard(socket, gameId, players, player, card, lastCardPlayed, setLastCardPlayed, setLastPlayerPlayed, pileOfCards)
                                                     setPlayers([...players])
                                                 }}/></li>
                } else {
                    return <li key={index}><Card hide={hideCard} color={card.color.name} playCard={null}
                                                 number={card.number}/></li>
                }
            })}
        </ul>
    </>
}