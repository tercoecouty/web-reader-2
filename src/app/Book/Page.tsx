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
    selectIndent,
} from "../../slice/bookSlice";

interface IPageProps {
    isSecondPage?: boolean;
}

export default function Page(props: IPageProps) {
    const dispatch = useDispatch();
    const pages = useSelector(selectPages);
    const pageNumber = useSelector(selectPageNumber);
    const loading = useSelector(selectPageLoading);
    const indent = useSelector(selectIndent);
    const fontSize = useSelector(selectFontSize);
    const fontFamily = useSelector(selectFontFamily);
    const pagePadding = useSelector(selectPagePadding);

    const { setCurrentNoteId } = bookActions;
    const _pageNumber = props.isSecondPage ? pageNumber + 1 : pageNumber;

    const getPageContent = () => {
        const lines = pages[_pageNumber - 1].lines;
        const dom_lines = [];
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            let style: any = {};

            if (line.spacingType === "letter") {
                style.letterSpacing = line.spacing + "px";
            } else {
                style.wordSpacing = line.spacing + "px";
            }
            // if (line.spacing) {
            //     style.textAlignLast = "justify";
            // }

            if (line.indent) {
                style.marginLeft = indent + "em";
            }

            if (line.text === "") {
                style.height = "1.2em";
                style.boxSizing = "content-box";
            }

            dom_lines.push(<Line key={index} line={line} style={style} />);
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

    let pageBodyStyle = {
        fontSize,
        fontFamily,
    };

    if (pages[0]) {
        pageBodyStyle["--line-padding"] = `${pages[0].lineSpacing + pages[0].spacing / 2}px 0px`;
    }

    return (
        <div className="page">
            <div className="page-head">
                {loading || _pageNumber > pages.length ? null : <Bookmark pageNumber={_pageNumber} />}
            </div>
            <div className="page-body" style={{ padding: pagePadding }}>
                <div id="page-content" className="page-content" onClick={handleClick} style={pageBodyStyle}>
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
