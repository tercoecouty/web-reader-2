import { useState, useEffect } from "react";
import classNames from "classnames";
import "./NoteEdit.less";

import Icon from "../../component/Icon";
import ArrowLeftSvg from "../../svg/arrow-left.svg?raw";
import SendSvg from "../../svg/send.svg?raw";
import DeleteSvg from "../../svg/delete.svg?raw";

interface INoteEditProps {
    initialText?: string;
    headerText?: string;
    onClose: () => void;
    onSubmit: (text: string, files: File[]) => void;
}

export default function NoteEdit(props: INoteEditProps) {
    const { initialText, onClose, onSubmit } = props;
    const headerText = props.headerText || "返回";
    const [show, setShow] = useState(false);
    const [value, setValue] = useState(initialText || "");
    const [fileMap, setFileMap] = useState<Map<string, File>>(new Map());
    const [hasChange, setHasChange] = useState(false);

    useEffect(() => {
        setShow(true);
        setTimeout(() => {
            const dom = document.getElementById("note-edit-textarea") as HTMLInputElement;
            dom.focus();
            dom.setSelectionRange(value.length, value.length);
        }, 300);

        return () => {
            for (const url of fileMap.keys()) URL.revokeObjectURL(url);
        };
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(() => onClose(), 300);
    };

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

    const deleteImage = (url: string) => {
        URL.revokeObjectURL(url);
        fileMap.delete(url);

        (document.getElementById("image-file-input") as any).value = "";
        setFileMap(new Map(fileMap));
    };

    const preview = (url: string) => {
        console.log(url);
    };

    const submit = () => {
        if (!hasChange) return;
        onSubmit(value, [...fileMap.values()]);
        setShow(false);
        setTimeout(() => onClose(), 300);
    };

    const renderImages = () => {
        const domImages = [];
        for (const url of fileMap.keys()) {
            domImages.push(
                <div className="image-item" key={url}>
                    <img src={url} />
                    <div className="image-item-delete" onClick={() => preview(url)}>
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
                <Icon onClick={handleClose} svg={ArrowLeftSvg} />
                <span className="header-text">{headerText}</span>
            </div>
            <textarea
                id="note-edit-textarea"
                value={value}
                onInput={handleChange}
                placeholder="在这里输入……"
            ></textarea>
            <div className="note-edit-images">
                <input
                    className="image-file-input"
                    id="image-file-input"
                    type="file"
                    accept=".jpg,.png"
                    onInput={handleFileChange}
                />
                {renderImages()}
                {/* <div className="image-preview">
                    <img src="01.jpg" />
                </div> */}
            </div>
            <div className="note-edit-submit">
                <span className="letter-count">{value.length} / 200</span>
                <Icon svg={SendSvg} onClick={submit} className={classNames({ disabled: !hasChange })} />
            </div>
        </div>
    );
}
