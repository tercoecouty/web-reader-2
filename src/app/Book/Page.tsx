import { useSelector, useDispatch } from "react-redux";
import "./Page.less";

import Bookmark from "./Bookmark";
import Line from "./Line";

import {
    selectPages,
    selectPageNumber,
    selectPageLoading,
    bookActions,
    selectFontSize,
    selectFontFamily,
    selectPagePadding,
} from "../../slice/bookSlice";

interface IPageProps {
    isSecondPage?: boolean;
}

export default function Page(props: IPageProps) {
    const dispatch = useDispatch();
    const pages = useSelector(selectPages);
    const pageNumber = useSelector(selectPageNumber);
    const loading = useSelector(selectPageLoading);
    const fontSize = useSelector(selectFontSize);
    const fontFamily = useSelector(selectFontFamily);
    const pagePadding = useSelector(selectPagePadding);

    const { setCurrentNoteId } = bookActions;
    const _pageNumber = props.isSecondPage ? pageNumber + 1 : pageNumber;

    const getPageContent = () => {
        const lines = pages[_pageNumber - 1].lines;
        const dom_lines = [];
        for (let index_line = 0; index_line < lines.length; index_line++) {
            const line = lines[index_line];
            let style: any = {
                // 因为行高相同，每一页的行的数量都是相同的，所以每一页的spacing都相同
                padding: `${pages[0].lineSpacing + pages[0].spacing / 2}px 0`,
            };

            if (line.spacingType === "letter") {
                style.letterSpacing = line.spacing + "px";
            } else {
                style.wordSpacing = line.spacing + "px";
            }

            if (line.indent) {
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
                {loading || _pageNumber > pages.length ? null : <Bookmark pageNumber={_pageNumber} />}
            </div>
            <div className="page-body" style={{ padding: pagePadding }}>
                <div id="page-content" className="page-content" onClick={handleClick} style={{ fontSize, fontFamily }}>
                    {!props.isSecondPage && <span id="char-measurement" className="char-measurement"></span>}
                    {loading ? pageLoading : _pageNumber > pages.length ? null : getPageContent()}
                </div>
            </div>
            <div className="page-foot">
                {loading || _pageNumber > pages.length ? null : `${_pageNumber} / ${pages.length}`}
            </div>
        </div>
    );
}
