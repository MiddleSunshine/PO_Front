import React from 'react'
import {Modal, NavBar} from "antd-mobile";
import MobileIndex, {actionList} from "../mobileIndex";

class TopBar extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        let actions=[];
        actionList.map((action)=>{
            actions.push({
                key:action.href,
                text:<a
                    href={action.href}
                >
                    {action.label}
                </a>
            })
        })
        return <div>
            <NavBar
                backArrow={false}
            >
                <span
                    onClick={()=>{
                        Modal.show({
                            content:<a href={"/Mobile"}>PO Mobile</a>,
                            actions:actions
                        })
                    }}
                >
                    {
                        this.props.title
                    }
                </span>
            </NavBar>
        </div>
    }
}

export default TopBar