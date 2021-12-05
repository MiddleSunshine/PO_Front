import { Button, Col, Divider, Drawer, Row } from "antd";
import React from "react";
import PointSummaryEdit from "../component/PointSummaryEdit";
import Road from "../component/road";

class PointSummary extends React.Component{
    constructor(props){
        super(props);
        this.state={
            EditPointID:0
        }
    }
    componentDidMount(){
        document.title="Point Summary"
    }
    render(){
        return <div className="container">
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