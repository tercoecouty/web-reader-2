import { useSelector, useDispatch } from "react-redux";
import "./Bookshelf.less";

import { selectBookshelf } from "../slice/bookshelfSlice";
import { appActions, selectBookId } from "../slice/appSlice";

export default function Bookshelf() {
    const dispatch = useDispatch();
    const bookshelf = useSelector(selectBookshelf);
    const bookId = useSelector(selectBookId);

    const handleClick = (bookId: number) => {
        dispatch(appActions.setBookId(bookId));
        dispatch(appActions.setShowBookshelf(false));
    };

    const renderBookshelf = () => {
        const domBookshelf = [];
        for (const book of bookshelf) {
            const isReading = book.id === bookId;
            if (isReading) document.title = book.title;

            domBookshelf.push(
                <div className="bookshelf-item" key={book.id}>
                    <span>{book.title}</span>
                    {isReading ? (
                        <span>正在阅读</span>
                    ) : (
                        <span className="bookshelf-button" onClick={() => handleClick(book.id)}>
                            点击阅读
                        </span>
                    )}
                </div>
            );
        }

        return domBookshelf;
    };

    return <div className="bookshelf">{renderBookshelf()}</div>;
}
