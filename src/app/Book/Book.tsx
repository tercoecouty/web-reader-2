import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Book.less";

import Page from "./Page";

import api from "../../api/Api";
import BookLayout from "./bookLayout";

import { bookActions, selectSelection, selectTwoPage } from "../../slice/bookSlice";
import { fetchBookmarks } from "../../slice/bookmarkSlice";
import { fetchNotes } from "../../slice/noteSlice";
import { fetchClasses } from "../../slice/classSlice";
import { appActions, selectNotesUser } from "../../slice/appSlice";

export default function Book() {
    const dispatch = useDispatch();
    const selection = useSelector(selectSelection);
    const twoPage = useSelector(selectTwoPage);
    const { setPages, setPageLoading, setSelection } = bookActions;
    const notesUser = useSelector(selectNotesUser);
    const [bookText, setBookText] = useState("");
    const [resizeTimer, setResizeTimer] = useState(null);

    const loadPage = (bookText) => {
        const domPageContent = document.getElementById("page-content");
        const totalWidth = domPageContent.getBoundingClientRect().width;
        const totalHeight = domPageContent.getBoundingClientRect().height;
        const domMeasure = document.getElementById("char-measurement");
        const book = new BookLayout(bookText, totalWidth, totalHeight, domMeasure);
        // console.time("pageBreaking");
        const pages = book.pageBreaking();
        // console.timeEnd("pageBreaking");
        dispatch(setPages(pages));
        dispatch(setPageLoading(false));
    };

    useEffect(() => {
        setTimeout(async () => {
            const user = await api.getUserInfo();
            const lastRead = await api.getLastRead();

            dispatch(appActions.setLoginUser(user));
            dispatch(appActions.setNotesUser(user));
            dispatch(bookActions.setPageNumber(lastRead));
            dispatch(fetchClasses);

            const bookText = await api.getBookText();
            setBookText(bookText);
            setTimeout(() => loadPage(bookText), 100);
        }, 0);
    }, []);

    useEffect(() => {
        (window as any).setCurrentUser = async (userId: number) => {
            await api.setCurrentUser(userId);
            const user = await api.getUserInfo();
            dispatch(appActions.setLoginUser(user));
            dispatch(appActions.setNotesUser(user));
        };
    });

    useEffect(() => {
        if (!notesUser) return;

        dispatch(fetchNotes(notesUser.id));
        dispatch(fetchBookmarks(notesUser.id));
    }, [notesUser]);

    useEffect(() => {
        window.onresize = () => {
            clearTimeout(resizeTimer);
            dispatch(setPageLoading(true));
            const timer = setTimeout(() => loadPage(bookText), 1000);
            setResizeTimer(timer);
        };
    });

    const handleMouseUp = () => {
        const _selection = document.getSelection();
        const text = _selection.toString();
        if (text === "") {
            if (selection) {
                dispatch(setSelection(null));
            }

            return;
        }

        const range = _selection.getRangeAt(0);
        const startParent = range.startContainer.parentElement;
        const endParent = range.endContainer.parentElement;
        const charId1 = parseInt(startParent.dataset.firstCharId) + range.startOffset;
        const charId2 = parseInt(endParent.dataset.firstCharId) + range.endOffset - 1;

        if (!charId1 || !charId2) return;

        dispatch(
            setSelection({
                firstCharId: charId1 > charId2 ? charId2 : charId1,
                lastCharId: charId1 > charId2 ? charId1 : charId2,
                text: text.replace(/\n/g, ""),
            })
        );
    };

    return (
        <div className="book" onMouseUp={handleMouseUp}>
            <Page />
            {twoPage && <Page isSecondPage />}
        </div>
    );
}
