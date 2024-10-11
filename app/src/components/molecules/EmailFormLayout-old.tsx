import Icon from "../atoms/Icon.tsx";
import EmailField from "../atoms/Field.tsx.old";

export default function EmailFormLayout() {
    return <>
        <label htmlFor="email" className="input input-bordered flex items-center gap-2 w-full max-w-xs mb-3">
            <Icon/>
            <EmailField/>
        </label>
    </>
}