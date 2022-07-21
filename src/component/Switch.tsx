import classNames from "classnames";
import "./Switch.less";

interface ISwitchProps {
    checked?: boolean;
    onChange?: () => void;
}

export default function Switch(props: ISwitchProps) {
    const checked = props.checked ? true : false;

    const handleChange = () => {
        if (props.onChange) props.onChange();
    };

    return (
        <div className={classNames("switch", { checked })} onClick={handleChange}>
            <span className="slider"></span>
        </div>
    );
}
