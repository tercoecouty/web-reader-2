import { useRef, useEffect } from "react";
import classNames from "classnames";
import "./Icon.less";

interface IIconProps {
    svg: string;
    className?: string;
    onClick?: () => void;
}

export default function Icon(props: IIconProps) {
    const ref = useRef(null);
    const { className, svg, onClick } = props;

    // 这里每次都要执行，否则 svg 不会改变
    useEffect(() => {
        ref.current.innerHTML = svg;
    }, [svg]);

    return <span onClick={() => onClick?.()} ref={ref} className={classNames("icon", className)}></span>;
}
