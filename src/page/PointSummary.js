import {Button, Card, Col, Divider, Drawer, message, Row, Tag} from "antd";
import React from "react";
import PointSummaryEdit from "../component/PointSummaryEdit";
import Road from "../component/road";
import {requestApi} from "../config/functions";
import "../css/PointSummary.css";

class PointSummary extends React.Component{
    constructor(props){
        super(props);
        this.state={
            EditPointID:-1,
            pointSummaryList:[]
        }
        this.getSummaryList=this.getSummaryList.bind(this);
        this.switchHidden=this.switchHidden.bind(this);
    }

    componentDidMount(){
        document.title="Point Summary";
        this.getSummaryList();
    }

    getSummaryList(){
        requestApi("/index.php?action=PointSummary&method=List")
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        pointSummaryList:json.Data.summaries
                    })
                })
            })
    }

    switchHidden(index){
        let pointSummaryList=this.state.pointSummaryList;
        pointSummaryList[index].Hidden=!pointSummaryList[index].Hidden;
        this.setState({
            pointSummaryList:pointSummaryList
        });
    }

    deleteConnection(summaryId,tagId){
        requestApi("/index.php?action=PointTagConnection&method=DeleteConnection",{
            method:"post",
            body:JSON.stringify({
                PS_ID:summaryId,
                TID:tagId
            }),
            mode:"cors"
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Delete Success !")
                    }
                })
            })
    }
    render(){
        return <div className="container PointSummary">
            <Road />
            <Divider
                orientation="left"
            >
                我们的目标，是星辰大海
            </Divider>
            <Row>
                <Col span={24}>
                    <Row>
                        <Button
                            type={"primary"}
                        >
                            New Summary
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button
                            type={"primary"}
                            onClick={()=>{
                                let list=[];
                                this.state.pointSummaryList.map((Item)=>{
                                    list.push({
                                        ...Item,
                                        Hidden:true
                                    });
                                });
                                this.setState({
                                    pointSummaryList:list
                                })
                            }}
                        >
                            Min
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button
                            type={"primary"}
                            onClick={()=>{
                                let list=[];
                                this.state.pointSummaryList.map((Item)=>{
                                    list.push({
                                        ...Item,
                                        Hidden:false
                                    });
                                });
                                this.setState({
                                    pointSummaryList:list
                                })
                            }}
                        >
                            Max
                        </Button>
                    </Row>
                    <Row>
                        <Divider
                            orientation="left"
                        >
                            Point Summary
                        </Divider>
                    </Row>
                </Col>
            </Row>
            {
                this.state.pointSummaryList.map((Item,index)=>{
                    return(
                        <div
                            key={index}
                            style={{marginBottom:"10px"}}
                        >
                            <Card
                                title={
                                    <Row
                                        className={"clickAble"}
                                        onClick={()=>{
                                            this.switchHidden(index);
                                        }}
                                    >
                                        <Col span={16}>
                                            <span
                                                onClick={()=>{
                                                    this.setState({
                                                        EditPointID:Item.ID
                                                    })
                                                }}
                                            >
                                                {Item.Title}
                                            </span>
                                        </Col>
                                        <Col span={8}>
                                            {
                                                Item.tags.map((tag,insideIndex)=>{
                                                    return(
                                                        <Tag
                                                            closable={true}
                                                            onClose={()=>{
                                                                this.deleteConnection(Item.ID,tag.ID);
                                                            }}
                                                        >
                                                            {tag.Tag}
                                                        </Tag>
                                                    )
                                                })
                                            }
                                        </Col>
                                    </Row>
                                }
                                size={"small"}
                            >
                                {
                                    Item.Hidden
                                        ?""
                                        :<div>
                                            <Row>
                                                <Col span={24}>
                                                    {Item.note}
                                                </Col>
                                            </Row>
                                            <Row
                                                className={"YName"}
                                                justify={"center"}
                                                align={"middle"}
                                            >
                                                <Col span={4}>
                                                    <span>{Item.YName}</span>
                                                </Col>
                                                {
                                                    Item.url
                                                        ?<Col span={4}>
                                                            <Button
                                                                type={"link"}
                                                                target={"_blank"}
                                                                href={Item.url}
                                                            >
                                                                link
                                                            </Button>
                                                        </Col>
                                                        :''
                                                }
                                                {
                                                    Item.file
                                                        ?<Col span={4}>
                                                            <Button
                                                                type={"primary"}
                                                                ghost={true}
                                                            >
                                                                {Item.file}
                                                            </Button>
                                                        </Col>
                                                        :''
                                                }
                                                <Col span={12}>
                                                    <span className={"dateInfo"}>AddTime : {Item.AddTime} / LastUpdateTime : {Item.LastUpdateTime}</span>
                                                </Col>
                                            </Row>
                                        </div>
                                }
                            </Card>
                        </div>
                    )
                })
            }
            <Row>
                <Drawer
                    title={"Point Summary Edit"}
                    width={800}
                    visible={this.state.EditPointID!=-1}
                    onClose={
                        ()=>{
                            this.setState({
                                EditPointID:-1
                            })
                        }
                    }
                >
                    <PointSummaryEdit 
                        ID={this.state.EditPointID}
                    />
                </Drawer>
            </Row>
        </div>
    }
}

export default PointSummary