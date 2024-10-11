import Button from "../atoms/Button.tsx";
import {useState} from "react";
import FieldLayout from "../molecules/FieldLayout.tsx";
import Field from "../atoms/Field.tsx";

export default function DialogJoinGame() {
    const [visible, setVisible] = useState(false)

    return <>
        <Button icon={""} onClickCallback={() => {
            setVisible(!visible)
        }}>
            Rejoindre une partie
        </Button>
        <dialog id="createGameModal" className={"modal modal-middle" + (visible ? " modal-open" : "")}>
            <div className="modal-box">
                <Field/>
                <div className="modal-action">
                    <form method="dialog">
                        <Button classNameString={"btn"} onClickCallback={() => {
                            setVisible(!visible)
                        }}>Close</Button>
                    </form>
                </div>
            </div>
        </dialog>
    </>
}