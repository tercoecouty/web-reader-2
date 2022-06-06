import { useState, useEffect, Fragment, createElement, useRef } from "react";
import classNames from "classnames";

import "./Tooltip.less";

interface ITooltipProps {
    children: JSX.Element;
    placement?: "left" | "right" | "top" | "bottom";
    title?: string;
    delay?: number;
    offset?: number;
    defaultVisible?: boolean;
}

export default function Tooltip(props: ITooltipProps) {
    const placement = props.placement || "top";
    const title = props.title || "";
    const defaultVisible = props.defaultVisible || false;
    const delay = props.delay || 100;
    const offset = props.offset || 8;

    const [visible, setVisible] = useState(defaultVisible);
    const [timeoutId, setTimeOutId] = useState(null);
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
    const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
    const targetRef = useRef(null);
    const tooltipRef = useRef(null);
    const domTooltip = useState<HTMLElement>(null);

    const updatePosition = () => {
        const domTarget = targetRef.current as HTMLElement;
        const domTooltip = tooltipRef.current as HTMLElement;
        const targetRect = domTarget.getBoundingClientRect();
        const tooltipRect = domTooltip.getBoundingClientRect();

        const half = 4; // the half of arrow width or height
        let left, top;
        if (placement === "left") {
            left = targetRect.x - tooltipRect.width - offset;
            top = targetRect.y + (targetRect.height - tooltipRect.height) / 2;
            setTooltipStyle({ transform: `translate(${left}px, ${top}px)` });
            left = tooltipRect.width - half;
            top = tooltipRect.height / 2 - half;
            setArrowStyle({ transform: `translate(${left}px, ${top}px) rotate(45deg)` });
        } else if (placement === "right") {
            left = targetRect.x + tooltipRect.width + offset;
            top = targetRect.y + (targetRect.height - tooltipRect.height) / 2;
            setTooltipStyle({ transform: `translate(${left}px, ${top}px)` });
            left = -half;
            top = tooltipRect.height / 2 - half;
            setArrowStyle({ transform: `translate(${left}px, ${top}px) rotate(45deg)` });
        } else if (placement === "top") {
            left = targetRect.x + (targetRect.width - tooltipRect.width) / 2;
            top = targetRect.y - tooltipRect.height - offset;
            setTooltipStyle({ transform: `translate(${left}px, ${top}px)` });
            left = tooltipRect.width / 2 - half;
            top = tooltipRect.height - half;
            setArrowStyle({ transform: `translate(${left}px, ${top}px) rotate(45deg)` });
        } else if (placement === "bottom") {
            left = targetRect.x + (targetRect.width - tooltipRect.width) / 2;
            top = targetRect.y + tooltipRect.height;
            setTooltipStyle({ transform: `translate(${left}px, ${top}px)` });
            left = tooltipRect.width / 2 - half;
            top = -half;
            setArrowStyle({ transform: `translate(${left}px, ${top}px) rotate(45deg)` });
        }
    };

    useEffect(() => {
        updatePosition();
    }, [visible]);

    const showTooltip = () => {
        if (!title) return;

        clearTimeout(timeoutId);
        const id = setTimeout(() => setVisible(true), delay);
        setTimeOutId(id);
    };

    const hideTooltip = () => {
        clearTimeout(timeoutId);
        const id = setTimeout(() => setVisible(false), delay);
        setTimeOutId(id);
    };

    const child = createElement(
        props.children.type,
        {
            onMouseEnter: showTooltip,
            onMouseLeave: hideTooltip,
            ref: targetRef,
        },
        props.children.props?.children
    );

    return (
        <Fragment>
            {child}
            <div className={classNames("tooltip", { visible })} style={tooltipStyle} ref={tooltipRef}>
                {title}
                <div className="tooltip-arrow" style={arrowStyle}></div>
            </div>
        </Fragment>
    );
}
