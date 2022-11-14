import {useEffect, useState} from 'react'
import "../css/Mind.css";
import {Button, DatePicker, Divider, Ellipsis, Empty, ImageViewer, List, NavBar, Rate, Toast} from "antd-mobile";
import {PictureOutline,StarOutline} from 'antd-mobile-icons'
import {TypeIconMap} from "./Mind";
import {requestApi} from "../config/functions";
import BottomBar from './component/BottomBar';
import TopBar from "./component/TopBar";

const MindList = (props) => {
    const [mindList, updateMindList] = useState([]);
    const [startTime,updateStartTime]=useState('');
    const [endTime,updateEndTime]=useState('');
    const [startPickerDate,switchPickerDate]=useState(0);
    const [previewImages,updatePreviewImages]=useState([]);
    const [switchPreviewImages,switchPreview]=useState(false);
    useEffect(()=>{
        getMindList();
    },[])

    const getMindList=(StartTime='',EndTime='')=>{
        requestApi("/index.php?action=Feeling&method=List&StartTime="+StartTime+"&EndTime="+EndTime)
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

    const startPreview=(imagesUrls)=>{
        if (imagesUrls){
            if (imagesUrls.length>0){
                updatePreviewImages(imagesUrls);
                switchPreview(true)
            }
        }
    }

    return <div className={"Mind"}>
        <div
            className={"MindList"}
        >
            <TopBar
                title={"Memory"}
            />
            <Divider
                contentPosition={"left"}
            >
                <span
                    onClick={()=>{
                        switchPickerDate(1)
                    }}
                >{startTime?startTime:'StartTime'}</span>
                -
                <span
                    onClick={()=>{
                        switchPickerDate(2)
                    }}
                >{endTime?endTime:"EndTime"}</span>
            </Divider>
            <DatePicker
                title={(startPickerDate==1?'StartTime':'EndTime')}
                visible={startPickerDate>0}
                onClose={()=>{
                    switchPickerDate(0);
                }}
                onConfirm={(val)=>{
                    /**
                     * @var Date val
                     */
                    let date=val.getFullYear()+"-"+(val.getMonth()+1)+"-"+val.getDate();
                    (async ()=>{})()
                        .then(()=>{
                            startPickerDate==1?updateStartTime(date):updateEndTime(date)
                        })
                        .then(()=>{
                            let StartTime=startTime;
                            let EndTime=endTime;
                            if (startPickerDate==1){
                                StartTime=date;
                            }else{
                                EndTime=date;
                            }
                            getMindList(StartTime,EndTime);
                        })
                }}
            />
            {
                mindList.length>0
                ?mindList.map((listItem) => {
                    return (
                        <List
                            key={listItem.date}
                            header={listItem.date}
                        >
                            {
                                listItem.feelings.map((mind) => {
                                    return (
                                        <List.Item
                                            key={mind.ID}
                                            prefix={
                                                <div
                                                    className={mind.type + " Icon"+(mind.imageUrls.length>0?' withImage':'')}
                                                    onClick={()=>{
                                                        startPreview(mind.imageUrls);
                                                    }}
                                                >
                                                    {TypeIconMap[mind.type].component}
                                                </div>
                                            }
                                            description={
                                            <>
                                                <span style={{fontSize:"15px"}}>{mind.AddTime.slice(10)}</span>
                                                &nbsp;&nbsp;
                                                <Rate
                                                    count={5}
                                                    value={mind.rate}
                                                />
                                            </>
                                            }
                                        >
                                            <Ellipsis
                                                content={mind.note}
                                                direction={'end'}
                                                expandText={'more'}
                                                collapseText={'less'}
                                            />
                                        </List.Item>
                                    )
                                })
                            }
                        </List>
                    )
                })
                    :<Empty
                    description={"Without Data"}
                    />
            }
        </div>
        <ImageViewer.Multi
            images={previewImages}
            visible={switchPreviewImages}
            onClose={()=>{
                switchPreview(false);
            }}
        />
    </div>
}

export default MindList
