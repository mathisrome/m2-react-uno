import Card from "./card.ts";

export default class Hand {
    cards: Card[]

    constructor(cards: Card[]) {
        this.cards = cards
    }
}