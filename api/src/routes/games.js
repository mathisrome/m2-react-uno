import {createGame, getGame, getGames, updateGame} from "../controllers/games.js";
export function gamesRoutes(app) {
	//création d'un jeu
	app.post(
		"/game",
		{ preHandler: [app.authenticate] },
		async (request, reply) => {
			reply.send(await createGame(request.body.userId));
		}
	);

	app.patch(
		"/game/:action/:gameId",
		{ preHandler: [app.authenticate] },
		async (request, reply) => {
			reply.send(await updateGame(request));
		}
	);

	// récupérer les informations d'un jeu
	app.get(
		"/game/:gameId",
		{ preHandler: [app.authenticate] },
		async (request, reply) => {
			reply.send(await getGame(request.params.gameId));
		}
	);

    app.get(
        "/games",
        { preHandler: [app.authenticate] },
        async (request, reply) => {
            reply.send(await getGames());
        }
    )
}
