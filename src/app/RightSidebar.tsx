import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import "./RightSidebar.less";

import Icon from "../component/Icon";
import ArrowRightSvg from "../svg/arrow-right.svg?raw";
import ArrowLeftSvg from "../svg/arrow-left.svg?raw";
import UnderlineSvg from "../svg/underline.svg?raw";
import EditSvg from "../svg/edit.svg?raw";
import DeleteSvg from "../svg/delete.svg?raw";
import EyeSvg from "../svg/eye.svg?raw";
// import FullscreenSvg from "../svg/fullscreen.svg?raw";
// import FullscreenExitSvg from "../svg/fullscreen-exit.svg?raw";

import {
    selectSelection,
    selectPageNumber,
    selectCurrentNoteId,
    bookActions,
    selectCanNextPage,
    nextPage,
    prevPage,
} from "../slice/bookSlice";
import { deleteNote, addNote, selectNotes } from "../slice/noteSlice";
import { selectLoginUser, selectNotesUser, selectShowNoteInfo, appActions, selectFullscreen } from "../slice/appSlice";

import Drawer from "../component/Drawer";
import Note from "./Note/Note";

export default function RightSidebar() {
    const dispatch = useDispatch();
    const selection = useSelector(selectSelection);
    const pageNumber = useSelector(selectPageNumber);
    const currentNoteId = useSelector(selectCurrentNoteId);
    const canNextPage = useSelector(selectCanNextPage);
    const loginUser = useSelector(selectLoginUser);
    const notesUser = useSelector(selectNotesUser);
    const notes = useSelector(selectNotes);
    const showNoteInfo = useSelector(selectShowNoteInfo);
    const fullscreen = useSelector(selectFullscreen);

    const handleAddNote = async () => {
        const isNoteCross = notes.some((note) => {
            if (note.lastCharId < selection.firstCharId || note.firstCharId > selection.lastCharId) return false;
            return true;
        });

        if (isNoteCross) {
            alert("当前划线的句子有重叠！");
            return;
        }

        dispatch(addNote(selection));
        dispatch(bookActions.setSelection(null));
        // dispatch(bookActions.setCurrentNoteId(_note.id));
        // dispatch(appActions.setShowNoteInfo(true));
    };

    const handleDeleteNote = () => {
        if (!window.confirm("您确定要删除笔记吗？")) return;

        dispatch(deleteNote(currentNoteId));
        dispatch(bookActions.setCurrentNoteId(null));
    };

    const handleFullscreen = () => {
        document.getElementById("root").requestFullscreen();
        dispatch(appActions.setFullscreen(true));
    };

    const handleExitFullscreen = () => {
        document.exitFullscreen();
        dispatch(appActions.setFullscreen(false));
    };

    useEffect(() => {
        window.onkeydown = (e: KeyboardEvent) => {
            if (showNoteInfo) return;

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
                        dispatch(appActions.setShowNoteInfo(true));
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
                case "F11":
                    e.preventDefault();
                    if (fullscreen) {
                        handleExitFullscreen();
                    } else {
                        handleFullscreen();
                    }
                    break;
            }
        };
        window.onwheel = (e: WheelEvent) => {
            if (showNoteInfo) return;

            if (e.deltaY < 0) {
                if (pageNumber === 1) return;
                dispatch(prevPage);
            } else {
                if (!canNextPage) return;
                dispatch(nextPage);
            }
        };
    });

    useEffect(() => {
        if (currentNoteId && notesUser.id !== loginUser.id) {
            dispatch(appActions.setShowNoteInfo(true));
        }
    }, [currentNoteId]);

    return (
        <div className="right-sidebar">
            {/* <Icon
                svg={fullscreen ? FullscreenExitSvg : FullscreenSvg}
                onClick={fullscreen ? handleExitFullscreen : handleFullscreen}
            /> */}
            <Icon
                svg={ArrowLeftSvg}
                onClick={() => dispatch(prevPage)}
                className={classNames({ disabled: pageNumber === 1 })}
            />
            <Icon
                svg={ArrowRightSvg}
                onClick={() => dispatch(nextPage)}
                className={classNames({ disabled: !canNextPage })}
            />
            <Icon
                svg={UnderlineSvg}
                onClick={handleAddNote}
                className={classNames({ disabled: !selection || notesUser.id !== loginUser.id })}
            />
            <Icon
                svg={DeleteSvg}
                onClick={handleDeleteNote}
                className={classNames({ disabled: !currentNoteId || notesUser.id !== loginUser.id })}
            />
            <Icon
                svg={notesUser?.id === loginUser?.id ? EditSvg : EyeSvg}
                onClick={() => dispatch(appActions.setShowNoteInfo(true))}
                className={classNames({ disabled: !currentNoteId })}
            />
            <Drawer
                visible={showNoteInfo}
                title="笔记信息"
                position="right"
                onClose={() => dispatch(appActions.setShowNoteInfo(false))}
                header={false}
            >
                <Note />
            </Drawer>
        </div>
    );
}
