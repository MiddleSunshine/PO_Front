import React from 'react'
import {FloatingBubble, List, Modal} from "antd-mobile";
import {AppstoreOutline} from 'antd-mobile-icons';

class BottomBar extends React.Component{

    render() {
        return <div>
            <FloatingBubble
                onClick={()=>{
                    Modal.alert({
                        content:<div>
                            <List>
                                <List.Item>
                                    <a href={"/Mobile/ClockIn"}>Click In</a>
                                </List.Item>
                            </List>
                        </div>
                    })
                }}
            >
                <AppstoreOutline />
            </FloatingBubble>
        </div>
    }
}

export default BottomBar