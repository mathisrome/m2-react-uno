import Card from "../atoms/Card.tsx";

export default function Hand({cards, hideCard = false}){
    return <>
        <ul className={'hand'}>
            {cards.map((card, index) => {
                return <li key={index}> <Card hide={hideCard} color={card.color.name} number={card.number}/> </li>
            })}
        </ul>
    </>
}