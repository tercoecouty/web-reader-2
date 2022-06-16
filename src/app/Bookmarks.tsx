import { useSelector, useDispatch } from "react-redux";
import "./Bookmarks.less";

import { selectBookmarks } from "../slice/bookmarkSlice";
import { bookActions, selectPages } from "../slice/bookSlice";
import { appActions } from "../slice/appSlice";

export default function Bookmarks() {
    const dispatch = useDispatch();
    const bookmarks = useSelector(selectBookmarks);
    const pages = useSelector(selectPages);

    const handleClick = (pageNumber: number) => {
        dispatch(bookActions.setPageNumber(pageNumber));
        dispatch(appActions.setShowBookmarks(false));
    };

    const renderBookmarks = () => {
        const domBookmarks = [];
        for (const pageNumber of bookmarks.sort()) {
            domBookmarks.push(
                <div key={pageNumber} className="bookmarks-item" onClick={() => handleClick(pageNumber)}>
                    第 {pageNumber} 页
                </div>
            );
        }

        if (domBookmarks.length) {
            return domBookmarks;
        } else {
            return <div className="empty-list">没有书签</div>;
        }
    };

    return <div className="bookmarks">{renderBookmarks()}</div>;
}
