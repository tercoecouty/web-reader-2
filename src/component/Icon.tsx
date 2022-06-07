import { useRef, useEffect } from "react";
import "./Icon.less";

interface IIconProps {
    svg: string;
}

export default function Icon(props: IIconProps) {
    const ref = useRef(null);

    // 这里每次都要执行，否则 svg 不会改变
    useEffect(() => {
        ref.current.innerHTML = props.svg;
    });

    return <span ref={ref} className="icon"></span>;
}
