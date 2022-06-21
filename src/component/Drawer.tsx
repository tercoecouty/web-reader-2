import { useEffect, useState } from "react";
import classNames from "classnames";
import "./Drawer.less";

interface IDrawerProps {
    visible: Boolean;
    children: JSX.Element;
    onClose?: () => void;
    title: string;
    position: "right" | "left";
    header?: boolean;
}

export default function Drawer(props: IDrawerProps) {
    const { visible, position } = props;
    const showHeader = props.header === false ? false : true;
    const [drawerStyle, setDrawStyle] = useState<React.CSSProperties>({});
    const [drawerBackgroundStyle, setDrawerBackgroundStyle] = useState<React.CSSProperties>({});
    const [drawContainerStyle, setDrawContainerStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                setDrawStyle({ visibility: "visible" });
                setDrawerBackgroundStyle({ backgroundColor: `rgba(0, 0, 0, 0.4)` });
                setDrawContainerStyle({ transform: "translate(0, 0)" });
            }, 50); // 如果设为0，可能会没有进入动画
        } else {
            setDrawerBackgroundStyle({});
            setDrawContainerStyle({});
            setTimeout(() => setDrawStyle({}), 300);
        }
    }, [visible]);

    const className = classNames("drawer-container", {
        left: position === "left",
        right: position === "right",
    });

    return (
        <div className="drawer" style={drawerStyle}>
            <div className="drawer-background" style={drawerBackgroundStyle} onClick={() => props.onClose?.()}></div>
            <div className={className} style={drawContainerStyle}>
                {showHeader && (
                    <div className="drawer-header">
                        <div>{props.title}</div>
                    </div>
                )}
                <div>{props.children}</div>
            </div>
        </div>
    );
}
