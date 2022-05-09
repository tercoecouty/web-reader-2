import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Note.less";

import Button from "../component/Button/Button";

import UserInfo from "../component/UserInfo/UserInfo";
import { selectCurrentNoteId } from "../slice/bookSlice";
import { selectNotes, updateNote } from "../slice/noteSlice";
import { selectComments, addComment, deleteComment, fetchComments } from "../slice/commentSlice";
import { selectLikes, like, unlike, fetchLikes } from "../slice/likeSlice";
import { selectLoginUser } from "../slice/appSlice";

type EditType = "editNote" | "addComment" | "replyComment";

export default function Note() {
    const dispatch = useDispatch();
    const notes = useSelector(selectNotes);
    const currentNoteId = useSelector(selectCurrentNoteId);
    const loginUser = useSelector(selectLoginUser);

    const note = notes.find((item) => item.id === currentNoteId);
    if (!note) return null;

    const [edit, setEdit] = useState(false);
    const [editType, setEditType] = useState<EditType>("editNote");
    const [editValue, setEditValue] = useState("");
    const [listType, setListType] = useState<"comment" | "like">("comment");
    const [toUserId, setToUserId] = useState<number>(null);
    const [toUserName, setToUserName] = useState<string>(null);

    const comments = useSelector(selectComments).filter((item) => item.noteId === currentNoteId);
    const likes = useSelector(selectLikes).filter((item) => item.noteId === currentNoteId);

    useEffect(() => {
        dispatch(fetchLikes(currentNoteId));
        dispatch(fetchComments(currentNoteId));
    }, []);

    const hasLike = likes.find((item) => item.userId === loginUser.id);

    const showEdit = (type: EditType) => {
        setEditType(type);
        if (type === "editNote") setEditValue(note.content);
        else setEditValue("");
        setEdit(true);
    };

    const editCommit = () => {
        if (editType === "editNote") {
            dispatch(updateNote(currentNoteId, editValue));
        } else if (editType === "addComment") {
            dispatch(addComment(currentNoteId, null, null, editValue));
        } else if (editType === "replyComment") {
            dispatch(addComment(currentNoteId, toUserId, toUserName, editValue));
        }
        setEdit(false);
    };

    const renderComments = () => {
        if (comments.length === 0) {
            return <div className="empty-list">没有评论</div>;
        }

        return comments.map((item) => {
            return (
                <div className="comment-item" key={item.id}>
                    <div className="header">
                        <UserInfo
                            name={`${item.fromUserName}${item.toUserId ? " 回复 " + item.toUserName : ""}`}
                            dateTime={note.dateTime}
                        />
                        <div className="buttons">
                            <Button
                                onClick={() => {
                                    setToUserId(item.fromUserId);
                                    setToUserName(item.fromUserName);
                                    showEdit("replyComment");
                                }}
                            >
                                回复
                            </Button>
                            {item.fromUserId === loginUser.id && (
                                <Button onClick={() => dispatch(deleteComment(item.id))} danger>
                                    删除评论
                                </Button>
                            )}
                        </div>
                    </div>
                    <div>{item.content}</div>
                </div>
            );
        });
    };

    const renderLikes = () => {
        if (likes.length === 0) {
            return <div className="empty-list">没有点赞</div>;
        }

        return likes.map((item) => {
            return (
                <div className="likeItem" key={item.id}>
                    <UserInfo name={item.userName} dateTime={item.dateTime} />
                </div>
            );
        });
    };

    if (edit) {
        return (
            <div className="note-edit">
                <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)}></textarea>
                <div>
                    <div style={{ fontSize: "14px" }}>{editValue.length} / 120</div>
                    <div>
                        <Button onClick={() => setEdit(false)}>返回</Button>
                        <Button disabled={editValue === "" || editValue.length > 120} onClick={editCommit}>
                            {note.userId === loginUser.id && editType === "editNote" && note.content && "修改笔记"}
                            {note.userId === loginUser.id && editType === "editNote" && !note.content && "添加笔记"}
                            {editType === "addComment" && "添加评论"}
                            {editType === "replyComment" && "回复"}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="note">
            <UserInfo name={note.userName} dateTime={note.dateTime} />
            <div className="note-text">{note.text}</div>
            {note.content && <div style={{ fontSize: "14px", marginBottom: "8px" }}>{note.content}</div>}
            <div className="note-buttons">
                <div>
                    <Button onClick={() => showEdit("addComment")}>添加评论</Button>
                    {hasLike && <Button onClick={() => dispatch(unlike(hasLike.id))}>取消点赞</Button>}
                    {!hasLike && <Button onClick={() => dispatch(like(currentNoteId))}>点赞</Button>}
                </div>
                <div>
                    {note.userId === loginUser.id && note.content && (
                        <Button onClick={() => dispatch(updateNote(currentNoteId, ""))} danger>
                            删除笔记
                        </Button>
                    )}
                    {note.userId === loginUser.id && (
                        <Button onClick={() => showEdit("editNote")}>{note.content ? "修改笔记" : "添加笔记"}</Button>
                    )}
                </div>
            </div>
            <div className="list-header">
                <div className={listType === "comment" ? "selected" : ""} onClick={() => setListType("comment")}>
                    评论（{comments.length}）
                </div>
                <div className={listType === "like" ? "selected" : ""} onClick={() => setListType("like")}>
                    点赞（{likes.length}）
                </div>
            </div>
            {listType === "comment" && <div>{renderComments()}</div>}
            {listType === "like" && <div>{renderLikes()}</div>}
        </div>
    );
}
