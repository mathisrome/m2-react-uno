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

export async function joinGame(
    token: string,
    gameId: string,
    action: string,
    userId: number
) {
    return await fetch(
        "http://localhost:3000/game/" + action + "/" + gameId,
        {
            method: "PATCH",
            headers: new Headers({
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({
                userId: userId
            }),
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