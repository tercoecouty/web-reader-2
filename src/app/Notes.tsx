import { useDispatch, useSelector } from "react-redux";
import "./Notes.less";

import { selectNotes } from "../slice/noteSlice";
import { selectPages, bookActions } from "../slice/bookSlice";
import { appActions } from "../slice/appSlice";

export default function Notes() {
    const dispatch = useDispatch();
    const notes = useSelector(selectNotes);
    const pages = useSelector(selectPages);

    const handleClick = (noteId: number, pageNumber: number) => {
        dispatch(bookActions.setPageNumber(pageNumber));
        dispatch(bookActions.setCurrentNoteId(noteId));
        dispatch(appActions.setShowNotes(false));
    };

    const renderNotes = () => {
        const domNotes = [];
        for (const note of notes) {
            let pageNumber = 1;
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const firstCharId = page.lines[0].firstCharId;
                const lastLine = page.lines[page.lines.length - 1];
                const lastCharId = lastLine.firstCharId + lastLine.text.length;
                if (note.firstCharId > firstCharId && note.firstCharId < lastCharId) {
                    pageNumber = i + 1;
                    break;
                }
            }

            domNotes.push(
                <div className="notes-item" key={note.id} onClick={() => handleClick(note.id, pageNumber)}>
                    <div className="notes-item-text">{note.text}</div>
                    <div className="notes-item-page">{pageNumber}</div>
                </div>
            );
        }

        if (domNotes.length) {
            return domNotes;
        } else {
            return <div className="empty-list">没有笔记</div>;
        }
    };

    return <div className="notes">{renderNotes()}</div>;
}
