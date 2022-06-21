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
    const [drawContainerStyle, setDrawContainerStyle] = useState<React.CSSProperties>({});
    const [downTarget, setDownTarget] = useState(null);

    const handleMouseDown = (e) => {
        if (e.target.closest(".drawer-container")) setDownTarget(2);
        else setDownTarget(1);
    };

    const handleMouseUp = (e) => {
        if (e.target.closest(".drawer-container")) return;
        if (downTarget === 2) return;
        props?.onClose();
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
        <div className="drawer" style={drawerStyle} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
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
