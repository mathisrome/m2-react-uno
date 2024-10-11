import PasswordField from "../atoms/PasswordField.tsx.old";
import PasswordIcon from "../atoms/PasswordIcon.tsx";

export default function PasswordFormLayout() {
    return <>
        <label htmlFor="password" className="input input-bordered flex items-center gap-2 w-full max-w-xs mb-3">
            <PasswordIcon/>
            <PasswordField/>
        </label>
    </>
}