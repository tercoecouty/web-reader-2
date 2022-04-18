import React from "react";
import "./Icon.less";

interface IIconProps {
    svg: string;
}

export default class Icon extends React.Component<IIconProps> {
    private ref;
    constructor(props: any) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        (this.ref.current as any).innerHTML = this.props.svg;
    }

    render() {
        return <span ref={this.ref as any} className="icon"></span>;
    }
}
