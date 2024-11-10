import {SpecialCard} from "../enums/SpecialCard.ts";
import Color from "../models/game/color.ts";
import Card from "../models/game/card.ts";
import CardList from "../models/game/cardList.ts";
import User from "../models/user.ts";
import Player from "../models/game/player.ts";
import Hand from "../models/game/hand.ts";

export const DefaultColors = [
    new Color("red"),
    new Color("blue"),
    new Color("yellow"),
    new Color("green")
]

export function generateCardList(colors: Color[] = DefaultColors) {
    const cards: [Card[]] = []

    colors.forEach(color => {
        cards.push(generateCardsWithSpecifiedColor(color))
    })

    return new CardList(cards)
}

export function generateCardsWithSpecifiedColor(color: Color) {
    const cards: Card[] = []

    cards.push(new Card(color, 0, false))
    for (let i: number = 1; i < 10; i++) {
        cards.push(new Card(color, i, false))
        cards.push(new Card(color, i, false))
    }
    cards.push(new Card(color, SpecialCard.STOP, true))
    cards.push(new Card(color, SpecialCard.TURN, true))
    cards.push(new Card(color, SpecialCard.TURN, true))
    cards.push(new Card(color, SpecialCard.PICK_UP_2, true))
    cards.push(new Card(color, SpecialCard.PICK_UP_2, true))
    cards.push(new Card(color, SpecialCard.PICK_UP_4, true))
    cards.push(new Card(color, SpecialCard.COLOR, true))

    return cards
}

export function generatePlayer(
    user: User,
    cardList: CardList,
    colors: Color[] = DefaultColors
) {
    const hand = generatePlayerHand(cardList, colors)
    return new Player(user, hand)
}

export function generatePlayerHand(
    cardList: CardList,
    colors: Color[] = DefaultColors
) {
    const cards: Card[] = []

    while (cards.length < 7) {
        const colorKey = Math.floor(Math.random() * colors.length);

        const cardKey = Math.floor(Math.random() * cardList.cards[colorKey].length)

        cards.push(cardList.cards[colorKey][cardKey])
        cardList.cards[colorKey].splice(cardKey, 0)
    }

    return new Hand(cards)
}