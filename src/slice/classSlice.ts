import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "../api/Api";

interface IClassState {
    classes: IClass[];
    currentClassId: number;
}

const initialState: IClassState = {
    classes: [],
    currentClassId: 1,
};

const classSlice = createSlice({
    name: "class",
    initialState,
    reducers: {
        setClasses: (state, actions: PayloadAction<IClass[]>) => {
            state.classes = actions.payload;
        },
        setCurrentClassId: (state, actions: PayloadAction<number>) => {
            state.currentClassId = actions.payload;
        },
    },
});

export default classSlice.reducer;
export const classActions = classSlice.actions;
export const selectClasses = (state: RootState) => state.class.classes;
export const selectCurrentClassId = (state: RootState) => state.class.currentClassId;
export const fetchClasses = async (dispatch: Dispatch, getState: () => RootState) => {
    const _classes = await api.getClasses();
    dispatch(classSlice.actions.setClasses(_classes));
};
