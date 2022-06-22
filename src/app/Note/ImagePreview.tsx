import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import "./ImagePreview.less";

interface IImagePreviewProps {
    previewUrl: string;
    onClose: () => void;
}

export default function ImagePreview(props: IImagePreviewProps) {
    const { previewUrl, onClose } = props;
    const [show, setShow] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setShow(true));
    }, []);

    const handleTransEnd = (e) => {
        if (!show && e.propertyName === "transform") onClose();
    };

    return createPortal(
        <div className={classNames("image-preview", { show })} onTransitionEnd={handleTransEnd}>
            <div className="image-preview-background" onClick={() => setShow(false)}></div>
            <img src={previewUrl} />
        </div>,
        document.body
    );
}
