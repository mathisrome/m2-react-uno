import {SpecialCard} from "../../enums/SpecialCard.ts";

export default function Card({color, number, hide, playCard}) {
    let className: string = "uno-card "

    if (number < 10 && hide === false) {
        className = className + color
    } else if (number >= 10 && hide === false) {
        className = className + "special "
    }

    if (hide) {
        className = className + " hide"
    }

    return <>
        <article className={className} onClick={playCard}>
            {number === SpecialCard.COLOR && false === hide ? "Couleur" : ""}
            {number === SpecialCard.TURN && false === hide ? "Sens" : ""}
            {number === SpecialCard.PICK_UP_2 && false === hide ? "+2" : ""}
            {number === SpecialCard.PICK_UP_4 && false === hide ? "+4" : ""}
            {number === SpecialCard.STOP && false === hide ? "STOP" : ""}
            {number < 10 && false === hide ? number : ""}
        </article>
    </>
}