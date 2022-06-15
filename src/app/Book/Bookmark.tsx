import { useSelector, useDispatch } from "react-redux";
import "./Bookmark.less";

import BookmarkSvg from "./svg/bookmark.svg?raw";
import BookmarkFilledSvg from "./svg/bookmark-filled.svg?raw";

import Icon from "../../component/Icon";

import { addBookmark, deleteBookmark } from "../../slice/bookmarkSlice";
import { selectBookmarks } from "../../slice/bookmarkSlice";
import { selectLoginUser, selectNotesUser } from "../../slice/appSlice";

interface IPageHeadProps {
    pageNumber?: number;
}

export default function Bookmark(props: IPageHeadProps) {
    const dispatch = useDispatch();
    const bookmarks = useSelector(selectBookmarks);
    const pageNumber = props.pageNumber;
    const loginUser = useSelector(selectLoginUser);
    const notesUser = useSelector(selectNotesUser);

    if (notesUser.id !== loginUser.id) return null;

    if (bookmarks.includes(pageNumber)) {
        return (
            <div className="bookmark" onClick={() => dispatch(deleteBookmark(pageNumber))}>
                <Icon svg={BookmarkFilledSvg} />
            </div>
        );
    } else {
        return (
            <div className="bookmark" onClick={() => dispatch(addBookmark(pageNumber))}>
                <Icon svg={BookmarkSvg} />
            </div>
        );
    }
}
