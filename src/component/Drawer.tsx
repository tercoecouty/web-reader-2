import { useEffect, useState, useMemo } from "react";
import classNames from "classnames";
import "./Drawer.less";

interface IDrawerProps {
    visible: Boolean;
    children: JSX.Element;
    title: string;
    position: "right" | "left";
    header?: boolean;
    width?: string;
    onClose: () => void;
}

export default function Drawer(props: IDrawerProps) {
    const { visible, position, onClose } = props;
    const width = props.width || "400px";
    const showHeader = props.header === false ? false : true;
    const [show, setShow] = useState(false);
    const [_visible, _setVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            _setVisible(true);
            requestAnimationFrame(() => setShow(true));
        } else {
            setShow(false);
        }
    }, [visible]);

    const handleTransEnd = (e) => {
        if (!show && e.propertyName === "transform") {
            onClose();
            _setVisible(false);
        }
    };

    const className = classNames("drawer-container", {
        left: position === "left",
        right: position === "right",
    });

    const Children = useMemo(() => props.children, []);

    return (
        <div className={classNames("drawer", { show, visible: _visible })} onTransitionEnd={handleTransEnd}>
            <div className="drawer-background" onClick={() => setShow(false)}></div>
            <div className={className} style={{ width }}>
                {showHeader && (
                    <div className="drawer-header">
                        <div>{props.title}</div>
                    </div>
                )}
                <div>{Children}</div>
            </div>
        </div>
    );
}
