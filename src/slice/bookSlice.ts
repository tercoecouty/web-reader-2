import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "../api/Api";

interface IBookState {
    pageNumber: number;
    pages: IPage[];
    pageLoading: boolean;
    selection: ISelection;
    currentNoteId: number;
    twoPage: boolean;
    canNextPage: boolean;
}

const initialState: IBookState = {
    pageNumber: 1,
    pages: [],
    pageLoading: true,
    selection: null,
    currentNoteId: null,
    twoPage: true,
    canNextPage: true,
};

function disableNextPage(pageNumber: number, totalPage: number, twoPage: boolean) {
    if (twoPage) {
        if (totalPage % 2 === 0) {
            return pageNumber === totalPage - 1;
        } else {
            return pageNumber === totalPage;
        }
    } else {
        return pageNumber === totalPage;
    }
}

const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        setPageNumber: (state, actions: PayloadAction<number>) => {
            let pageNumber = actions.payload;
            if (state.twoPage) {
                if (state.pageNumber % 2 === 1 && pageNumber === state.pageNumber + 1) return;
                if (state.pageNumber % 2 === 0 && pageNumber === state.pageNumber - 1) return;
                if (pageNumber % 2 == 0) pageNumber -= 1;
            }

            state.pageNumber = pageNumber;
            state.currentNoteId = null;
            state.selection = null;
            state.canNextPage = !disableNextPage(state.pageNumber, state.pages.length, state.twoPage);
        },
        setPages: (state, actions: PayloadAction<IPage[]>) => {
            state.pages = actions.payload;
            if (state.pageNumber > state.pages.length) state.pageNumber = 1;
        },
        setPageLoading: (state, actions: PayloadAction<boolean>) => {
            state.pageLoading = actions.payload;
        },
        setSelection: (state, actions: PayloadAction<ISelection>) => {
            state.selection = actions.payload;
        },
        setCurrentNoteId: (state, actions: PayloadAction<number>) => {
            state.currentNoteId = actions.payload;
        },
        setTwoPage: (state, actions: PayloadAction<boolean>) => {
            state.twoPage = actions.payload;
        },
    },
});

export default bookSlice.reducer;
export const bookActions = bookSlice.actions;
export const selectSelection = (state: RootState) => state.book.selection;
export const selectPages = (state: RootState) => state.book.pages;
export const selectPageNumber = (state: RootState) => state.book.pageNumber;
export const selectPageLoading = (state: RootState) => state.book.pageLoading;
export const selectCurrentNoteId = (state: RootState) => state.book.currentNoteId;
export const selectTwoPage = (state: RootState) => state.book.twoPage;
export const selectCanNextPage = (state: RootState) => state.book.canNextPage;
export const selectCurrentNoteIdByLine = (state, line: ILine) => {
    const currentNoteId = state.book.currentNoteId;
    if (currentNoteId === null) return null;

    const notes = state.note.notes;
    const firstCharId = line.firstCharId;
    const lastCharId = line.firstCharId + line.text.length - 1;
    let notesByLine = notes.filter((note) => {
        if (note.lastCharId < firstCharId || note.firstCharId > lastCharId) return false;
        return true;
    });

    for (const note of notesByLine) {
        if (note.id === currentNoteId) {
            return currentNoteId;
        }
    }

    return null;
};
export const nextPage = async (dispatch: Dispatch, getState: () => RootState) => {
    if (!getState().book.canNextPage) return;

    let newPageNumber;
    if (getState().book.twoPage) newPageNumber = getState().book.pageNumber + 2;
    else newPageNumber = getState().book.pageNumber + 1;

    dispatch(bookSlice.actions.setPageNumber(newPageNumber));
    api.setLastRead(newPageNumber);
};
export const prevPage = async (dispatch: Dispatch, getState: () => RootState) => {
    if (getState().book.pageNumber === 1) return;

    let newPageNumber;
    if (getState().book.twoPage) newPageNumber = getState().book.pageNumber - 2;
    else newPageNumber = getState().book.pageNumber - 1;

    dispatch(bookSlice.actions.setPageNumber(newPageNumber));
    api.setLastRead(newPageNumber);
};
