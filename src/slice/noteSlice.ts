import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";

import api from "../api/Api";

interface INoteState {
    notes: INote[];
}

const initialState: INoteState = {
    notes: [],
};

const noteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {
        addNote: (state, actions: PayloadAction<INote>) => {
            state.notes.push(actions.payload);
        },
        deleteNote: (state, actions: PayloadAction<number>) => {
            const noteId = actions.payload;
            state.notes = state.notes.filter((note) => note.id !== noteId);
        },
        setNotes: (state, actions: PayloadAction<INote[]>) => {
            state.notes = actions.payload;
        },
        updateNote: (state, actions: PayloadAction<{ noteId: number; content: string; imageUrls: string[] }>) => {
            const { noteId: nodeId, content, imageUrls } = actions.payload;
            state.notes = state.notes.map((item) => {
                if (item.id === nodeId) {
                    return {
                        ...item,
                        content,
                        imageUrls,
                    };
                } else {
                    return item;
                }
            });
        },
    },
});

export default noteSlice.reducer;
export const noteActions = noteSlice.actions;
export const selectNotes = (state: RootState) => state.note.notes;
export const selectNotesByLine = (state, line: ILine) => {
    const notes = state.note.notes as INote[];
    const firstCharId = line.firstCharId;
    const lastCharId = line.firstCharId + line.text.length - 1;
    let notesByLine = notes.filter((note) => {
        if (note.lastCharId < firstCharId || note.firstCharId > lastCharId) return false;
        return true;
    });

    return JSON.stringify(notesByLine);
};

export const addNote = (selection: ISelection) => async (dispatch: Dispatch) => {
    const _note = await api.addNote(selection.firstCharId, selection.lastCharId, selection.text);
    dispatch(noteSlice.actions.addNote(_note));
};
export const deleteNote = (noteId: number) => async (dispatch: Dispatch) => {
    await api.deleteNote(noteId);
    dispatch(noteSlice.actions.deleteNote(noteId));
};
export const updateNote = (noteId: number, content: string, files: File[]) => async (dispatch: Dispatch) => {
    const imageUrls = await api.updateNote(noteId, content, files);
    dispatch(noteSlice.actions.updateNote({ noteId, content, imageUrls }));
};
export const fetchNotes = (userId: number) => async (dispatch: Dispatch, getState: () => RootState) => {
    const _notes = await api.getNotes(userId);
    dispatch(noteSlice.actions.setNotes(_notes));
};
