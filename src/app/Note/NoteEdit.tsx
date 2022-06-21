import { useState, useEffect } from "react";
import classNames from "classnames";
import "./NoteEdit.less";

import Icon from "../../component/Icon";
import ArrowLeftSvg from "../../svg/arrow-left.svg?raw";
import SendSvg from "../../svg/send.svg?raw";

import NoteImages from "./NoteImages";

interface INoteEditProps {
    initialText?: string;
    headerText?: string;
    imagesUrls?: string[];
    onClose: () => void;
    onSubmit: (text: string, files: File[]) => void;
}

export default function NoteEdit(props: INoteEditProps) {
    const { initialText, imagesUrls, onClose, onSubmit } = props;
    const headerText = props.headerText || "返回";
    const [show, setShow] = useState(false);
    const [value, setValue] = useState(initialText || "");
    const [fileMap, setFileMap] = useState<Map<string, File>>(new Map(imagesUrls.map((url) => [url, null])));
    const [hasChange, setHasChange] = useState(false);

    useEffect(() => {
        setShow(true);
        setTimeout(() => {
            const dom = document.getElementById("note-edit-textarea") as HTMLInputElement;
            dom.focus();
            dom.setSelectionRange(value.length, value.length);
        }, 300);
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

    const handleUpload = (file: File) => {
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
        setHasChange(true);
    };

    const submit = async () => {
        if (!hasChange) return;
        const files: File[] = [];
        for (const url of fileMap.keys()) {
            const res = await fetch(url);
            const blob = await res.blob();
            const file = new File([blob], "");
            files.push(file);
        }
        onSubmit(value, files);
        setShow(false);
        setTimeout(() => onClose(), 300);
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
            <NoteImages urls={[...fileMap.keys()]} onDelete={deleteImage} onUpload={handleUpload} />
            <div className="note-edit-submit">
                <span className="letter-count">{value.length} / 200</span>
                <Icon svg={SendSvg} onClick={submit} className={classNames({ disabled: !hasChange })} />
            </div>
        </div>
    );
}
