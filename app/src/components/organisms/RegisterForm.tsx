import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import {EmailIcon, PasswordIcon, UserIcon} from "../atoms/Icon.tsx";
import FieldLayout from "../molecules/FieldLayout.tsx";
import CustomLink from "../atoms/CustomLink.tsx";
import {register} from "../../services/userManager.ts";
import User from "../../models/user.ts";
import {useState} from "react";
import Alert from "../atoms/Alert.tsx";
import {useNavigate} from "react-router-dom";

export default function RegisterForm() {
    const [displayModal, setDisplayModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const RegisterSchema = Yup.object().shape({
        firstname: Yup.string().min(2, "Cette valeur doit faire au moins 2 caractères").required("Obligatoire"),
        lastname: Yup.string().min(2, "Cette valeur doit faire au moins 2 caractères").required("Obligatoire"),
        username: Yup.string().min(2, "Cette valeur doit faire au moins 2 caractères").required("Obligatoire"),
        email: Yup.string().email('Email invalide').required("Obligatoire"),
        password: Yup.string().min(2, "Cette valeur doit faire au moins 2 caractères").required("Obligatoire"),
    });

    const navigate = useNavigate()

    return <>
        <Formik initialValues={{
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            password: ""
        }}
                validationSchema={RegisterSchema}
                onSubmit={async (values) => {
                    const userModel = new User(
                        values.firstname,
                        values.lastname,
                        values.username,
                        values.email,
                        values.password
                    );
                    const user = await register(userModel)

                    if (user.id === undefined) {
                        setDisplayModal(true)
                        setErrorMessage(user.error)
                    } else {
                        navigate('/auth/login')
                    }
                }}>
            <Form>
                <Alert type={"error"} message={errorMessage} isDisplay={displayModal}/>
                <Field type="text" id="lastname" name="lastname" icon={<UserIcon/>} additionalClassName={"mb-3"}
                       placeholder={"Nom"} component={FieldLayout}/>

                <Field type="text" id="firstname" name="firstname" icon={<UserIcon/>} additionalClassName={"mb-3"}
                       placeholder={"Prénom"} component={FieldLayout}/>

                <Field type="text" id="username" name="username" icon={<UserIcon/>} additionalClassName={"mb-3"}
                       placeholder={"Username"} component={FieldLayout}/>

                <Field type="email" id="email" name="email" icon={<EmailIcon/>} additionalClassName={"mb-3"}
                       placeholder={"Email"} component={FieldLayout}/>

                <Field name="password" icon={<PasswordIcon/>} additionalClassName={"mb-3"} type="password"
                       placeholder={"Password"} component={FieldLayout}/>

                <p className={"mb-3"}>
                    Vous avez déjà un compte ? <CustomLink to={"/auth/login"}>Connectez-vous !</CustomLink>
                </p>

                <button type="submit" className={"btn"}>S'inscrire</button>
            </Form>
        </Formik>
    </>
}