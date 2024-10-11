import {Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import FieldLayout from "../molecules/FieldLayout.tsx";
import {EmailIcon, PasswordIcon} from "../atoms/Icon.tsx";
import CustomLink from "../atoms/CustomLink.tsx";
import {login, verified} from "../../services/userService.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import Alert from "../atoms/Alert.tsx";
import {GlobalContext} from "../../GlobalContext.tsx";

export default function LoginForm() {
    const LoginSchema = Yup.object().shape({
        password: Yup.string().min(2).required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
    });

    const [displayModalError, setDisplayModalError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [displayModalLoading, setDisplayModalLoading] = useState(false)
    const [message, setMessage] = useState("")

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const {saveToken, saveUser} = useContext(GlobalContext)

    useEffect(() => {
        if (searchParams.get("verified") === "1" && searchParams.get("userId") !== null) {
            setDisplayModalLoading(true)
            setMessage("Validation en cours ! ")

            verified(searchParams.get("userId")).then(res => {
                setDisplayModalLoading(false)
                navigate("/auth/login")
            })
        }
    }, [])

    return <>
        <Formik initialValues={{
            email: '',
            password: ''
        }}
                validationSchema={LoginSchema}
                onSubmit={async (values) => {
                    const tokenString = await login(values.email, values.password)

                    if (tokenString.error) {
                        setDisplayModalError(true)
                        setErrorMessage(tokenString.error)
                    } else {
                        saveToken(tokenString.token)
                        navigate("/")
                    }
                }}>
            {({errors, touched}) => (
                <Form>
                    <Alert type={"error"} message={errorMessage} isDisplay={displayModalError}/>
                    <Alert type={"info"} message={message} isDisplay={displayModalLoading}/>

                    <Field id="email" name="email" icon={<EmailIcon/>} additionalClassName={"mb-3"}
                           placeholder={"Email"} component={FieldLayout}/>

                    <Field name="password" icon={<PasswordIcon/>} additionalClassName={"mb-3"} type="password"
                           placeholder={"Password"} component={FieldLayout}/>
                    <p className={"mb-3"}>
                        Vous n'avez pas de compte ? <CustomLink to={"/auth/register"}>Inscrivez-vous</CustomLink>
                    </p>

                    <button type="submit" className={"btn"}>Se connecter</button>
                </Form>
            )}
        </Formik>
    </>
}