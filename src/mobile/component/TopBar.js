import React from 'react'
import {Modal, NavBar, Popup} from "antd-mobile";
import MobileIndex, {actionList} from "../mobileIndex";

class TopBar extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            switchPopUp:false
        }
    }
    render() {
        return <div>
            <NavBar
                backArrow={false}
            >
                <span
                    onClick={()=>{
                        this.setState({
                            switchPopUp:true
                        })
                    }}
                >
                    {
                        this.props.title
                    }
                </span>
            </NavBar>
            <Popup
                onMaskClick={()=>{
                    this.setState({
                        switchPopUp:false
                    })
                }}
                visible={this.state.switchPopUp}
            >
                <MobileIndex />
            </Popup>
        </div>
    }
}

export default TopBar