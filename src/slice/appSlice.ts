import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IAppState {
    notesUser: IUser;
    loginUser: IUser;
    showClasses: boolean;
    showBookmarks: boolean;
}

const initialState: IAppState = {
    notesUser: null,
    loginUser: null,
    showClasses: false,
    showBookmarks: false,
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
    },
});

export default appSlice.reducer;
export const appActions = appSlice.actions;
export const selectNotesUser = (state: RootState) => state.app.notesUser;
export const selectLoginUser = (state: RootState) => state.app.loginUser;
export const selectShowClasses = (state: RootState) => state.app.showClasses;
export const selectShowBookmarks = (state: RootState) => state.app.showBookmarks;
