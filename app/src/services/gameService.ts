import {SpecialCard} from "../enums/SpecialCard.ts";
import Color from "../models/game/color.ts";
import Card from "../models/game/card.ts";
import User from "../models/user.ts";
import Player from "../models/game/player.ts";
import Hand from "../models/game/hand.ts";
import {jwtDecode} from "jwt-decode";
import {getUser} from "./userManager.ts";
import {getGame} from "./gameManager.ts";
import {Socket} from "socket.io-client";

export const DefaultColors = [
    new Color("red"),
    new Color("blue"),
    new Color("yellow"),
    new Color("green")
]

const fisherYatesShuffle = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const swapIndex = Math.floor(Math.random() * (i + 1))
        const currentCard = deck[i]
        deck[i] = deck[swapIndex]
        deck[swapIndex] = currentCard
    }
    return deck
}

export function generatePileOfCards(colors: Color[] = DefaultColors) {
    let cards: Card[] = []

    colors.forEach(color => {
        cards.push(...generateCardsWithSpecifiedColor(color))
    })

    for (let i : number = 0; i < 4; i++) {
        cards.push(new Card(new Color("black"), SpecialCard.PICK_UP_4, true))
        cards.push(new Card(new Color("black"), SpecialCard.COLOR, true))
    }

    for (let i = 0; i < 20; i++) {
        cards = fisherYatesShuffle(cards)
    }

    return fisherYatesShuffle(cards)
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

    return cards
}

export function generatePlayer(
    user: User,
    pileOfCards: Card[],
) {
    const hand = generatePlayerHand(pileOfCards)
    return new Player(user, hand)
}

export function generatePlayerHand(
    pileOfCards: Card[],
) {
    const cards: Card[] = []

    while (cards.length < 7) {
        const key = Math.floor(Math.random() * cards.length)

        cards.push(pileOfCards[key])
        removeCardInPile(pileOfCards, key)
    }

    return new Hand(cards)
}

export function removeCardInPile(pileOfCards: Card[], key: number) {
    pileOfCards.splice(key, 1)

    return pileOfCards
}

export async function setupGame(token: string, socket: Socket, gameId: string) {
    const {id} = jwtDecode(token)
    // récupération de la partie pour connaître le créateur
    const actualGame = await getGame(token, gameId)
        .then(res => {
            return res.json()
        })
        .then(data => {
            return data
        })

    if (id === actualGame.creator) {
        // récupération de l'utilisateur connecté
        const loggedUser = await getUser(token, id)
            .then(data => {
                return new User(
                    data.firstname,
                    data.lastname,
                    data.username,
                    data.email,
                    data.password,
                    data.id,
                )
            })

        const pileOfCards = generatePileOfCards(DefaultColors)

        const player1 = generatePlayer(loggedUser, pileOfCards)

        const otherUser = await getUser(token, actualGame.player)
            .then(data => {
                return new User(
                    data.firstname,
                    data.lastname,
                    data.username,
                    data.email,
                    data.password,
                    data.id,
                )
            })
        const player2 = generatePlayer(otherUser, pileOfCards)

        const players = [player1, player2]
        socket.emit("updatePlayers", gameId, players)


        const cardPicked = pickOneCardRandomly(socket, pileOfCards)

        socket.emit("lastCardPlayed", gameId, cardPicked)


        socket.emit("pileOfCards", gameId, pileOfCards)


        return [id, actualGame, pileOfCards, players, cardPicked]
    }

    return [id, actualGame]
}

export function pickOneCardRandomly(socket: Socket, pileOfCards: Card[]) {
    const cardPlayedIndex = Math.floor(Math.random() * pileOfCards.length)
    const cardPlayed = pileOfCards[cardPlayedIndex]
    removeCardInPile(pileOfCards, cardPlayedIndex)

    return cardPlayed
}

export function playCard(socket: Socket, gameId: number, players: Player[], player: Player, card: Card, lastCardPlayed: Card, setLastCardPlayed: CallableFunction, setLastPlayerPlayed, pileOfCards) {
    const index = player.hand.cards.findIndex(item => item === card)

    const otherPlayer = players.find(item => item.user.id !== player.user.id)

    switch (card.number) {
        // Pour les cartes "prendre 2 cartes"
        case SpecialCard.PICK_UP_2:
            if (card.number === lastCardPlayed.number || card.color.name === lastCardPlayed.color.name || lastCardPlayed.color.name === "black") {
                for (let i = 0; i < 2; i++) {
                    const pickedCard = pickOneCardRandomly(socket, pileOfCards)
                    otherPlayer.hand.cards.push(pickedCard)
                }
                player.hand.cards.splice(index, 1)
                setLastCardPlayed(card)
                socket.emit("lastCardPlayed", gameId, card)
                socket.emit("updatePlayers", gameId, players)
            }
            break

        // Pour les cartes "prendre 4 cartes"
        case SpecialCard.PICK_UP_4:
            for (let i = 0; i < 4; i++) {
                const pickedCard = pickOneCardRandomly(socket, pileOfCards)
                otherPlayer.hand.cards.push(pickedCard)
            }
            setLastCardPlayed(card)
            player.hand.cards.splice(index, 1)
            socket.emit("lastCardPlayed", gameId, card)
            socket.emit("updatePlayers", gameId, players)
            break

        // Pour les changements de sens et les stop
        case SpecialCard.STOP:
        case SpecialCard.TURN:
            if (card.number === lastCardPlayed.number || card.color.name === lastCardPlayed.color.name || lastCardPlayed.color.name === "black") {
                setLastCardPlayed(card)
                player.hand.cards.splice(index, 1)
                socket.emit("lastCardPlayed", gameId, card)
                socket.emit("updatePlayers", gameId, players)
            }
            break

        // pour les cartes les changements de couleur
        case SpecialCard.COLOR:
            setLastPlayerPlayed(player)
            setLastCardPlayed(card)
            player.hand.cards.splice(index, 1)
            socket.emit("lastPlayerPlayed", gameId, player)
            socket.emit("lastCardPlayed", gameId, card)
            socket.emit("updatePlayers", gameId, players)
            break
        // Pour les cartes classiques
        default:
            if (card.number === lastCardPlayed.number || card.color.name === lastCardPlayed.color.name || lastCardPlayed.color.name === "black") {
                setLastPlayerPlayed(player)
                setLastCardPlayed(card)
                player.hand.cards.splice(index, 1)
                socket.emit("lastPlayerPlayed", gameId, player)
                socket.emit("lastCardPlayed", gameId, card)
                socket.emit("updatePlayers", gameId, players)
            }
            break
    }

    return players
}