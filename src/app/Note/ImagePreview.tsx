import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import "./ImagePreview.less";

import Icon from "../../component/Icon";
import ArrowLeftSvg from "../../svg/arrow-left.svg?raw";
import ArrowRightSvg from "../../svg/arrow-right.svg?raw";

interface IImagePreviewProps {
    onClose: () => void;
    urls: string[];
    currentUrl: string;
}

export default function ImagePreview(props: IImagePreviewProps) {
    const { onClose, urls } = props;
    const [show, setShow] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const _index = urls.indexOf(props.currentUrl);
        if (_index !== -1) setIndex(_index);
        requestAnimationFrame(() => setShow(true));
    }, []);

    const handleTransEnd = (e) => {
        if (!show && e.propertyName === "transform") onClose();
    };

    const nextImage = () => {
        if (index === 0) {
            setIndex(urls.length - 1);
        } else {
            setIndex(index - 1);
        }
    };

    const prevImage = () => {
        if (index === urls.length - 1) {
            setIndex(0);
        } else {
            setIndex(index + 1);
        }
    };

    return createPortal(
        <div className={classNames("image-preview", { show })} onTransitionEnd={handleTransEnd}>
            <div className="image-preview-background" onClick={() => setShow(false)}></div>
            <img src={urls[index]} />
            <span className="image-preview-arrow left">
                <Icon svg={ArrowLeftSvg} onClick={prevImage} />
            </span>
            <span className="image-preview-arrow right">
                <Icon svg={ArrowRightSvg} onClick={nextImage} />
            </span>
        </div>,
        document.body
    );
}
