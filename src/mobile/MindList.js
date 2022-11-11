import {useEffect, useState} from 'react'
import "../css/Mind.css";
import {List, Rate} from "antd-mobile";
import {PictureOutline} from 'antd-mobile-icons'
import {TypeIconMap} from "./Mind";

const MindList = (props) => {
    const [mindList, updateMindList] = useState([]);

    return <div className={"container Mind"}>
        <div
            className={"MindList"}
        >
            {
                mindList.map((listItem) => {
                    return (
                        <List
                            key={listItem.date}
                            header={listItem.date}
                        >
                            {
                                listItem.feelings.map((mind) => {
                                    return (
                                        <List.Item
                                            extra={
                                                mind.imageUrl.length > 0
                                                    ? <PictureOutline/>
                                                    : ''
                                            }
                                            key={mind.ID}
                                            prefix={
                                                <div
                                                    className={mind.type + " Icon"}
                                                >
                                                    {TypeIconMap[mind.type].component}
                                                </div>
                                            }
                                            description={<Rate
                                                count={5}
                                                value={mind.rate}
                                            />}
                                        >
                                            {mind.note}
                                        </List.Item>
                                    )
                                })
                            }
                        </List>
                    )
                })
            }
        </div>
    </div>
}

export default MindList
