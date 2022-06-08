import React, { useState, useRef } from "react";
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
    const { children } = props;
    const placement = props.placement || "top";
    const title = props.title || "";
    const defaultVisible = props.defaultVisible || false;
    const delay = props.delay || 500;
    const offset = props.offset || 8;

    const [visible, setVisible] = useState(defaultVisible);
    const [timeoutId, setTimeOutId] = useState(null);
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
    const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
    const targetRef = useRef(null);
    const tooltipRef = useRef(null);

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
            setTooltipStyle({ left, top });
            left = tooltipRect.width - half;
            top = tooltipRect.height / 2 - half;
            setArrowStyle({ left, top });
        } else if (placement === "right") {
            left = targetRect.x + targetRect.width + offset;
            top = targetRect.y + (targetRect.height - tooltipRect.height) / 2;
            setTooltipStyle({ left, top });
            left = -half;
            top = tooltipRect.height / 2 - half;
            setArrowStyle({ left, top });
        } else if (placement === "top") {
            left = targetRect.x + (targetRect.width - tooltipRect.width) / 2;
            top = targetRect.y - tooltipRect.height - offset;
            setTooltipStyle({ left, top });
            left = tooltipRect.width / 2 - half;
            top = tooltipRect.height - half;
            setArrowStyle({ left, top });
        } else if (placement === "bottom") {
            left = targetRect.x + (targetRect.width - tooltipRect.width) / 2;
            top = targetRect.y + targetRect.height;
            setTooltipStyle({ left, top });
            left = tooltipRect.width / 2 - half;
            top = -half;
            setArrowStyle({ left, top });
        }
    };

    const showTooltip = () => {
        clearTimeout(timeoutId);
        const id = setTimeout(() => {
            updatePosition();
            setVisible(true);
        }, delay);
        setTimeOutId(id);
    };

    const hideTooltip = () => {
        clearTimeout(timeoutId);
        setVisible(false);
    };

    const child = React.createElement(
        children.type,
        {
            onMouseEnter: showTooltip,
            onMouseLeave: hideTooltip,
            ref: targetRef,
            ...children.props,
        },
        children.props?.children
    );

    return (
        <React.Fragment>
            {child}
            <div className={classNames("tooltip", { visible })} style={tooltipStyle} ref={tooltipRef}>
                {title}
                <div className="tooltip-arrow" style={arrowStyle}></div>
            </div>
        </React.Fragment>
    );
}
