import classNames from "classnames";
import "./NoteEdit.less";

import Icon from "../../component/Icon";
import ArrowLeftSvg from "../../svg/arrow-left.svg?raw";

interface INoteEditProps {
    show?: boolean;
}

export default function NoteEdit(props: INoteEditProps) {
    const { show } = props;

    return (
        <div className={classNames("note-edit", { show })}>
            <div className="note-edit-header">
                <Icon svg={ArrowLeftSvg} />
            </div>
            <textarea></textarea>
            <div className="note-edit-images">images</div>
        </div>
    );
}
