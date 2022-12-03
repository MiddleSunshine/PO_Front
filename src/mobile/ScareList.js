import React from 'react'
import TopBar from "./component/TopBar";
import {Divider} from "antd-mobile";

class ScareList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            ScareList:[]
        }
    }
    render() {
        return <div>
            <TopBar
                title={"Life"}
            />
            <Divider>
                <a href={"/Mobile/NewScare/0"}>
                    New Reason
                </a>
            </Divider>

        </div>
    }
}

export default ScareList