import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IAppState {
    notesUser: IUser;
    loginUser: IUser;
    showClasses: boolean;
    showBookmarks: boolean;
    showNotes: boolean;
    showNoteInfo: boolean;
    fullscreen: boolean;
}

const initialState: IAppState = {
    notesUser: null,
    loginUser: null,
    showClasses: false,
    showBookmarks: false,
    showNotes: false,
    showNoteInfo: false,
    fullscreen: false,
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
        },
        setShowBookmarks: (state, actions: PayloadAction<boolean>) => {
            state.showBookmarks = actions.payload;
        },
        setShowNotes: (state, actions: PayloadAction<boolean>) => {
            state.showNotes = actions.payload;
        },
        setShowNoteInfo: (state, actions: PayloadAction<boolean>) => {
            state.showNoteInfo = actions.payload;
        },

        setFullscreen: (state, actions: PayloadAction<boolean>) => {
            state.fullscreen = actions.payload;
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
export const selectShowNoteInfo = (state: RootState) => state.app.showNoteInfo;
export const selectFullscreen = (state: RootState) => state.app.fullscreen;
