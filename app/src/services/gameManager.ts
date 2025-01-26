import {GameState} from "../enums/GameState.ts";

export async function createGame(token: string, userId: number) {
    return await fetch(
        "http://localhost:3000/game",
        {
            method: "POST",
            body: JSON.stringify({
                userId: userId
            }),
            headers: new Headers({
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            })
        }
    )
}

export async function updateGame(
    token: string,
    gameId: string,
    action: string,
    userId: number,
    score: number|null = null,
    winnerId: number|null = null,
) {
    const data = {
        userId: userId,
        winner: winnerId,
        score: score
    }

    return await fetch(
        "http://localhost:3000/game/" + action + "/" + gameId,
        {
            method: "PATCH",
            headers: new Headers({
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(data),
        }
    )
}

export async function getGame(
    token: string,
    gameId: string,
) {
    return await fetch(
        "http://localhost:3000/game/" + gameId,
        {
            method: "GET",
            headers: new Headers({
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            })
        }
    )
}