import {getUserById, getUsers, loginUser, registerUser, verifiedUser,} from "../controllers/users.js";

export function usersRoutes(app, blacklistedTokens) {
    app.post("/login", async (request, reply) => {
        reply.send(await loginUser(request.body, app));
    }).post(
        "/logout",
        {preHandler: [app.authenticate]},
        async (request, reply) => {
            const token = request.headers["authorization"].split(" ")[1]; // Récupérer le token depuis l'en-tête Authorization

            // Ajouter le token à la liste noire
            blacklistedTokens.push(token);

            reply.send({logout: true});
        }
    );
    //inscription
    app.post("/register", async (request, reply) => {
        const user = await registerUser(request.body, app.bcrypt)

        if (user.id === undefined) {
            reply.status(422).send(user);
        }

        reply.send(user);
    });
    //récupération de la liste des utilisateurs
    app.get(
        "/users",
        {preHandler: [app.authenticate]},
        async (request, reply) => {
        reply.send(await getUsers());
    });
    //récupération d'un utilisateur par son id
    app.get(
        "/users/:id",
        {preHandler: [app.authenticate]},
        async (request, reply) => {
            reply.send(await getUserById(request.params.id));
        });

    //récupération d'un utilisateur par son id
    app.post("/users/:id", async (request, reply) => {
        reply.send(await verifiedUser(request.params.id));
    });
}
