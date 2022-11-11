import {useEffect, useState} from 'react'
import "../css/Mind.css";
import {List, Rate, Toast} from "antd-mobile";
import {PictureOutline} from 'antd-mobile-icons'
import {TypeIconMap} from "./Mind";
import {requestApi} from "../config/functions";

const MindList = (props) => {
    const [mindList, updateMindList] = useState([]);
    const [startTime,updateStartTime]=useState('');
    const [endTime,updateEndTime]=useState('');

    useEffect(()=>{
        getMindList();
    },[mindList])

    const getMindList=(StartTime='',EndTime='')=>{
        requestApi("/index.php?action=Feeling&method=List&StartTime"+StartTime+"&EndTime="+EndTime)
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        updateMindList(json.Data);
                    }else{
                        Toast.show({
                            content:json.Message,
                            icon:"fail"
                        })
                    }
                })
            })
    }

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
