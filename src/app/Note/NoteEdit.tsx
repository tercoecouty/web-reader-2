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
        requestAnimationFrame(() => setShow(true));
    }, []);

    const handleTransEnd = () => {
        if (show) {
            const dom = document.getElementById("note-edit-textarea") as HTMLInputElement;
            dom.focus();
            dom.setSelectionRange(value.length, value.length);
        } else {
            onClose();
        }
    };

    const handleChange = (e) => {
        if (e.target.value.length > 200) return;
        setValue(e.target.value);
        setHasChange(true);

        // 文本框随着输入文字的改变自动伸长或缩短
        // 参考 https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
        const dom = document.getElementById("note-edit-textarea");
        dom.style.height = "auto";
        dom.style.height = dom.scrollHeight + "px";
    };

    const handleUpload = (file: File) => {
        const url = URL.createObjectURL(file);
        fileMap.set(url, file);
        setFileMap(new Map(fileMap));
        setHasChange(true);
    };

    const deleteImage = (url: string) => {
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
            URL.revokeObjectURL(url);
            files.push(file);
        }
        onSubmit(value, files);
        setShow(false);
    };

    return (
        <div className={classNames("note-edit", { show })} onTransitionEnd={handleTransEnd}>
            <div className="note-edit-header">
                <Icon onClick={() => setShow(false)} svg={ArrowLeftSvg} />
                <span className="header-text">{headerText}</span>
            </div>
            <div className="scroll-container">
                <textarea
                    id="note-edit-textarea"
                    value={value}
                    onInput={handleChange}
                    placeholder="在这里输入……"
                ></textarea>
                <NoteImages urls={[...fileMap.keys()]} onDelete={deleteImage} onUpload={handleUpload} />
            </div>
            <div className="note-edit-submit">
                <span className="letter-count">{value.length} / 200</span>
                <Icon svg={SendSvg} onClick={submit} className={classNames({ disabled: !hasChange })} />
            </div>
        </div>
    );
}
