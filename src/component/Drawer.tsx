import { useEffect, useState } from "react";
import classNames from "classnames";
import "./Drawer.less";

interface IDrawerProps {
    visible: Boolean;
    children: JSX.Element;
    title: string;
    position: "right" | "left";
    header?: boolean;
    onClose: () => void;
}

export default function Drawer(props: IDrawerProps) {
    const { visible, position, onClose } = props;
    const showHeader = props.header === false ? false : true;
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (visible) {
            requestAnimationFrame(() => setShow(true));
        }
    }, [visible]);

    const handleTransEnd = (e) => {
        if (!show && e.propertyName === "transform") onClose();
    };

    const className = classNames("drawer-container", {
        left: position === "left",
        right: position === "right",
    });

    return (
        <div className={classNames("drawer", { show, visible })} onTransitionEnd={handleTransEnd}>
            <div className="drawer-background" onClick={() => setShow(false)}></div>
            <div className={className}>
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
