import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "../api/Api";

interface ILikeState {
    likes: ILike[];
}

const initialState: ILikeState = {
    likes: [],
};

const likeSlice = createSlice({
    name: "like",
    initialState,
    reducers: {
        addLike: (state, actions: PayloadAction<ILike>) => {
            state.likes.push(actions.payload);
        },
        setLikes: (state, actions: PayloadAction<ILike[]>) => {
            state.likes = actions.payload;
        },
        deleteLike: (state, actions: PayloadAction<number>) => {
            const likeId = actions.payload;
            state.likes = state.likes.filter((item) => item.id !== likeId);
        },
    },
});

export default likeSlice.reducer;
export const likeActions = likeSlice.actions;
export const selectLikes = (state: RootState) => state.like.likes;
export const like = (noteId: number) => async (dispatch: Dispatch) => {
    const _like = await api.addLike(noteId);
    dispatch(likeSlice.actions.addLike(_like));
};
export const unlike = (likeId: number) => async (dispatch: Dispatch) => {
    await api.deleteLike(likeId);
    dispatch(likeSlice.actions.deleteLike(likeId));
};
export const fetchLikes = (noteId: number) => async (dispatch: Dispatch, getState: () => RootState) => {
    const _likes = await api.getLikes(noteId);
    dispatch(likeSlice.actions.setLikes(_likes));
};
