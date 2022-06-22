import { useState, useEffect } from "react";
import classNames from "classnames";
import "./Prompt.less";

interface IPromptProps {
    userName: string;
    onClose: () => void;
}

export default function Prompt(props: IPromptProps) {
    const { userName, onClose } = props;
    const [show, setShow] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setShow(true));
    }, []);

    const handleTransEnd = () => {
        if (!show) onClose();
    };

    return (
        <div className={classNames("view-others-prompt", { show })} onTransitionEnd={handleTransEnd}>
            正在查看 <span>{userName}</span> 的笔记，点击 <button onClick={() => setShow(false)}>退出</button>
        </div>
    );
}
