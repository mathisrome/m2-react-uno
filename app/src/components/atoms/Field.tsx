export default function Field({field, props}) {
    return <input {...field} {...props}
                  className="w-full"
    />
}