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

    const handleHidePreview = () => {
        setShow(false);
        setTimeout(() => onClose(), 300);
    };

    return createPortal(
        <div className="image-preview">
            <div className={classNames("image-preview-background", { show })} onClick={handleHidePreview}></div>
            <img className={classNames({ show })} src={previewUrl} />
        </div>,
        document.body
    );
}
