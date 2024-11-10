import {createContext, useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {io} from "socket.io-client"
import {login} from "./services/userManager.ts";

export const GlobalContext = createContext(undefined);

export const GlobalProvider = ({children}) => {
    const [token, setToken] = useState(() => sessionStorage.getItem("token") || null)

    const socket = io("http://localhost:3000")

    useEffect(() => {
        if (token) {
            sessionStorage.setItem("token", token)
        } else {
            sessionStorage.removeItem("token")
        }
    }, [token])

    const saveToken = (newToken) => {
        setToken(newToken)
    }

    const isAuthenticated = () => {
        if (token) {
            const jwt = jwtDecode(token)

            if (new Date(jwt.exp * 1000) < new Date()) {
                setToken(null)
                return false
            }

            return true
        }

        return false
    }

    return (
        <GlobalContext.Provider value={{token, isAuthenticated, saveToken, socket}}>
            {children}
        </GlobalContext.Provider>
    )
}