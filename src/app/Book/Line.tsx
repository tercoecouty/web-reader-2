import { useSelector } from "react-redux";
import "./Line.less";

import { selectNotesByLine } from "../../slice/noteSlice";
import { selectCurrentNoteIdByLine } from "../../slice/bookSlice";
import { selectLoginUser, selectNotesUser } from "../../slice/appSlice";

interface ILineProps {
    line: ILine;
    style: any;
}

export default function Line(props: ILineProps) {
    const line = props.line;
    const currentNoteId = useSelector((state) => selectCurrentNoteIdByLine(state, line));
    const notes = JSON.parse(useSelector((state) => selectNotesByLine(state, line)));
    const loginUser = useSelector(selectLoginUser);
    const notesUser = useSelector(selectNotesUser);

    const renderSpans = () => {
        let dom_spans = [];
        let text = "";
        let spanText = "";
        let noteId = null;
        let index = 0;
        for (; index < line.text.length; index++) {
            const char = line.text[index];
            const charId = line.firstCharId + index;

            let isInNote = false;
            for (const note of notes) {
                if (charId >= note.firstCharId && charId <= note.lastCharId) {
                    isInNote = true;
                    noteId = note.id;
                    break;
                }
            }

            // TODO 两个连续的划线句子会出错
            if (isInNote) {
                if (text) {
                    const firstCharId = line.firstCharId + index - text.length;
                    dom_spans.push(
                        <span data-first-char-id={firstCharId} key={firstCharId}>
                            {text}
                        </span>
                    );
                    text = "";
                }
                spanText += char;
            } else {
                if (spanText) {
                    let className = "";
                    if (noteId && currentNoteId === noteId) className = "underline-selected";
                    else if (loginUser.id !== notesUser.id) className = "underline-others";
                    else className = "underline";

                    const firstCharId = line.firstCharId + index - spanText.length;
                    dom_spans.push(
                        <span
                            data-note-id={noteId}
                            className={className}
                            data-first-char-id={firstCharId}
                            key={firstCharId}
                        >
                            {spanText}
                        </span>
                    );

                    spanText = "";
                }

                text += char;
            }
        }

        if (text) {
            const firstCharId = line.firstCharId + index - text.length;
            dom_spans.push(
                <span data-first-char-id={firstCharId} key={firstCharId}>
                    {text}
                </span>
            );
        }

        if (spanText) {
            let className = "";
            if (currentNoteId === noteId) className = "underline-selected";
            else if (loginUser.id !== notesUser.id) className = "underline-others";
            else className = "underline";

            const firstCharId = line.firstCharId + index - spanText.length;
            dom_spans.push(
                <span data-note-id={noteId} className={className} data-first-char-id={firstCharId} key={firstCharId}>
                    {spanText}
                </span>
            );
        }

        return dom_spans;
    };

    return (
        <div className="line" style={props.style}>
            {renderSpans()}
        </div>
    );
}
