import React from 'react';
import {Input, Row, Col, Card, Button} from "antd";
import MenuList from "../component/MenuList";
import {requestApi} from "../config/functions";
import MarkdownPreview from "@uiw/react-markdown-preview";

class PointHistory extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            startTime:"",
            endTime:"",
            pointList:[],
            PID:props.match.params.pid
        }
        this.getPointList=this.getPointList.bind(this);
    }

    getPointList(startTime,endTime,PID){
        requestApi("/index.php?action=Points&method=ReviewPoint&StartTime="+startTime+"&EndTime="+endTime+"&PID="+PID)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        pointList:json.Data.Points
                    })
                })
            })
    }

    componentDidMount() {
        document.title="Point History";
    }

    render() {
        return <div className="container">
            <Row>
                <Col span={24}>
                    <MenuList />
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col span={4}>
                    <Input
                        placeholder={"Start Time"}
                        value={this.state.startTime}
                        onChange={(e)=>{
                            this.setState({
                                startTime:e.target.value
                            })
                        }}
                    />
                </Col>
                <Col span={4} offset={1}>
                    <Input
                        placeholder={"End Time"}
                        value={this.state.endTime}
                        onChange={(e)=>{
                            this.setState({
                                endTime:e.target.value
                            })
                        }}
                    />
                </Col>
                <Col span={2} offset={1}>
                    <Button
                        type={"primary"}
                        onClick={()=>{
                            this.getPointList(
                                this.state.startTime,
                                this.state.endTime,
                                this.state.PID
                            )
                        }}
                    >
                        Search
                    </Button>
                </Col>
            </Row>
            <hr />
            {
                this.state.pointList.map((point,index)=>{
                    return(
                        <Row
                            key={point.ID}
                        >
                            <Col span={24}>
                                <Card
                                    title={point.keyword}
                                >
                                    <MarkdownPreview
                                        source={point.FileContent}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    )
                })
            }

        </div>;
    }
}

export default PointHistory