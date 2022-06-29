import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import "./Note.less";

import { selectCurrentNoteId } from "../../slice/bookSlice";
import { selectNotes, updateNote } from "../../slice/noteSlice";
import { selectLoginUser, selectNotesUser, selectShowNoteInfo } from "../../slice/appSlice";
import { selectComments, commentActions, addComment, deleteComment } from "../../slice/commentSlice";
import { selectLikes, likeActions, like, unlike } from "../../slice/likeSlice";
import api from "../../api/Api";

import NoteUser from "./NoteUser";
import NoteEdit from "./NoteEdit";
import NoteImages from "./NoteImages";

import Icon from "../../component/Icon";
import CommentSvg from "../../svg/comment.svg?raw";
import LikeSvg from "../../svg/like.svg?raw";
import LikeFilledSvg from "../../svg/like-filled.svg?raw";
import EditSvg from "../../svg/edit.svg?raw";
import DeleteSvg from "../../svg/delete.svg?raw";

export default function Note() {
    const dispatch = useDispatch();
    const currentNoteId = useSelector(selectCurrentNoteId);
    const notes = useSelector(selectNotes);
    const loginUser = useSelector(selectLoginUser);
    const notesUser = useSelector(selectNotesUser);
    const showNoteInfo = useSelector(selectShowNoteInfo);

    const [commentsLoading, setCommentsLoading] = useState(true);
    const [likesLoading, setLikesLoading] = useState(true);
    const [list, setList] = useState<"comments" | "likes">("comments");
    const [showEdit, setShowEdit] = useState(false);
    const [editType, setEditType] = useState<"editNote" | "addComment">("editNote");
    const [editHeaderText, setEditHeaderText] = useState("");
    const [editInitialText, setEditInitialText] = useState("");
    const [toUserId, setToUserId] = useState<number>(null);
    const [toUserName, setToUserName] = useState<string>(null);
    const [editImagesUrls, setEditImageUrls] = useState<string[]>([]);

    const note = notes.find((item) => item.id === currentNoteId);
    const comments = useSelector(selectComments).filter((item) => item.noteId === currentNoteId);
    const likes = useSelector(selectLikes).filter((item) => item.noteId === currentNoteId);
    const liked = likes.find((item) => item.userId === loginUser.id);

    const editNote = () => {
        setEditType("editNote");
        setEditHeaderText("修改笔记");
        setEditInitialText(note.content);
        setEditImageUrls(note.imageUrls);
        setShowEdit(true);
    };

    const handleAddComment = () => {
        setEditType("addComment");
        setEditHeaderText("添加评论");
        setToUserId(null);
        setToUserName(null);
        setEditInitialText("");
        setEditImageUrls([]);
        setShowEdit(true);
    };

    const handleReplyComment = (fromUserId: number, fromUserName: string) => {
        setToUserId(fromUserId);
        setToUserName(fromUserName);
        setEditType("addComment");
        setEditInitialText("");
        setEditImageUrls([]);
        setEditHeaderText("回复" + fromUserName);
        setShowEdit(true);
    };

    const handleSubmit = async (text: string, files: File[]) => {
        if (editType === "editNote") {
            dispatch(updateNote(currentNoteId, text, files));
        } else if (editType === "addComment") {
            dispatch(addComment(currentNoteId, toUserId, toUserName, text, files));
        }
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

    useEffect(() => {
        if (!showNoteInfo) {
            setShowEdit(false);
            setList("comments");
        }
    }, [showNoteInfo]);

    const renderNoteContent = () => {
        return note.content.split("\n").map((text, index) => {
            return <div key={index}>{text}</div>;
        });
    };

    const renderComments = () => {
        if (commentsLoading) {
            return <div className="empty-list">加载中……</div>;
        }

        if (comments.length === 0) {
            return <div className="empty-list">没有评论</div>;
        }

        return comments.map((comment) => {
            return (
                <div className="list-item" key={comment.id}>
                    <div className="comment-header">
                        <NoteUser
                            name={`${comment.fromUserName}${comment.toUserId ? " 回复 " + comment.toUserName : ""}`}
                            dateTime={comment.dateTime}
                        />
                        <div className="comment-buttons">
                            <Icon
                                svg={CommentSvg}
                                onClick={() => handleReplyComment(comment.fromUserId, comment.fromUserName)}
                            />
                            <Icon svg={DeleteSvg} onClick={() => dispatch(deleteComment(comment.id))} />
                        </div>
                    </div>
                    {comment.content && <div className="comment-content">{comment.content}</div>}
                    {comment.imageUrls.length !== 0 && <NoteImages urls={comment.imageUrls} />}
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
        <div className="overflow-container">
            <div className="note">
                <NoteUser name={note.userName} dateTime={note.dateTime} />
                <div className="note-text">{note.text}</div>
                {note.content && <div className="note-content">{renderNoteContent()}</div>}
                {note.imageUrls.length !== 0 && <NoteImages urls={note.imageUrls} />}
                <div className="note-buttons">
                    <div>
                        <Icon svg={CommentSvg} onClick={handleAddComment} />
                        {liked ? (
                            <Icon svg={LikeFilledSvg} onClick={() => dispatch(unlike(liked.id))} />
                        ) : (
                            <Icon svg={LikeSvg} onClick={() => dispatch(like(currentNoteId))} />
                        )}
                    </div>
                    {notesUser.id === loginUser.id && (
                        <div>
                            <Icon svg={EditSvg} onClick={editNote} />
                            <Icon
                                svg={DeleteSvg}
                                disabled={note.content === "" && note.imageUrls.length === 0}
                                onClick={() => dispatch(updateNote(currentNoteId, "", []))}
                            />
                        </div>
                    )}
                </div>
                <div className="list-header">
                    <div className={classNames({ selected: list === "comments" })} onClick={() => setList("comments")}>
                        评论（{comments.length}）
                    </div>
                    <div className={classNames({ selected: list === "likes" })} onClick={() => setList("likes")}>
                        点赞（{likes.length}）
                    </div>
                </div>
                <div className="overflow-container">
                    <div className={classNames("list-container", list)}>
                        <div className="list">{renderComments()}</div>
                        <div className="list">{renderLikes()}</div>
                    </div>
                </div>
            </div>
            {showEdit && (
                <NoteEdit
                    initialText={editInitialText}
                    headerText={editHeaderText}
                    imagesUrls={editImagesUrls}
                    onClose={() => setShowEdit(false)}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}
