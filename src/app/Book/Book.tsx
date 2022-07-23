import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Book.less";

import Page from "./Page";

import api from "../../api/Api";
import BookLayout from "./bookLayout";

import { bookActions, selectSelection, selectTwoPage, selectIndent, selectLineSpacing } from "../../slice/bookSlice";
import { fetchBookmarks } from "../../slice/bookmarkSlice";
import { fetchNotes } from "../../slice/noteSlice";
import { fetchClasses } from "../../slice/classSlice";
import { appActions, selectNotesUser, selectBookId } from "../../slice/appSlice";
import { fetchBookshelf } from "../../slice/bookshelfSlice";

export default function Book() {
    const dispatch = useDispatch();
    const selection = useSelector(selectSelection);
    const twoPage = useSelector(selectTwoPage);
    const notesUser = useSelector(selectNotesUser);
    const indent = useSelector(selectIndent);
    const lineSpacing = useSelector(selectLineSpacing);
    const bookId = useSelector(selectBookId);
    const [bookText, setBookText] = useState("");
    const [resizeTimeoutId, setResizeTimeoutId] = useState(null);

    const updatePage = useCallback(
        (_bookText: string, charId?: number) => {
            const domPageContent = document.getElementById("page-content");
            const totalWidth = domPageContent.getBoundingClientRect().width;
            const totalHeight = domPageContent.getBoundingClientRect().height;
            const domMeasure = document.getElementById("char-measurement");
            const book = new BookLayout(_bookText, totalWidth, totalHeight, domMeasure, {
                lineSpacing,
                indent,
            });
            // console.log(_bookText.length);
            // console.time("pageBreaking");
            const pages = book.pageBreaking();
            // console.timeEnd("pageBreaking");

            dispatch(bookActions.setPages(pages));
            dispatch(bookActions.setPageLoading(false));

            // 窗口尺寸改变后尽量调整到当前阅读的地方
            if (charId) {
                let pageNumber = 1;
                for (let i = 0; i < pages.length; i++) {
                    const page = pages[i];
                    const lastLine = page.lines[page.lines.length - 1];
                    const firstCharId = page.lines[0].firstCharId;
                    const lastCharId = lastLine.firstCharId + lastLine.text.length;
                    if (firstCharId <= charId && charId <= lastCharId) {
                        pageNumber = i + 1;
                        break;
                    }
                }
                dispatch(bookActions.setPageNumber(pageNumber));
            }
        },
        [indent, lineSpacing]
    );

    useEffect(() => {
        setTimeout(async () => {
            const user = await api.getCurrentUser();
            const lastRead = await api.getLastRead();

            dispatch(appActions.setLoginUser(user));
            dispatch(appActions.setNotesUser(user));
            dispatch(bookActions.setPageNumber(lastRead));
            dispatch(fetchClasses);
            dispatch(fetchBookshelf);
        }, 0);
    }, []);

    useEffect(() => {
        dispatch(bookActions.setPageLoading(true));
        setTimeout(async () => {
            const _bookText = await api.getBookText(bookId);
            setBookText(_bookText);

            dispatch(bookActions.setPageNumber(1));
            setTimeout(() => updatePage(_bookText), 100); // 有意增加一些加载时间
        }, 0);
    }, [bookId]);

    useEffect(() => {
        if (!notesUser) return;

        dispatch(fetchNotes(notesUser.id));
        dispatch(fetchBookmarks(notesUser.id));
    }, [bookId, notesUser]);

    useEffect(() => {
        (window as any).setCurrentUser = async (userId: number) => {
            await api.setCurrentUser(userId);
            const user = await api.getCurrentUser();
            dispatch(appActions.setLoginUser(user));
            dispatch(appActions.setNotesUser(user));
        };
    }, []);

    useEffect(() => {
        window.onresize = () => {
            clearTimeout(resizeTimeoutId);
            dispatch(bookActions.setPageLoading(true));
            const charId = (document.querySelector(".line>span") as HTMLElement).dataset.firstCharId;
            const timer = setTimeout(() => updatePage(bookText, parseInt(charId)), 1000); // 有意增加加载时间
            setResizeTimeoutId(timer);
        };
    }, [resizeTimeoutId, updatePage, bookText]);

    useEffect(() => {
        const dom = document.querySelector(".line>span") as HTMLElement;
        if (!dom) return;

        const charId = dom.dataset.firstCharId;
        dispatch(bookActions.setPageLoading(true));
        setTimeout(() => updatePage(bookText, parseInt(charId)), 1000); // 有意增加加载时间
    }, [indent, lineSpacing]);

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

    const PageMemo = useMemo(() => <Page />, []);
    const SecondPageMemo = useMemo(() => <Page isSecondPage />, []);

    return (
        <div className="book" onMouseUp={handleMouseUp}>
            {PageMemo}
            {twoPage && SecondPageMemo}
        </div>
    );
}
