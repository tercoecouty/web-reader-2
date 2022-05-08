import "./Button.less";

interface IButtonProps {
    children?: any;
}

export default function Button(props: IButtonProps) {
    return <button>{props.children}</button>;
}
