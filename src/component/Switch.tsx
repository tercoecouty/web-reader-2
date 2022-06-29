import classNames from "classnames";
import "./Switch.less";

interface ISwitchProps {
    open?: boolean;
    onChange?: () => void;
}

export default function Switch(props: ISwitchProps) {
    const open = props.open ? true : false;

    const handleChange = () => {
        if (props.onChange) props.onChange();
    };

    return (
        <div className={classNames("switch", { open })} onClick={handleChange}>
            <div className="switch-circle"></div>
        </div>
    );
}
