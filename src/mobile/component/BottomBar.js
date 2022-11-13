import React from 'react'
import {FloatingBubble, List, Modal} from "antd-mobile";
import {AppstoreOutline} from 'antd-mobile-icons';
import MobileIndex from "../mobileIndex";

class BottomBar extends React.Component{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    render() {
        return <div>
            <FloatingBubble
                onClick={()=>{
                    Modal.alert({
                        content:<div>
                            <MobileIndex />
                        </div>
                    })
                }}
            >
                <AppstoreOutline fontSize={20} />
            </FloatingBubble>
        </div>
    }
}

export default BottomBar