import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import "./Note.less";

import { selectCurrentNoteId } from "../../slice/bookSlice";
import { selectNotes, updateNote, noteActions } from "../../slice/noteSlice";
import { selectLoginUser } from "../../slice/appSlice";
import { selectComments, commentActions } from "../../slice/commentSlice";
import { selectLikes, likeActions } from "../../slice/likeSlice";
import api from "../../api/Api";

import NoteUser from "./NoteUser";
import NoteEdit from "./NoteEdit";

import Icon from "../../component/Icon";
import CommentSvg from "../../svg/comment.svg?raw";
import LikeSvg from "../../svg/like.svg?raw";
import LikeFilledSvg from "../../svg/like-filled.svg?raw";
import EditSvg from "../../svg/edit.svg?raw";
import DeleteSvg from "../../svg/delete.svg?raw";

export default function NoteV2() {
    const dispatch = useDispatch();
    const currentNoteId = useSelector(selectCurrentNoteId);
    const notes = useSelector(selectNotes);
    const loginUser = useSelector(selectLoginUser);

    const [commentsLoading, setCommentsLoading] = useState(true);
    const [likesLoading, setLikesLoading] = useState(true);
    const [list, setList] = useState<"comments" | "likes">("comments");
    const [showEdit, setShowEdit] = useState(false);
    const [editType, setEditType] = useState<"editNote" | "addComment">("editNote");
    const [editHeaderText, setEditHeaderText] = useState("");
    const [editInitialText, setEditInitialText] = useState("");
    const [toUserId, setToUserId] = useState<number>(null);
    const [toUserName, setToUserName] = useState<string>(null);

    const note = notes.find((item) => item.id === currentNoteId);
    const comments = useSelector(selectComments).filter((item) => item.noteId === currentNoteId);
    const likes = useSelector(selectLikes).filter((item) => item.noteId === currentNoteId);
    const liked = likes.find((item) => item.userId === loginUser.id);

    const like = async (noteId: number) => {
        const _like = await api.addLike(noteId);
        dispatch(likeActions.addLike(_like));
    };

    const unlike = async (likeId: number) => {
        await api.deleteLike(likeId);
        dispatch(likeActions.deleteLike(likeId));
    };

    const editNote = () => {
        setEditType("editNote");
        setEditHeaderText("修改笔记");
        setEditInitialText(note.content);
        setShowEdit(true);
    };

    const addComment = () => {
        setEditType("addComment");
        setEditHeaderText("添加评论");
        setToUserId(null);
        setToUserName(null);
        setEditInitialText("");
        setShowEdit(true);
    };

    const handleSubmit = async (text: string, files: File[]) => {
        if (editType === "editNote") {
            await api.setNoteContent(currentNoteId, text);
            dispatch(noteActions.updateNote({ noteId: currentNoteId, content: text }));
        } else if (editType === "addComment") {
            const _comment = await api.addComment(currentNoteId, toUserId, toUserName, text);
            dispatch(commentActions.addComment(_comment));
        }
    };

    const deleteNoteContent = async () => {
        await api.setNoteContent(currentNoteId, "");
        dispatch(noteActions.updateNote({ noteId: currentNoteId, content: "" }));
    };

    useEffect(() => {
        setTimeout(async () => {
            const _likes = await api.getLikes(currentNoteId);
            const _comments = await api.getComments(currentNoteId);
            setLikesLoading(false);
            setCommentsLoading(false);
            dispatch(likeActions.setLikes(_likes));
            dispatch(commentActions.setComments(_comments));
        }, 0);
    }, []);

    const renderComments = () => {
        if (commentsLoading) {
            return <div className="empty-list">加载中……</div>;
        }

        if (comments.length === 0) {
            return <div className="empty-list">没有评论</div>;
        }

        return comments.map((item) => {
            return (
                <div className="list-item" key={item.id}>
                    <div>
                        <NoteUser
                            name={`${item.fromUserName}${item.toUserId ? " 回复 " + item.toUserName : ""}`}
                            dateTime={item.dateTime}
                        />
                    </div>
                    <div className="comment-content">{item.content}</div>
                </div>
            );
        });
    };

    const renderLikes = () => {
        if (likesLoading) {
            return <div className="empty-list">加载中……</div>;
        }

        if (likes.length === 0) {
            return <div className="empty-list">没有点赞</div>;
        }

        return likes.map((item) => {
            return (
                <div className="list-item" key={item.id}>
                    <NoteUser name={item.userName} dateTime={item.dateTime} />
                </div>
            );
        });
    };

    if (!note) return null;

    return (
        <React.Fragment>
            <div className="note">
                <NoteUser name={note.userName} dateTime={note.dateTime} />
                <div className="note-text">{note.text}</div>
                <div className="note-content">{note.content}</div>
                <div className="note-buttons">
                    <div>
                        <Icon onClick={addComment} svg={CommentSvg} />
                        {liked ? (
                            <Icon onClick={() => unlike(liked.id)} svg={LikeFilledSvg} />
                        ) : (
                            <Icon onClick={() => like(currentNoteId)} svg={LikeSvg} />
                        )}
                    </div>
                    <div>
                        <Icon onClick={editNote} svg={EditSvg} />
                        <Icon onClick={deleteNoteContent} svg={DeleteSvg} />
                    </div>
                </div>
                <div className="list-header">
                    <div className={classNames({ selected: list === "comments" })} onClick={() => setList("comments")}>
                        评论（{comments.length}）
                    </div>
                    <div className={classNames({ selected: list === "likes" })} onClick={() => setList("likes")}>
                        点赞（{likes.length}）
                    </div>
                </div>
                <div className={classNames("list-container", list)}>
                    <div className="list">{renderComments()}</div>
                    <div className="list">{renderLikes()}</div>
                </div>
            </div>
            {showEdit && (
                <NoteEdit
                    initialText={editInitialText}
                    headerText={editHeaderText}
                    onClose={() => setShowEdit(false)}
                    onSubmit={handleSubmit}
                />
            )}
        </React.Fragment>
    );
}
