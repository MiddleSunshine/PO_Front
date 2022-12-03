import React from 'react'
import TopBar from "./component/TopBar";
import {Divider} from "antd-mobile";

class ScareList extends React.Component{
    render() {
        return <div>
            <TopBar
                title={"Life"}
            />
            <Divider>
                <a href={""}>
                    New Reason
                </a>
            </Divider>

        </div>
    }
}

export default ScareList