import classNames from "classnames";
import "./NoteEdit.less";

import Icon from "../../component/Icon";
import ArrowLeftSvg from "../../svg/arrow-left.svg?raw";

interface INoteEditProps {
    show?: boolean;
    headerText?: string;
    onClose: () => void;
    onSubmit: () => void;
}

export default function NoteEdit(props: INoteEditProps) {
    const { show, onClose } = props;
    const header = props.headerText || "返回";

    return (
        <div className={classNames("note-edit", { show })}>
            <div className="note-edit-header">
                <Icon onClick={onClose} svg={ArrowLeftSvg} />
                <span className="header-text">{header}</span>
            </div>
            <textarea></textarea>
            <div className="note-edit-images">images</div>
        </div>
    );
}
