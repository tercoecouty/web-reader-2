import { useSelector, useDispatch } from "react-redux";
import "./NoteV2.less";

import { selectCurrentNoteId } from "../slice/bookSlice";
import { selectNotes, updateNote } from "../slice/noteSlice";
import { selectLoginUser } from "../slice/appSlice";

export default function NoteV2() {
    const dispatch = useDispatch();
    const currentNoteId = useSelector(selectCurrentNoteId);
    const notes = useSelector(selectNotes);
    const loginUser = useSelector(selectLoginUser);

    return <div>Note</div>;
}
