import "./SidebarItem.less";
import Icon from "../../component/Icon";

interface ISidebarItemProps {
    disabled?: boolean;
    svg: string;
    title?: string;
    onClick?: () => void;
}

export default function SidebarItem(props: ISidebarItemProps) {
    const { svg, disabled, title, onClick } = props;

    const handleClick = () => {
        if (disabled) return;
        if (onClick) onClick();
    };

    let classNames = ["sidebar-item"];
    if (disabled) {
        classNames.push("disabled");
    }

    return (
        <div className={classNames.join(" ")} onClick={handleClick} title={title}>
            <Icon svg={svg} />
        </div>
    );
}
