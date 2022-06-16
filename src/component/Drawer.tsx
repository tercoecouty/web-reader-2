import { useEffect, useState } from "react";
import classNames from "classnames";
import "./Drawer.less";

interface IDrawerProps {
    visible: Boolean;
    children: JSX.Element;
    onClose?: () => void;
    title: string;
    position: "right" | "left";
}

export default function Drawer(props: IDrawerProps) {
    const { visible, position } = props;
    const [drawerStyle, setDrawStyle] = useState<React.CSSProperties>({});
    const [drawContainerStyle, setDrawContainerStyle] = useState<React.CSSProperties>({});

    const handleClick = (e) => {
        if (e.target.closest(".drawer-container")) return;
        if (props.onClose) props.onClose();
    };

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                setDrawStyle({ backgroundColor: `rgba(0, 0, 0, 0.4)`, visibility: "visible" });
                setDrawContainerStyle({ transform: "translate(0, 0)" });
            }, 50); // 如果设为0，可能会没有进入动画
        } else {
            setDrawStyle({ visibility: "visible" });
            setDrawContainerStyle({});
            setTimeout(() => setDrawStyle({}), 300);
        }
    }, [visible]);

    const className = classNames("drawer-container", {
        left: position === "left",
        right: position === "right",
    });

    return (
        <div className="drawer" style={drawerStyle} onClick={handleClick}>
            <div className={className} style={drawContainerStyle}>
                <div className="drawer-header">
                    <div>{props.title}</div>
                </div>
                <div>{props.children}</div>
            </div>
        </div>
    );
}
