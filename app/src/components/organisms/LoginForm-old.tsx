import EmailFormLayout from "../molecules/EmailFormLayout.tsx";
import PasswordFormLayout from "../molecules/PasswordFormLayout.tsx";

export default function LoginForm() {
    const handleSubmit = (event) => {
        event.preventDefault()
        const email = event.target.elements.email.value
        const password = event.target.elements.password.value

        console.log(
            email,
            password
        )
    }

    return <>
        <form onSubmit={handleSubmit}>
            <EmailFormLayout/>
            <PasswordFormLayout/>

            <button type={"submit"} className="btn mt-3">Se connecter</button>
        </form>
    </>
}