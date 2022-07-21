import { useRef, useEffect } from "react";
import classNames from "classnames";
import "./Icon.less";

interface IIconProps {
    svg: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function Icon(props: IIconProps) {
    const ref = useRef(null);
    const { svg, onClick, disabled } = props;

    useEffect(() => {
        ref.current.innerHTML = svg;
    }, [svg]);

    const handleClick = () => {
        if (!disabled && onClick) onClick();
    };

    return <span onClick={handleClick} ref={ref} className={classNames("icon", { disabled })}></span>;
}
