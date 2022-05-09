import "./UserInfo.less";

import DefaultAvatarImage from "./default-avatar.png";

interface IUserInfoProps {
    name: string;
    dateTime: number;
}

const getDateTimeText = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

export default function UserInfo(props: IUserInfoProps) {
    return (
        <div className="user-info">
            <img className="user-info-avatar" src={DefaultAvatarImage} />
            <div>
                <div style={{ marginBottom: "4px" }}>{props.name}</div>
                <div style={{ color: "gray", fontSize: "12px" }}>{getDateTimeText(props.dateTime)}</div>
            </div>
        </div>
    );
}
