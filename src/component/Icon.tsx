import { useRef, useEffect } from "react";
import classNames from "classnames";
import "./Icon.less";

interface IIconProps {
    svg: string;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function Icon(props: IIconProps) {
    const ref = useRef(null);
    const { className, svg, onClick, disabled } = props;

    // 这里每次都要执行，否则 svg 不会改变
    useEffect(() => {
        ref.current.innerHTML = svg;
    }, [svg]);

    const handleClick = () => {
        if (!disabled && onClick) onClick();
    };

    return <span onClick={handleClick} ref={ref} className={classNames("icon", className, { disabled })}></span>;
}
