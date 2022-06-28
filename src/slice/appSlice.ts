import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ISearchRange {
    firstCharId: number;
    lastCharId: number;
}

interface IAppState {
    notesUser: IUser;
    loginUser: IUser;
    showClasses: boolean;
    showBookmarks: boolean;
    showNotes: boolean;
    showSearch: boolean;
    showSettings: boolean;
    showNoteInfo: boolean;
    disableShortcut: boolean;
    searchRange: ISearchRange;
}

const initialState: IAppState = {
    notesUser: null,
    loginUser: null,
    showClasses: false,
    showBookmarks: false,
    showNotes: false,
    showSearch: false,
    showSettings: false,
    showNoteInfo: false,
    disableShortcut: false,
    searchRange: null,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setNotesUser: (state, actions: PayloadAction<IUser>) => {
            state.notesUser = actions.payload;
        },
        setLoginUser: (state, actions: PayloadAction<IUser>) => {
            state.loginUser = actions.payload;
        },
        setShowClasses: (state, actions: PayloadAction<boolean>) => {
            state.showClasses = actions.payload;
            state.disableShortcut = actions.payload;
        },
        setShowBookmarks: (state, actions: PayloadAction<boolean>) => {
            state.showBookmarks = actions.payload;
            state.disableShortcut = actions.payload;
        },
        setShowNotes: (state, actions: PayloadAction<boolean>) => {
            state.showNotes = actions.payload;
            state.disableShortcut = actions.payload;
        },
        setShowSearch: (state, actions: PayloadAction<boolean>) => {
            state.showSearch = actions.payload;
            state.disableShortcut = actions.payload;
        },
        setShowSettings: (state, actions: PayloadAction<boolean>) => {
            state.showSettings = actions.payload;
            state.disableShortcut = actions.payload;
        },
        setShowNoteInfo: (state, actions: PayloadAction<boolean>) => {
            state.showNoteInfo = actions.payload;
            state.disableShortcut = actions.payload;
        },
        setSearchRange: (state, actions: PayloadAction<ISearchRange>) => {
            state.searchRange = actions.payload;
        },
    },
});

export default appSlice.reducer;
export const appActions = appSlice.actions;
export const selectNotesUser = (state: RootState) => state.app.notesUser;
export const selectLoginUser = (state: RootState) => state.app.loginUser;
export const selectShowClasses = (state: RootState) => state.app.showClasses;
export const selectShowBookmarks = (state: RootState) => state.app.showBookmarks;
export const selectShowNotes = (state: RootState) => state.app.showNotes;
export const selectShowSearch = (state: RootState) => state.app.showSearch;
export const selectShowSettings = (state: RootState) => state.app.showSettings;
export const selectShowNoteInfo = (state: RootState) => state.app.showNoteInfo;
export const selectDisableShortcut = (state: RootState) => state.app.disableShortcut;
export const selectSearchRange = (state: RootState) => state.app.searchRange;
