import React from "react";
import {requestApi} from "../config/functions";
import MindMapConnection from "../component/MindMap";
import config from "../config/setting";

import "../css/PointRoad.css"
import {Button, Col, Drawer, InputNumber, Row, Tooltip} from "antd";
import PointEdit from "../component/PointEdit";

class PointsRoad extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            pointTable:[],
            pid:props.match.params.pid,
            EditPoint:{},
            pointItemWidth:130,
            pointItemHeight:80
        }
        this.getTableData=this.getTableData.bind(this);
        this.EditPoint=this.EditPoint.bind(this);
    }

    componentDidMount() {
        this.getTableData(this.state.pid);
        document.title="Point Mind Map Mode";
    }

    getTableData(id){
        if (id){
            requestApi("/index.php?action=PointMindMap&method=Index&id="+id)
                .then((res)=>{
                    res.json().then((json)=>{
                        this.setState({
                            pointTable:json.Data.Table
                        })
                    })
                })
        }
    }

    EditPoint(point){
        this.setState({
            EditPoint:point
        })
    }

    render() {
        return (
            <div className="container PointRoad">
                <Row justify={"start"} align={"middle"}>
                    <Col span={2}>
                        <Button
                            type={"link"}
                            href={"/pointTable/"+this.state.pid}
                            target={"_blank"}
                        >
                            Back To Point Table
                        </Button>
                    </Col>
                    <Col span={2}>
                        Point Item Width
                    </Col>
                    <Col span={1}>
                        <InputNumber
                            placeholder={"Point Item Width"}
                            value={this.state.pointItemWidth}
                            onChange={(newValue)=>{
                                this.setState({
                                    pointItemWidth:newValue
                                })
                            }}
                        />
                    </Col>
                    <Col span={2}>
                        Point Item Height
                    </Col>
                    <Col span={1}>
                        <InputNumber
                            value={this.state.pointItemHeight}
                            onChange={(newValue)=>{
                                this.setState({
                                    pointItemHeight:newValue
                                })
                            }}
                        />
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col span={1}>
                        Status Map
                    </Col>
                    {
                        config.statusMap.map((Item,index)=>{
                            return(
                                <Col
                                    span={1}
                                    offset={1}

                                >
                                    <div className="Point" style={{backgroundColor:config.statusBackGroupColor[Item.value]}}>
                                        {config.statusLabelMap[Item.value]}
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
                <hr/>
                <Row>
                    <Col span={24}>
                        <table>
                            {
                                this.state.pointTable.map((lines,outsideIndex)=>{
                                    return(
                                        <tr key={outsideIndex}>
                                            {
                                                lines.map((Item,insideIndex)=>{
                                                    let component={};
                                                    switch (Item.Type){
                                                        case "Empty":
                                                        case "Plus":
                                                            component=<MindMapConnection height={this.state.pointItemHeight} shape={Item.Data} />
                                                            break;
                                                        case "Point":
                                                            let style={
                                                                backgroundColor:config.statusBackGroupColor[Item.Data.status],
                                                                width:this.state.pointItemWidth+"px"
                                                            }
                                                            if (Item.Data.ID==this.state.pid){
                                                                style.fontSize="20px";
                                                                style.textAlign="center";
                                                                style.color="gold";
                                                            }
                                                            component=<div
                                                                className={"Point"}
                                                                style={style}
                                                            >
                                                                <Tooltip
                                                                    title={Item.Data.keyword}
                                                                >
                                                        <span
                                                            onClick={()=>{
                                                                this.EditPoint(Item.Data);
                                                            }}
                                                        >
                                                            {Item.Data.keyword}
                                                        </span>
                                                                </Tooltip>
                                                            </div>
                                                            break;
                                                    }
                                                    return(
                                                        <td key={insideIndex}>
                                                            {component}
                                                        </td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </table>
                    </Col>
                </Row>
                <div>
                    <Drawer
                        visible={this.state.EditPoint.ID}
                        onClose={()=>{
                            this.EditPoint({ID:0});
                        }}
                        width={1000}
                        placement={"left"}
                    >
                        <PointEdit
                            ID={this.state.EditPoint.ID}
                        />
                    </Drawer>
                </div>
            </div>
        );
    }
}

export default PointsRoad