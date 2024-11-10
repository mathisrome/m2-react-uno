import Color from "./color.ts";

export default class Card {
    color: Color
    number: number
    special: boolean

    constructor(
        color: Color,
        number: number,
        special: boolean = false
    ) {
        this.color = color
        this.number = number
        this.special = special
    }

}