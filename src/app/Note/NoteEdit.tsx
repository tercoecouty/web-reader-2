import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import "./NoteEdit.less";

import { selectEditNoteInitialText } from "../../slice/noteSlice";

import Icon from "../../component/Icon";
import ArrowLeftSvg from "../../svg/arrow-left.svg?raw";
import SendSvg from "../../svg/send.svg?raw";
import DeleteSvg from "../../svg/delete.svg?raw";

interface INoteEditProps {
    show?: boolean;
    headerText?: string;
    onClose: () => void;
    onSubmit: (text: string, files: File[]) => void;
}

export default function NoteEdit(props: INoteEditProps) {
    const { show, onClose, onSubmit } = props;
    const headerText = props.headerText || "返回";
    const editNoteInitialText = useSelector(selectEditNoteInitialText);
    const [value, setValue] = useState(editNoteInitialText);
    const [fileMap, setFileMap] = useState<Map<string, File>>(new Map());
    const [hasChange, setHasChange] = useState(false);

    useEffect(() => {
        for (const url of fileMap.keys()) URL.revokeObjectURL(url);
        (document.getElementById("image-file-input") as any).value = "";
        setValue(editNoteInitialText);
        setFileMap(new Map());
        setHasChange(false);
    }, [show]);

    const handleChange = (e) => {
        if (e.target.value.length > 200) return;
        setValue(e.target.value);
        setHasChange(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0] as File;
        const url = URL.createObjectURL(file);
        fileMap.set(url, file);
        setFileMap(new Map(fileMap));
        setHasChange(true);
    };

    const handleDeleteImage = (url: string) => {
        URL.revokeObjectURL(url);
        fileMap.delete(url);

        (document.getElementById("image-file-input") as any).value = "";
        setFileMap(new Map(fileMap));
    };

    const handleSubmit = () => {
        if (!hasChange) return;
        onSubmit(value, [...fileMap.values()]);
    };

    const renderImages = () => {
        const domImages = [];
        for (const url of fileMap.keys()) {
            domImages.push(
                <div className="image-item" key={url}>
                    <img src={url} />
                    <div className="image-item-delete" onClick={() => handleDeleteImage(url)}>
                        <Icon svg={DeleteSvg} />
                    </div>
                </div>
            );
        }

        if (domImages.length < 9) {
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
        <div className={classNames("note-edit", { show })}>
            <div className="note-edit-header">
                <Icon onClick={onClose} svg={ArrowLeftSvg} />
                <span className="header-text">{headerText}</span>
            </div>
            <textarea value={value} onInput={handleChange} placeholder="输入笔记……"></textarea>
            <div className="note-edit-images">
                <input
                    className="image-file-input"
                    id="image-file-input"
                    type="file"
                    accept=".jpg,.png"
                    onInput={handleFileChange}
                />
                {renderImages()}
            </div>
            <div className="note-edit-submit">
                <Icon svg={SendSvg} onClick={handleSubmit} className={classNames({ disabled: !hasChange })} />
            </div>
        </div>
    );
}
