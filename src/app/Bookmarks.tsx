import { useSelector, useDispatch } from "react-redux";
import "./Bookmarks.less";

import { selectBookmarks } from "../slice/bookmarkSlice";
import { bookActions, selectPages } from "../slice/bookSlice";

export default function Bookmarks() {
    const dispatch = useDispatch();
    const bookmarks = useSelector(selectBookmarks);
    const pages = useSelector(selectPages);

    const renderBookmarks = () => {
        return [...bookmarks]
            .sort()
            .filter((pageNumber) => pageNumber <= pages.length)
            .map((pageNumber) => (
                <div
                    key={pageNumber}
                    className="bookmarks-item"
                    onClick={() => dispatch(bookActions.setPageNumber(pageNumber))}
                >
                    第 {pageNumber} 页
                </div>
            ));
    };

    return <div className="bookmarks">{renderBookmarks()}</div>;
}
