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

    const dom_spans = [];
    for (let index = 0; index < line.text.length; index++) {
        const char = line.text[index];
        const charId = line.firstCharId + index;

        let noteId = null;

        for (const note of notes) {
            if (charId >= note.firstCharId && charId <= note.lastCharId) {
                noteId = note.id;
                break;
            }
        }

        if (noteId) {
            let className = "";
            if (currentNoteId === noteId) className = "underline-selected";
            else if (loginUser.id !== notesUser.id) className = "underline-others";
            else className = "underline";

            dom_spans.push(
                <span data-note-id={noteId} data-char-id={charId} key={index} className={className}>
                    {char}
                </span>
            );
            continue;
        }

        dom_spans.push(
            <span data-char-id={charId} key={index}>
                {char}
            </span>
        );
    }

    // console.log("line", new Date().getSeconds());

    return (
        <div className="line" style={props.style} data-para-id={line.paraId}>
            {dom_spans}
        </div>
    );
}
