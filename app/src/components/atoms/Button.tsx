export default function Button({classNameString, onClickCallback, children, icon}) {
    return <>
        <button className={classNameString } onClick={onClickCallback}>
            <span>{icon}</span>
            {children}
        </button>
    </>
}