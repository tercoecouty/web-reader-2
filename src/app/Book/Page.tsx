import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Page.less";

import Bookmark from "./Bookmark";
import Line from "./Line";

import { selectPages, selectPageNumber, selectPageLoading, bookActions } from "../../slice/bookSlice";

interface IPageProps {
    isSecondPage?: boolean;
}

function Page(props: IPageProps) {
    const dispatch = useDispatch();
    const pages = useSelector(selectPages);
    const _pageNumber = useSelector(selectPageNumber);
    const loading = useSelector(selectPageLoading);

    const { setCurrentNoteId } = bookActions;
    const pageNumber = props.isSecondPage ? _pageNumber + 1 : _pageNumber;

    const getPageContent = () => {
        // console.log("getPageContent");
        const lines = pages[pageNumber - 1].lines;
        const dom_lines = [];
        for (let index_line = 0; index_line < lines.length; index_line++) {
            const line = lines[index_line];
            let style: any = {
                letterSpacing: line.spacing + "px",
                padding: `${5 + pages[0].spacing / 2}px 0`,
            };

            if (line.isFirstLine) {
                style.marginLeft = "2em";
            }

            if (line.text === "") {
                style.height = "1.2em";
                style.boxSizing = "content-box";
            }

            dom_lines.push(<Line key={index_line} line={line} style={style} />);
        }

        return dom_lines;
    };

    const pageLoading = (
        <div className="page-loading">
            <span>加载中......</span>
        </div>
    );

    const handleClick = (e) => {
        const noteId = parseInt(e.target.dataset.noteId);
        if (!noteId) {
            dispatch(setCurrentNoteId(null));
            return;
        }

        dispatch(setCurrentNoteId(noteId));
    };

    return (
        <div className="page">
            <div className="page-head">
                {loading || pageNumber > pages.length ? null : <Bookmark pageNumber={pageNumber} />}
            </div>
            <div className="page-body">
                <div id="page-content" className="page-content" onClick={handleClick}>
                    <span id="char-measurement" className="char-measurement"></span>
                    {loading ? pageLoading : pageNumber > pages.length ? null : getPageContent()}
                </div>
            </div>
            <div className="page-foot">
                {loading || pageNumber > pages.length ? null : `${pageNumber} / ${pages.length}`}
            </div>
        </div>
    );
}

export default React.memo(Page);
