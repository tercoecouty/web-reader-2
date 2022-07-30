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
    indent: number;
    lineSpacing: number;
    fontSize: number;
    fontFamily: string;
    pagePadding: string;
}

const initialState: IBookState = {
    pageNumber: 1,
    pages: [],
    pageLoading: true,
    selection: null,
    currentNoteId: null,
    twoPage: true,
    canNextPage: true,
    indent: 2,
    lineSpacing: 6,
    fontSize: 16,
    fontFamily: "Georgia, Arial",
    pagePadding: "0 24px",
};

const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        setPageNumber: (state, actions: PayloadAction<number>) => {
            const totalPage = state.pages.length;
            const lastPageNumber = state.pageNumber;
            let pageNumber = actions.payload;

            if (totalPage === 0) return;

            if (pageNumber < 1) pageNumber = 1;
            else if (pageNumber > totalPage) pageNumber = totalPage;

            if (state.twoPage && totalPage % 2 === 0) {
                state.canNextPage = pageNumber !== totalPage - 1;
            } else {
                state.canNextPage = pageNumber !== totalPage;
            }

            if (pageNumber === lastPageNumber) return;
            if (state.twoPage) {
                if (lastPageNumber % 2 === 1 && pageNumber === lastPageNumber + 1) return;
                if (lastPageNumber % 2 === 0 && pageNumber === lastPageNumber - 1) return;
                if (pageNumber % 2 === 0) pageNumber -= 1;
            }

            state.pageNumber = pageNumber;
            state.currentNoteId = null;
            state.selection = null;
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
        setIndent: (state, actions: PayloadAction<number>) => {
            state.indent = actions.payload;
        },
        setLineSpacing: (state, actions: PayloadAction<number>) => {
            state.lineSpacing = actions.payload;
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
export const selectIndent = (state: RootState) => state.book.indent;
export const selectLineSpacing = (state: RootState) => state.book.lineSpacing;
export const selectFontSize = (state: RootState) => state.book.fontSize;
export const selectFontFamily = (state: RootState) => state.book.fontFamily;
export const selectPagePadding = (state: RootState) => state.book.pagePadding;
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
    const lastPageNumber = getState().book.pageNumber;
    let pageNumber = getState().book.twoPage ? lastPageNumber + 2 : lastPageNumber + 1;
    dispatch(bookSlice.actions.setPageNumber(pageNumber));
    api.setLastRead(pageNumber);
};
export const prevPage = async (dispatch: Dispatch, getState: () => RootState) => {
    const lastPageNumber = getState().book.pageNumber;
    let pageNumber = getState().book.twoPage ? lastPageNumber - 2 : lastPageNumber - 1;
    dispatch(bookSlice.actions.setPageNumber(pageNumber));
    api.setLastRead(pageNumber);
};
