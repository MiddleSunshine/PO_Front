import React from "react";
import {Breadcrumb} from 'antd'

class Road extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roads: [
                {label: "Index", value: "/"},
                {label: "Willings", value: '/willing'},
                {label: "Report", value: '/report'},
                {label: "Plan",value:"/plan"}
            ]
        };
    }

    render() {
        return (
            <Breadcrumb>
                {this.state.roads.map((Item, index) => {
                    return (
                        <Breadcrumb.Item
                            key={index}
                        >
                            <a href={Item.value} >{Item.label}</a>
                        </Breadcrumb.Item>
                    )
                })}
            </Breadcrumb>
        )
    }
}

export default Road
