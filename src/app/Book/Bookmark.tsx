import { useSelector, useDispatch } from "react-redux";
import "./Bookmark.less";

import BookmarkSvg from "./svg/bookmark.svg?raw";
import BookmarkFilledSvg from "./svg/bookmark-filled.svg?raw";

import Icon from "../../component/Icon";

import { addBookmark, deleteBookmark } from "../../slice/bookmarkSlice";
import { selectBookmarks } from "../../slice/bookmarkSlice";

interface IPageHeadProps {
    pageNumber?: number;
}

export default function Bookmark(props: IPageHeadProps) {
    const dispatch = useDispatch();
    const bookmarks = useSelector(selectBookmarks);
    const pageNumber = props.pageNumber;

    const hasBookmark = bookmarks.includes(pageNumber);

    if (hasBookmark) {
        return (
            <div className="bookmark" onClick={() => dispatch(deleteBookmark(pageNumber))}>
                <Icon svg={BookmarkFilledSvg} />
            </div>
        );
    }

    return (
        <div className="bookmark" onClick={() => dispatch(addBookmark(pageNumber))}>
            <Icon svg={BookmarkSvg} />
        </div>
    );
}
