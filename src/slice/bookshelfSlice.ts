import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "../api/Api";

interface IBookshelfState {
    bookshelf: IBookshelfItem[];
}

const initialState: IBookshelfState = {
    bookshelf: [],
};

const bookshelfSlice = createSlice({
    name: "bookshelf",
    initialState,
    reducers: {
        setBookshelf: (state, actions: PayloadAction<IBookshelfItem[]>) => {
            state.bookshelf = actions.payload;
        },
    },
});

export default bookshelfSlice.reducer;
export const bookmarkActions = bookshelfSlice.actions;
export const selectBookshelf = (state: RootState) => state.bookshelf.bookshelf;
export const fetchBookshelf = async (dispatch: Dispatch) => {
    const _bookshelf = await api.getBookshelf();
    dispatch(bookshelfSlice.actions.setBookshelf(_bookshelf));
};
