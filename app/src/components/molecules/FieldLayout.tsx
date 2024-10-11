import Field from "../atoms/Field.tsx";

export default function FieldLayout({icon, field, form: {touched, errors}, additionalClassName = "", ...props}) {
    return <>
        <div className={additionalClassName}>
            <label htmlFor={props.id} className="input input-bordered flex items-center gap-2 w-full">
                {icon}
                <Field field={field} props={props}/>
            </label>
            {touched[field.name] &&
                errors[field.name] && <div className="text-red-500">{errors[field.name]}</div>}
        </div>
    </>
}