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
    const [show, setShow] = useState(false);
    const [drawerStyle, setDrawStyle] = useState<React.CSSProperties>({});
    const [drawContainerStyle, setDrawContainerStyle] = useState<React.CSSProperties>({});

    const handleClick = (e) => {
        if (e.target.closest(".drawer-container")) return;
        if (props.onClose) props.onClose();
    };

    useEffect(() => {
        if (visible) {
            setShow(true);
            setTimeout(() => setDrawStyle({ backgroundColor: `rgba(0, 0, 0, 0.4)` }), 0);
            setTimeout(() => {
                if (position === "left") setDrawContainerStyle({ transform: "translate(400px, 0)" });
                else setDrawContainerStyle({ transform: "translate(-400px, 0)" });
            }, 0);
        } else {
            setTimeout(() => setShow(false), 200);
            setDrawStyle({});
            setDrawContainerStyle({});
        }
    }, [visible]);

    if (!show) return null;

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
                <div style={{ padding: "12px" }}>{props.children}</div>
            </div>
        </div>
    );
}
