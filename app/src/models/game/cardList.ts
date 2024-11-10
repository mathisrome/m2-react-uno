import Card from "./card.ts";

export default class CardList {
    cards: [Card[]]

    constructor(
        cards: [Card[]]
    ) {
        this.cards = cards
    }
}