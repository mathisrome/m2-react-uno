import User from "../models/user.ts";

export async function register(user: User) {
    return await fetch(
        "http://localhost:3000/register",
        {
            method: "POST",
            body: JSON.stringify(user),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        }
    ).then(response => {
        return response.json()
    }).catch(error => {
        return error
    })
}

export async function login(email: string, password: string) {
    return await fetch(
        "http://localhost:3000/login",
        {
            method: "POST",
            body: JSON.stringify({email: email, password: password}),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        }
    ).then((res) => {
        return res.json()
    }).catch(error => {
        return error
    })
}

export async function verified(userId: number) {
    return await fetch(
        "http://localhost:3000/users/" + userId,
        {
            method: "POST"
        }
    ).then((res) => {
        return res.json()
    }).then(user => {
        return user
    })
}

export async function getUser(token: string, userId: string | null) {
    try {
        const response = await fetch(
            "http://localhost:3000/users/" + userId,
            {
                method: "GET",
                headers: new Headers({
                    "Authorization": "Bearer " + token
                })
            }
        )

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);

        return null
    }
}