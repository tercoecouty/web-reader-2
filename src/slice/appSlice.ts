import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IAppState {
    notesUser: IUser;
    loginUser: IUser;
}

const initialState: IAppState = {
    notesUser: null,
    loginUser: null,
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
    },
});

export default appSlice.reducer;
export const appActions = appSlice.actions;
export const selectNotesUser = (state: RootState) => state.app.notesUser;
export const selectLoginUser = (state: RootState) => state.app.loginUser;
