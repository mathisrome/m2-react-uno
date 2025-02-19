import chalk from "chalk";
//pour fastify
import fastify from "fastify";
import fastifyBcrypt from "fastify-bcrypt";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJWT from "@fastify/jwt";
import nodeMailer from "nodemailer";
import socketioServer from "fastify-socket.io"
//routes
//bdd
import {sequelize} from "./bdd.js";
import {usersRoutes} from "./routes/users.js";
import {gamesRoutes} from "./routes/games.js";

//Test de la connexion
try {
    sequelize.authenticate();
    console.log(chalk.grey("Connecté à la base de données MySQL!"));
} catch (error) {
    console.error("Impossible de se connecter, erreur suivante :", error);
}

/**
 * API
 * avec fastify
 */
let blacklistedTokens = [];
const app = fastify();
//Ajout du plugin fastify-bcrypt pour le hash du mdp
await app
    .register(fastifyBcrypt, {
        saltWorkFactor: 12,
    })
    .register(fastifySwagger, {
        openapi: {
            openapi: "3.0.0",
            info: {
                title: "Documentation de l'API JDR LOTR",
                description:
                    "API développée pour un exercice avec React avec Fastify et Sequelize",
                version: "0.1.0",
            },
        },
    })
    .register(fastifySwaggerUi, {
        routePrefix: "/documentation",
        theme: {
            title: "Docs - JDR LOTR API",
        },
        uiConfig: {
            docExpansion: "list",
            deepLinking: false,
        },
        uiHooks: {
            onRequest: function (request, reply, next) {
                next();
            },
            preHandler: function (request, reply, next) {
                next();
            },
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => {
            return swaggerObject;
        },
        transformSpecificationClone: true,
    })
    .register(fastifyJWT, {
        secret: "unanneaupourlesgouvernertous",
    })
    .register(socketioServer, {
        cors: {
            origin: "*",
        }
    })
    .register(cors, {
        origin: "*",
    })
/**********
 * Routes
 **********/
app.get("/", (request, reply) => {
    reply.send({documentationURL: "http://localhost:3000/documentation"});
});
// Fonction pour décoder et vérifier le token
app.decorate("authenticate", async (request, reply) => {
    try {
        const token = request.headers["authorization"].split(" ")[1];

        // Vérifier si le token est dans la liste noire
        if (blacklistedTokens.includes(token)) {
            return reply
                .status(401)
                .send({error: "Token invalide ou expiré"});
        }
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});
//gestion utilisateur
usersRoutes(app);
//gestion des jeux
gamesRoutes(app);

const transporter = nodeMailer.createTransport({
        defaults: {
            from: "noreply@uno.fr",
        },
        host: 'mailcatcher',
        port: 1025,
        secure: false
    }
)

export {transporter}

/**********
 * START
 **********/

app.io.on("connection", (socket) => {
    socket.on("createGame", (gameId) => {
        console.log("La partie suivante a été créé : " + gameId)

        socket.join(gameId)
    })

    socket.on("gameJoined", (args) => {
        console.log("L'utilisateur " + args.id + " à rejoint la partie : " + args.gameId)

        socket.join(args.gameId)

        socket.to(args.gameId).emit("gameJoined", args.id)
    })

    socket.on("startGame", (gameId) => {
        console.log("Partie lancée : " + gameId)

        socket.to(gameId).emit("startGame", gameId)
    })

    socket.on("updatePlayers", (gameId, players) => {
        console.log("Mise à jour des joueurs")

        socket.to(gameId).emit("updatePlayers", players)
    })

    socket.on("lastCardPlayed", (gameId, card) => {
        console.log("Dernière carte jouée", card)

        socket.to(gameId).emit("lastCardPlayed", card)
    })

    socket.on("lastPlayerPlayed", (gameId, player) => {
        console.log("Dernier joueur qui a joué", player)

        socket.to(gameId).emit("lastPlayerPlayed", player)
    })

    socket.on("pileOfCards", (gameId, cards) => {
        console.log("Envoie de la pile de carte", cards)

        socket.to(gameId).emit("pileOfCards", cards)
    })

    socket.on("gameEnd", (gameId) => {
        console.log("Fin de la partie : " + gameId)

        socket.to(gameId).emit("gameEnd", gameId)
    })

    socket.on("disconnect", () => {
        console.log("Joueur déconnecté : " + socket.id)
    })
})

const start = async () => {
    try {
        await sequelize
            .sync({alter: true})
            .then(() => {
                console.log(chalk.green("Base de données synchronisée."));
            })
            .catch((error) => {
                console.error(
                    "Erreur de synchronisation de la base de données :",
                    error
                );
            });
        await app.listen({port: 3000, host: '0.0.0.0'});
        console.log(
            "Serveur Fastify lancé sur " + chalk.blue("http://localhost:3000")
        );
        console.log(
            chalk.bgYellow(
                "Accéder à la documentation sur http://localhost:3000/documentation"
            )
        );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
start();
