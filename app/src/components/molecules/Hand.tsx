import Card from "../atoms/Card.tsx";
import {useContext} from "react";
import {GlobalContext} from "../../GlobalContext.tsx";
import {playCard} from "../../services/gameService.ts";

export default function Hand({players, setPlayers, player, gameId, hideCard = false}) {
    const {socket} = useContext(GlobalContext)

    return <>
        <ul className={'hand'}>
            {player.hand.cards.map((card, index) => {
                return <li key={index}><Card hide={hideCard} color={card.color.name} number={card.number}
                                             playCard={() => {
                                                 players = playCard(socket, gameId, players, player, card)
                                                 setPlayers([...players])
                                             }}/></li>
            })}
        </ul>
    </>
}