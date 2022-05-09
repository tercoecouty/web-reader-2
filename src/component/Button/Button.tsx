import "./Button.less";

interface IButtonProps {
    children?: any;
    danger?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

export default function Button(props: IButtonProps) {
    const { children, danger, disabled, onClick } = props;

    const classList = ["button"];

    if (danger) classList.push("danger");
    if (disabled) classList.push("disabled");

    return (
        <span className={classList.join(" ")} onClick={() => onClick && onClick()}>
            {children}
        </span>
    );
}
