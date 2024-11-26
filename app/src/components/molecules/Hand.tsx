import Card from "../atoms/Card.tsx";

export default function Hand({cards, playCard, hideCard = false}){
    return <>
        <ul className={'hand'}>
            {cards.map((card, index) => {
                return <li key={index}> <Card hide={hideCard} color={card.color.name} number={card.number} playCard={playCard}/> </li>
            })}
        </ul>
    </>
}