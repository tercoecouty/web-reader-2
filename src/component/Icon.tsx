import React, { useRef, useEffect } from "react";
import "./Icon.less";

interface IIconProps {
    svg: string;
}

export default function Icon(props: IIconProps) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current.innerHTML = props.svg;
    }, []);

    return <span ref={ref} className="icon"></span>;
}
