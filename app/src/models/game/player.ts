import User from "../user.ts";
import Hand from "./hand.ts";

export default class Player {
    user: User
    hand: Hand

    constructor(
        user: User,
        hand: Hand
    ) {
        this.user = user
        this.hand = hand
    }
}