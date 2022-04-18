import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Bookmark.less";

import BookmarkImage from "./img/bookmark.png";
import BookmarkFilledImage from "./img/bookmark-filled.png";

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

    return (
        <React.Fragment>
            {hasBookmark && (
                <div className="bookmark" onClick={() => dispatch(deleteBookmark(pageNumber))}>
                    <img src={BookmarkFilledImage} />
                </div>
            )}
            {!hasBookmark && (
                <div className="bookmark" onClick={() => dispatch(addBookmark(pageNumber))}>
                    <img src={BookmarkImage} />
                </div>
            )}
        </React.Fragment>
    );
}
