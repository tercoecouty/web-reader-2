import { useSelector } from "react-redux";
import classNames from "classnames";
import "./Line.less";

import { selectNotesByLine } from "../../slice/noteSlice";
import { selectCurrentNoteIdByLine } from "../../slice/bookSlice";
import { selectLoginUser, selectNotesUser, selectSearchRangeByLine } from "../../slice/appSlice";

interface ILineProps {
    line: ILine;
    style: any;
}

interface ISpan {
    text: string;
    noteId?: number;
    firstCharId?: number;
}

export default function Line(props: ILineProps) {
    const line = props.line;
    const currentNoteId = useSelector((state) => selectCurrentNoteIdByLine(state, line));
    const notes = JSON.parse(useSelector((state) => selectNotesByLine(state, line)));
    const loginUser = useSelector(selectLoginUser);
    const notesUser = useSelector(selectNotesUser);
    const searchRange = JSON.parse(useSelector((state) => selectSearchRangeByLine(state, line)));

    const renderSpans = () => {
        const spans: ISpan[] = [];
        let text = "";
        let noteId = null;
        let lastNoteId = null;
        let index = 0;
        let isLastNoteChar = undefined;
        for (; index < line.text.length; index++) {
            const char = line.text[index];
            const charId = line.firstCharId + index;

            let isNoteChar = false;
            for (const note of notes) {
                if (note.firstCharId <= charId && charId <= note.lastCharId) {
                    isNoteChar = true;
                    lastNoteId = noteId;
                    noteId = note.id;
                    break;
                }
            }

            if (!isLastNoteChar && isNoteChar) {
                if (isLastNoteChar === undefined) {
                    // 第一个字符是划线句
                    text += char;
                } else {
                    // 由普通句子进入划线句子
                    spans.push({ text: text.slice(), noteId: null, firstCharId: charId - text.length });
                    text = char;
                }
            } else if (isLastNoteChar && !isNoteChar) {
                // 由划线句子进入普通句子
                spans.push({ text: text.slice(), noteId, firstCharId: charId - text.length });
                text = char;
                noteId = null;
                lastNoteId = null;
            } else if (isLastNoteChar && isNoteChar) {
                // 两个字符都是划线句子，但是要检查是否属于同一个笔记
                if (lastNoteId && lastNoteId !== noteId) {
                    // 不属于同一个笔记
                    spans.push({ text: text.slice(), noteId: lastNoteId, firstCharId: charId - text.length });
                    text = char;
                } else {
                    // 属于同一个笔记
                    text += char;
                }
            } else {
                // 两个字符都是普通句子
                text += char;
            }

            isLastNoteChar = isNoteChar;
        }
        spans.push({ text: text.slice(), noteId, firstCharId: line.firstCharId + index - text.length });

        const dom_spans = [];
        for (const span of spans) {
            const { noteId, firstCharId, text } = span;
            const selected = noteId && currentNoteId === noteId;
            const others = !selected && loginUser.id !== notesUser.id;
            if (noteId) {
                const className = classNames("underline", { selected, others });
                dom_spans.push(
                    <span
                        data-note-id={noteId}
                        className={className}
                        data-first-char-id={firstCharId}
                        key={firstCharId}
                    >
                        {text}
                    </span>
                );
            } else {
                dom_spans.push(
                    <span data-first-char-id={firstCharId} key={firstCharId}>
                        {text}
                    </span>
                );
            }
        }

        return dom_spans;
    };

    const renderSpansWithHighlight = () => {
        const domSpans = [];
        for (let index = 0; index < line.text.length; index++) {
            const char = line.text[index];
            const charId = line.firstCharId + index;

            let isNoteChar = false;
            let noteId = null;
            for (const note of notes) {
                if (note.firstCharId <= charId && charId <= note.lastCharId) {
                    isNoteChar = true;
                    noteId = note.id;
                    break;
                }
            }

            let isHighlightChar = false;
            if (searchRange && searchRange.firstCharId <= charId && charId <= searchRange.lastCharId) {
                isHighlightChar = true;
            }

            if (isNoteChar) {
                const selected = noteId && currentNoteId === noteId;
                const others = !selected && loginUser.id !== notesUser.id;

                domSpans.push(
                    <span
                        data-note-id={noteId}
                        className={classNames("underline", { selected, others, highlight: isHighlightChar })}
                        data-first-char-id={charId}
                        key={charId}
                    >
                        {char}
                    </span>
                );
            } else {
                domSpans.push(
                    <span
                        className={classNames({ highlight: isHighlightChar })}
                        data-first-char-id={charId}
                        key={charId}
                    >
                        {char}
                    </span>
                );
            }
        }

        return domSpans;
    };

    return (
        <div className="line" style={props.style}>
            {searchRange ? renderSpansWithHighlight() : renderSpans()}
        </div>
    );
}
