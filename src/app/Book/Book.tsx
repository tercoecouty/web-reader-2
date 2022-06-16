import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Book.less";

import Page from "./Page";

import api from "../../api/Api";
import BookLayout from "./bookLayout";

import { bookActions, selectSelection, selectTwoPage, selectIndent, selectLineSpacing } from "../../slice/bookSlice";
import { fetchBookmarks } from "../../slice/bookmarkSlice";
import { fetchNotes } from "../../slice/noteSlice";
import { fetchClasses } from "../../slice/classSlice";
import { appActions, selectNotesUser } from "../../slice/appSlice";

export default function Book() {
    const dispatch = useDispatch();
    const selection = useSelector(selectSelection);
    const twoPage = useSelector(selectTwoPage);
    const notesUser = useSelector(selectNotesUser);
    const indent = useSelector(selectIndent);
    const lineSpacing = useSelector(selectLineSpacing);
    const [bookText, setBookText] = useState("");
    const [resizeTimeoutId, setResizeTimeoutId] = useState(null);

    const updatePage = (_bookText: string) => {
        const domPageContent = document.getElementById("page-content");
        const totalWidth = domPageContent.getBoundingClientRect().width;
        const totalHeight = domPageContent.getBoundingClientRect().height;
        const domMeasure = document.getElementById("char-measurement");
        const book = new BookLayout(_bookText, totalWidth, totalHeight, domMeasure, {
            lineSpacing,
            indent,
        });
        console.log(_bookText.length);
        console.time("pageBreaking");
        const pages = book.pageBreaking();
        console.timeEnd("pageBreaking");
        dispatch(bookActions.setPages(pages));
        dispatch(bookActions.setPageLoading(false));
    };

    useEffect(() => {
        setTimeout(async () => {
            const user = await api.getCurrentUser();
            const lastRead = await api.getLastRead();

            dispatch(appActions.setLoginUser(user));
            dispatch(appActions.setNotesUser(user));
            dispatch(bookActions.setPageNumber(lastRead));
            dispatch(fetchClasses);

            const _bookText = await api.getBookText(2);
            setBookText(_bookText);
            setTimeout(() => updatePage(_bookText), 100); // 有意增加一些加载时间
        }, 0);
    }, []);

    useEffect(() => {
        (window as any).setCurrentUser = async (userId: number) => {
            await api.setCurrentUser(userId);
            const user = await api.getCurrentUser();
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
            clearTimeout(resizeTimeoutId);
            dispatch(bookActions.setPageLoading(true));
            dispatch(bookActions.setPageNumber(1));
            const timer = setTimeout(() => updatePage(bookText), 1000); // 有意增加加载时间
            setResizeTimeoutId(timer);
        };
    });

    const handleMouseUp = () => {
        const _selection = document.getSelection();
        const text = _selection.toString();
        if (text === "") {
            if (selection) {
                dispatch(bookActions.setSelection(null));
            }

            return;
        }

        const range = _selection.getRangeAt(0);
        const startParent = range.startContainer.parentElement;
        const endParent = range.endContainer.parentElement;
        const firstCharId = parseInt(startParent.dataset.firstCharId) + range.startOffset;
        const lastCharId = parseInt(endParent.dataset.firstCharId) + range.endOffset - 1;

        if (!firstCharId || !lastCharId) return;
        dispatch(bookActions.setSelection({ firstCharId, lastCharId, text: text.replace(/\n/g, "") }));
    };

    return (
        <div className="book" onMouseUp={handleMouseUp}>
            <Page />
            {twoPage && <Page isSecondPage />}
        </div>
    );
}
