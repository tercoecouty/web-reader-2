import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import SidebarItem from "./SidebarItem";

import ArrowRightSvg from "./svg/arrow-right.svg?raw";
import ArrowLeftSvg from "./svg/arrow-left.svg?raw";
import UnderlineSvg from "./svg/underline.svg?raw";
import EditSvg from "./svg/edit.svg?raw";
import DeleteSvg from "./svg/delete.svg?raw";

import {
    selectSelection,
    selectPageNumber,
    selectCurrentNoteId,
    bookActions,
    selectCanNextPage,
    nextPage,
    prevPage,
} from "../../slice/bookSlice";
import { addNote, deleteNote, selectNotes } from "../../slice/noteSlice";
import { selectLoginUser, selectNotesUser } from "../../slice/appSlice";

import Drawer from "../../component/Drawer";
import Note from "../Note";

export default function RightSidebar() {
    const dispatch = useDispatch();
    const selection = useSelector(selectSelection);
    const pageNumber = useSelector(selectPageNumber);
    const currentNoteId = useSelector(selectCurrentNoteId);
    const canNextPage = useSelector(selectCanNextPage);
    const loginUser = useSelector(selectLoginUser);
    const notesUser = useSelector(selectNotesUser);
    const notes = useSelector(selectNotes);
    const { setSelection, setCurrentNoteId } = bookActions;
    const [editNote, setEditNote] = useState(false);

    const handleAddNote = () => {
        const isNoteCross = notes.some((note) => {
            if (note.lastCharId < selection.firstCharId || note.firstCharId > selection.lastCharId) return false;
            return true;
        });

        if (isNoteCross) {
            alert("当前划线的句子有重叠！");
            return;
        }

        dispatch(addNote(selection));
        dispatch(setSelection(null));
    };

    const handleDeleteNote = () => {
        if (!window.confirm("您确定要删除笔记吗？")) return;

        dispatch(deleteNote(currentNoteId));
        dispatch(setCurrentNoteId(null));
    };

    useEffect(() => {
        window.onkeydown = (e: KeyboardEvent) => {
            switch (e.code) {
                case "ArrowUp":
                case "ArrowLeft":
                    if (pageNumber === 1) return;
                    dispatch(prevPage);
                    break;
                case "ArrowDown":
                case "ArrowRight":
                case "Space":
                    if (!canNextPage) return;
                    dispatch(nextPage);
                    break;
                case "Enter":
                    if (currentNoteId) {
                        setEditNote(true);
                        break;
                    }

                    if (!selection || notesUser.id !== loginUser.id) return;
                    handleAddNote();
                    document.getSelection().removeAllRanges();
                    break;
                case "Delete":
                    if (!currentNoteId || notesUser.id !== loginUser.id) return;
                    handleDeleteNote();
                    break;
            }
        };
        window.onwheel = (e: WheelEvent) => {
            if (e.deltaY < 0) {
                if (pageNumber === 1) return;
                dispatch(prevPage);
            } else {
                if (!canNextPage) return;
                dispatch(nextPage);
            }
        };
    }, []);

    return (
        <div style={{ width: "48px", borderLeft: "1px solid black" }}>
            <SidebarItem
                svg={ArrowLeftSvg}
                title="上一页"
                onClick={() => dispatch(prevPage)}
                disabled={pageNumber === 1}
            />
            <SidebarItem
                svg={ArrowRightSvg}
                title="下一页"
                onClick={() => dispatch(nextPage)}
                disabled={!canNextPage}
            />
            <SidebarItem
                svg={UnderlineSvg}
                title="划线"
                onClick={handleAddNote}
                disabled={!selection || notesUser.id !== loginUser.id}
            />
            <SidebarItem
                svg={DeleteSvg}
                title="删除笔记"
                onClick={handleDeleteNote}
                disabled={!currentNoteId || notesUser.id !== loginUser.id}
            />
            <SidebarItem svg={EditSvg} title="编辑笔记" onClick={() => setEditNote(true)} disabled={!currentNoteId} />
            <Drawer visible={editNote} title="编辑笔记" position="right" onClose={() => setEditNote(false)}>
                <Note />
            </Drawer>
        </div>
    );
}
