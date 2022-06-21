import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "../api/Api";

interface ICommentState {
    comments: IComment[];
}

const initialState: ICommentState = {
    comments: [],
};

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        addComment: (state, actions: PayloadAction<IComment>) => {
            state.comments.push(actions.payload);
        },
        deleteComment: (state, actions: PayloadAction<number>) => {
            const commentId = actions.payload;
            state.comments = state.comments.filter((item) => item.id !== commentId);
        },
        setComments: (state, actions: PayloadAction<IComment[]>) => {
            state.comments = actions.payload;
        },
        updateComment: (state, actions: PayloadAction<{ commentId: number; content: string }>) => {
            const { commentId, content } = actions.payload;
            state.comments = state.comments.map((item) => {
                if (item.id === commentId) {
                    return {
                        ...item,
                        content,
                    };
                } else {
                    return item;
                }
            });
        },
    },
});

export default commentSlice.reducer;
export const commentActions = commentSlice.actions;
export const selectComments = (state: RootState) => state.comment.comments;
export const addComment = (noteId: number, toUserId: number, toUserName: string, content: string, files: File[]) => {
    return async (dispatch: Dispatch) => {
        const _comment = await api.addComment(noteId, toUserId, toUserName, content, files);
        dispatch(commentSlice.actions.addComment(_comment));
    };
};
export const deleteComment = (commentId: number) => async (dispatch: Dispatch) => {
    await api.deleteComment(commentId);
    dispatch(commentSlice.actions.deleteComment(commentId));
};
export const fetchComments = (noteId: number) => async (dispatch: Dispatch, getState: () => RootState) => {
    const _comments = await api.getComments(noteId);
    dispatch(commentSlice.actions.setComments(_comments));
};
