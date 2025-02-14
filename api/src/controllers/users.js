import User from "../models/users.js";
import {Op} from "sequelize";
import {transporter} from "../server.js";
import mjml2html from 'mjml'

async function generateID(id) {
    const {count} = await findAndCountAllUsersById(id);
    if (count > 0) {
        id = id.substring(0, 5);
        const {count} = await findAndCountAllUsersById(id);
        id = id + (count + 1);
    }
    return id;
}

export async function getUsers() {
    return await User.findAll();
}

export async function getUserById(id) {
    return await User.findByPk(id);
}

export async function findAndCountAllUsersById(id) {
    return await User.findAndCountAll({
        where: {
            id: {
                [Op.like]: `${id}%`,
            },
        },
    });
}

export async function findAndCountAllUsersByEmail(email) {
    return await User.findAndCountAll({
        where: {
            email: {
                [Op.eq]: email,
            },
        },
    });
}

export async function findAndCountAllUsersByUsername(username) {
    return await User.findAndCountAll({
        where: {
            username: {
                [Op.eq]: username,
            },
        },
    });
}

export async function registerUser(userDatas, bcrypt) {
    if (!userDatas) {
        return {error: "Aucune donnée à enregistrer"};
    }

    const {firstname, lastname, username, email, password} = userDatas;

    if (!firstname || !lastname || !username || !email || !password) {
        return {error: "Tous les champs sont obligatoires"};
    }
    //vérification que l'email n'est pas déjà utilisé
    const {count: emailCount} = await findAndCountAllUsersByEmail(email);
    if (emailCount > 0) {
        return {error: "L'adresse email est déjà utilisée."};
    }

    //vérification que le pseudo n'est pas déjà utilisé
    const {count: usernameCount} = await findAndCountAllUsersByUsername(
        username
    );
    if (usernameCount > 0) {
        return {error: "Le nom d'utilisateur est déjà utilisé."};
    }
    //création de l'identifiant
    let id = await generateID(
        (lastname.substring(0, 3) + firstname.substring(0, 3)).toUpperCase()
    );

    //hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password);
    //création de l'utilisateur dans la base de données
    const user = {
        id,
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
    };

    const link = "http://localhost:5173/auth/login?verified=1&userId=" + user.id


    const htmlOutput = mjml2html(`<mjml>
        <mj-body>
            <mj-section>
                <mj-column>
                    <mj-image width="200px" src="http://localhost:5173/uno.png"></mj-image>
                    <mj-text align="center" color="black" font-size="40px" font-family="Helvetica Neue">Bienvenue sur le
                        UNO
                    </mj-text>
                </mj-column>
            </mj-section>
            <mj-section>
                <mj-column>
                    <mj-text align="center">Vérifier votre compte en cliquant sur le bouton ci-dessous.</mj-text>
                    <mj-button href="${link}">Vérifier mon compte</mj-button>
                </mj-column>
            </mj-section>
            <mj-section background-color="#fbfbfb">
                <mj-column>
                    <mj-social font-size="15px" icon-size="30px" mode="horizontal">
                        <mj-social-element name="instagram"
                                           href="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.instagram.com/uno/&ved=2ahUKEwi58OOT7P6IAxWpExAIHWexHroQFnoECB4QAQ&usg=AOvVaw1Fp5OfSytpj1sX-ENHNniL">
                        </mj-social-element>
                    </mj-social>
                </mj-column>

                <mj-column>
                    <mj-social font-size="15px" icon-size="30px" mode="horizontal">
                        <mj-social-element name="facebook"
                                           href="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.facebook.com/uno/%3Flocale%3Dfr_FR&ved=2ahUKEwjTra-g7P6IAxV8CBAIHdpGG_IQFnoECBQQAQ&usg=AOvVaw2g5GDfIoam-es-W2u0KrG_">
                        </mj-social-element>
                    </mj-social>
                </mj-column>

                <mj-column>
                    <mj-social font-size="15px" icon-size="30px" mode="horizontal">
                        <mj-social-element name="x"
                                           href="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://twitter.com/realunogame&ved=2ahUKEwjht9Ss7P6IAxWEGBAIHbylPGsQFnoECBYQAQ&usg=AOvVaw2DQmPZSRjVPjMGquFcQ7he">
                        </mj-social-element>
                    </mj-social>
                </mj-column>
            </mj-section>
        </mj-body>
    </mjml>`)

    await transporter.sendMail({
        to: user.email, // list of receivers
        subject: "Bienvenue sur le UNO", // Subject line
        html: htmlOutput.html, // html body
    });

    return await User.create(user);
}

export async function loginUser(userDatas, app) {
    if (!userDatas) {
        return {error: "Aucune donnée n'a été envoyée"};
    }

    const {email, password} = userDatas;
    if (!email || !password) {
        return {error: "Tous les champs sont obligatoires"};
    }
    //vérification que l'email est utilisé
    const {count, rows} = await findAndCountAllUsersByEmail(email);
    if (count === 0) {
        return {
            error: "Il n'y a pas d'utilisateur associé à cette adresse email.",
        };
    } else if (rows[0].verified === false) {
        return {
            error: "Votre compte n'est pas encore vérifié. Veuillez vérifier votre boîte mail.",
        };
    }
    //récupération de l'utilisateur
    const user = await User.findOne({
        where: {
            email: {
                [Op.eq]: email,
            },
        },
    });
    //comparaison des mots de passe
    const match = await app.bcrypt.compare(password, user.password);
    if (!match) {
        return {error: "Mot de passe incorrect"};
    }
    // Générer le JWT après une authentification réussie
    const token = app.jwt.sign(
        {id: user.id, username: user.username},
        {expiresIn: "3h"}
    );

    return {token};
}

export async function verifiedUser(userId) {
    const user = await getUserById(userId)

    user.set({
        verified: true
    })

    await user.save()

    return user
}