import React from 'react'
import {List} from "antd-mobile";
import {ScanCodeOutline,FaceRecognitionOutline,ContentOutline} from 'antd-mobile-icons'

class MobileIndex extends React.Component {
    render() {
        return <div className="container">
            <List>
                {
                    actionList.map((action)=>{
                        return (
                            <List.Item
                                prefix={action.icon}
                                href={action.href}
                            >
                                <a
                                    href={action.href}
                                    target={"_blank"}
                                >
                                    {action.label}
                                </a>
                            </List.Item>
                        )
                    })
                }
            </List>
        </div>
    }
}

export default MobileIndex

export const actionList=[
    {
        href:"/Mobile/ClockIn",
        label:"Clock In",
        icon:<ScanCodeOutline />
    },
    {
        href:"/Mobile/Mind",
        label:"Record Memory",
        icon:<FaceRecognitionOutline />
    },
    {
        href:"/Mobile/MindList",
        label:"Memory List",
        icon:<ContentOutline />
    }
]