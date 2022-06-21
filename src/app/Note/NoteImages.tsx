import { useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import "./NoteImages.less";

import Icon from "../../component/Icon";
import DeleteSvg from "../../svg/delete.svg?raw";
import EyeSvg from "../../svg/eye.svg?raw";

interface INoteImagesProps {
    urls: string[];
    onUpload?: (file: File) => void;
    onDelete?: (url: string) => void;
}

export default function NoteImages(props: INoteImagesProps) {
    const { urls, onDelete, onUpload } = props;
    const [previewUrl, setPreviewUrl] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0] as File;
        onUpload(file);
    };

    const handleShowPreview = (url: string) => {
        setPreviewUrl(url);
        setTimeout(() => setShowPreview(true), 0);
    };

    const handleHidePreview = () => {
        setShowPreview(false);
        setTimeout(() => setPreviewUrl(""), 300);
    };

    const renderImages = () => {
        const domImages = [];
        for (const url of urls) {
            domImages.push(
                <div className="image-item" key={url}>
                    <img src={url} />
                    <div className="image-item-hover">
                        <Icon svg={EyeSvg} onClick={() => handleShowPreview(url)} />
                        {onDelete && <Icon svg={DeleteSvg} onClick={() => onDelete(url)} />}
                    </div>
                </div>
            );
        }

        if (onUpload && domImages.length < 9) {
            domImages.push(
                <div
                    className="image-upload"
                    onClick={() => document.getElementById("image-file-input").click()}
                    key="image-upload"
                >
                    <span>
                        <span></span>
                        <span></span>
                    </span>
                </div>
            );
        }

        return domImages;
    };

    const renderPreview = () => {
        return createPortal(
            <div className="image-preview">
                <div
                    className={classNames("image-preview-background", { show: showPreview })}
                    onClick={handleHidePreview}
                ></div>
                <img className={classNames({ show: showPreview })} src={previewUrl} />
            </div>,
            document.body
        );
    };

    return (
        <div className="note-edit-images">
            <input
                className="image-file-input"
                id="image-file-input"
                type="file"
                accept=".jpg,.png"
                onInput={handleFileChange}
            />
            {renderImages()}
            {previewUrl && renderPreview()}
        </div>
    );
}
