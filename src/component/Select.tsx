import { useState } from "react";
import "./Select.less";

import Icon from "./Icon";
import DownSvg from "../svg/down.svg?raw";

interface ISelectProps {
    options: any[];
    value: any;
    onChange?: (value: number) => void;
}

export default function Select(props: ISelectProps) {
    const { options, value, onChange } = props;
    const [showOptions, setShowOptions] = useState(false);

    const handleChange = (value: number) => {
        if (onChange) onChange(value);
        setShowOptions(false);
    };

    const renderOptions = () => {
        return options.map((option) => {
            return (
                <div className="select-options-item" key={option} onClick={() => handleChange(option)}>
                    {option}
                </div>
            );
        });
    };

    return (
        <div className="select">
            <div className="select-face" onClick={() => setShowOptions(!showOptions)}>
                <span className="select-value">{value}</span>
                <Icon svg={DownSvg} />
            </div>
            {showOptions && <div className="select-options">{renderOptions()}</div>}
        </div>
    );
}
