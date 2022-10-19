import React from "react";
import {Button, Dropdown, Menu} from "antd";

class Links extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            PID:props.PID,
            Label:props.hasOwnProperty('Label')?props.Label:"Option",
            Color:props.hasOwnProperty('Color')?props.Color:"white"
        }
    }
    render() {
        return <div>
            <Dropdown overlay={
                <Menu>
                    <Menu.Item>
                        <Button
                            type={"link"}
                            href={"/point/edit/"+this.state.PID}
                            target={"_blank"}
                        >
                            Edit Point
                        </Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button
                            type={"link"}
                            href={"/pointTable/"+this.state.PID}
                            target={"_blank"}
                        >
                            New Page
                        </Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button
                            type={"link"}
                            href={"/MindNote/"+this.state.PID}
                            target={"_blank"}
                        >
                            White Board
                        </Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button
                            target={"_blank"}
                            href={"/pointRoad/"+this.state.PID}
                            type={"link"}
                        >
                            Forward
                        </Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button
                            target={"_blank"}
                            href={"/pointTree/"+this.state.PID}
                            type={"link"}
                        >
                            Tree
                        </Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button
                            target={"_blank"}
                            href={"/pointsSang/"+this.state.PID}
                            type={"link"}
                        >
                            Sankey
                        </Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button
                            target={"_blank"}
                            href={"/pointMindMap/"+this.state.PID+"/0/0/column"}
                            type={"link"}
                        >
                            MindMap
                        </Button>
                    </Menu.Item>
                </Menu>
            }>
                <span
                    style={{color:this.state.Color,cursor:"pointer"}}
                >{this.state.Label}</span>
            </Dropdown>
        </div>;
    }
}

export default Links