import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./NoteV2.less";

import { selectCurrentNoteId } from "../slice/bookSlice";
import { selectNotes, updateNote } from "../slice/noteSlice";
import { selectLoginUser } from "../slice/appSlice";

import Icon from "../component/Icon";
import CommentSvg from "../svg/comment.svg?raw";
import LikeSvg from "../svg/like.svg?raw";
import LikeFilledSvg from "../svg/like-filled.svg?raw";
import EditSvg from "../svg/edit.svg?raw";
import DeleteSvg from "../svg/delete.svg?raw";

export default function NoteV2() {
    const dispatch = useDispatch();
    const currentNoteId = useSelector(selectCurrentNoteId);
    const notes = useSelector(selectNotes);
    const loginUser = useSelector(selectLoginUser);

    const note = notes.find((item) => item.id === currentNoteId);

    if (!note) return null;

    return (
        <React.Fragment>
            <div className="note">
                <NoteUser name={note.userName} dateTime={note.dateTime} />
                <div className="note-text">{note.text}</div>
                <div className="note-buttons">
                    <div>
                        <Icon svg={CommentSvg} />
                        <Icon svg={LikeSvg} />
                        <Icon svg={LikeFilledSvg} />
                    </div>
                    <div>
                        <Icon svg={EditSvg} />
                        <Icon svg={DeleteSvg} />
                    </div>
                </div>
            </div>
            <div className="note-edit"></div>
        </React.Fragment>
    );
}

interface IUserInfoProps {
    name: string;
    dateTime: number;
}

function NoteUser(props: IUserInfoProps) {
    const relativeTime = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        const MINUTE = 60;
        const HOUR = MINUTE * 60;
        const DAY = HOUR * 24;
        const WEEK = DAY * 7;
        const MONTH = DAY * 30;
        const YEAR = DAY * 365;

        if (seconds < 5) {
            return `刚刚`;
        } else if (5 < seconds && seconds < MINUTE) {
            return `${seconds}秒前`;
        } else if (MINUTE < seconds && seconds < HOUR) {
            return `${Math.floor(seconds / MINUTE)}分钟前`;
        } else if (HOUR < seconds && seconds < DAY) {
            return `${Math.floor(seconds / HOUR)}小时前`;
        } else if (DAY < seconds && seconds < WEEK) {
            return `${Math.floor(seconds / DAY)}天前`;
        } else if (WEEK < seconds && seconds < MONTH) {
            return `${Math.floor(seconds / WEEK)}周前`;
        } else if (MONTH < seconds && seconds < YEAR) {
            return `${Math.floor(seconds / MONTH)}月前`;
        } else {
            return `${Math.floor(seconds / YEAR)}年前`;
        }
    };

    return (
        <div className="note-user">
            <span className="note-user-name">{props.name}</span>
            <span className="note-user-time">{relativeTime(props.dateTime)}</span>
        </div>
    );
}
