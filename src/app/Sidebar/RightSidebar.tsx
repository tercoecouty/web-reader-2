import { useState } from "react";
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
import { addNote, deleteNote } from "../../slice/noteSlice";
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
    const { setSelection, setCurrentNoteId } = bookActions;
    const [editNote, setEditNote] = useState(false);

    const handleAddNote = () => {
        dispatch(addNote(selection));
        dispatch(setSelection(null));
    };

    const handleDeleteNote = () => {
        if (!window.confirm("您确定要删除笔记吗？")) return;

        dispatch(deleteNote(currentNoteId));
        dispatch(setCurrentNoteId(null));
    };

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
