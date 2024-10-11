import {createRoot} from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import "./index.css";
import AuthLayout from "./layouts/AuthLayout.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AppLayout from "./layouts/AppLayout.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import {GlobalProvider} from "./GlobalContext.tsx";
import CreateGamePage from "./pages/CreateGamePage.tsx";
import JoinGamePage from "./pages/JoinGamePage.tsx";

const router = createBrowserRouter([
    {
        path: "/auth",
        element: <AuthLayout/>,
        children: [
            {
                path: "/auth/login",
                element: <LoginPage/>
            },
            {
                path: "/auth/register",
                element: <RegisterPage/>
            }
        ]
    },
    {
        path: "/",
        element: <AppLayout/>,
        children: [
            {
                path: "/",
                element: <DashboardPage/>
            },
            {
                path: "/create-game",
                element: <CreateGamePage/>
            },
            {
                path: "/join-game/:gameId",
                element: <JoinGamePage/>
            }
        ]
    },
]);

createRoot(document.getElementById('root')!).render(
    <GlobalProvider>
        <RouterProvider router={router}/>
    </GlobalProvider>
)