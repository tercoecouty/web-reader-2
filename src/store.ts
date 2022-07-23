import { configureStore } from "@reduxjs/toolkit";

import bookReducer from "./slice/bookSlice";
import noteReducer from "./slice/noteSlice";
import bookmarkReducer from "./slice/bookmarkSlice";
import commentReducer from "./slice/commentSlice";
import likeReducer from "./slice/likeSlice";
import appReducer from "./slice/appSlice";
import classReducer from "./slice/classSlice";
import bookshelfReducer from "./slice/bookshelfSlice";

const store = configureStore({
    reducer: {
        book: bookReducer,
        note: noteReducer,
        bookmark: bookmarkReducer,
        comment: commentReducer,
        like: likeReducer,
        app: appReducer,
        class: classReducer,
        bookshelf: bookshelfReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
