import "./UserInfo.less";

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
            <div className="user-info-avatar">{props.name[0]}</div>
            <div>
                <div style={{ marginBottom: "4px" }}>{props.name}</div>
                <div style={{ color: "gray", fontSize: "12px" }}>{getDateTimeText(props.dateTime)}</div>
            </div>
        </div>
    );
}
