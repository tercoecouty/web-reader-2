import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "../api/Api";

interface IBookmarkState {
    bookmarks: number[];
}

const initialState: IBookmarkState = {
    bookmarks: [],
};

const bookmarkSlice = createSlice({
    name: "bookmark",
    initialState,
    reducers: {
        addBookmark: (state, actions: PayloadAction<number>) => {
            state.bookmarks.push(actions.payload);
        },
        deleteBookmark: (state, actions: PayloadAction<number>) => {
            const pageNumber = actions.payload;
            state.bookmarks = state.bookmarks.filter((value) => value !== pageNumber);
        },
        setBookmarks: (state, actions: PayloadAction<number[]>) => {
            state.bookmarks = actions.payload;
        },
    },
});

export default bookmarkSlice.reducer;
export const bookmarkActions = bookmarkSlice.actions;
export const selectBookmarks = (state: RootState) => state.bookmark.bookmarks;
export const addBookmark = (pageNumber: number) => async (dispatch: Dispatch) => {
    await api.addBookmark(pageNumber);
    dispatch(bookmarkSlice.actions.addBookmark(pageNumber));
};
export const deleteBookmark = (pageNumber: number) => async (dispatch: Dispatch) => {
    await api.deleteBookmark(pageNumber);
    dispatch(bookmarkSlice.actions.deleteBookmark(pageNumber));
};
export const fetchBookmarks = (userId: number) => async (dispatch: Dispatch) => {
    const _bookmarks = await api.getBookmarks(userId);
    dispatch(bookmarkSlice.actions.setBookmarks(_bookmarks));
};
