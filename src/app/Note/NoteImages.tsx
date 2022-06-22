import { useState } from "react";
import "./NoteImages.less";

import Icon from "../../component/Icon";
import DeleteSvg from "../../svg/delete.svg?raw";
import EyeSvg from "../../svg/eye.svg?raw";

import ImagePreview from "./ImagePreview";

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
        setShowPreview(true);
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

    return (
        <div className="note-edit-images">
            {onUpload && (
                <input
                    className="image-file-input"
                    id="image-file-input"
                    type="file"
                    accept=".jpg,.png"
                    onInput={handleFileChange}
                />
            )}
            {renderImages()}
            {showPreview && <ImagePreview previewUrl={previewUrl} onClose={() => setShowPreview(false)} />}
        </div>
    );
}
