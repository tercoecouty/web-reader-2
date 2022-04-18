import React from "react";
import "./Drawer.less";

interface IDrawerProps {
    visible: Boolean;
    children: JSX.Element;
    onClose?: () => void;
    title: string;
    position: "right" | "left";
}

export default function Drawer(props: IDrawerProps) {
    if (!props.visible) return null;

    const handleClick = (e) => {
        if (e.target.closest(".drawer-container")) return;
        if (props.onClose) props.onClose();
    };

    let style: React.CSSProperties = {};
    if (props.position === "left") style = { left: 0 };
    else if (props.position === "right") style = { right: 0 };

    return (
        <div className="drawer" onClick={handleClick}>
            <div className="drawer-container" style={style}>
                <div className="drawer-header">
                    <div>{props.title}</div>
                </div>
                <div style={{ padding: "12px" }}>{props.children}</div>
            </div>
        </div>
    );
}
