import { useRef, useEffect } from "react";
import classNames from "classnames";
import "./Icon.less";

interface IIconProps {
    svg: string;
    onClick?: () => void;
    disabled?: boolean;
    position?: "left" | "right" | "top" | "bottom";
    tooltipText?: string;
}

export default function Icon(props: IIconProps) {
    const ref = useRef(null);
    const { svg, onClick, disabled, position, tooltipText } = props;

    useEffect(() => {
        ref.current.innerHTML = svg;
    }, [svg]);

    const handleClick = () => {
        if (!disabled && onClick) onClick();
    };

    return (
        <span onClick={handleClick} className={classNames("icon", { disabled })}>
            <span className="icon-svg" ref={ref}></span>
            {position && (
                <span className={classNames("icon-tooltip", position)}>
                    <span>{tooltipText}</span>
                    <span className="icon-tooltip-arrow"></span>
                </span>
            )}
        </span>
    );
}
