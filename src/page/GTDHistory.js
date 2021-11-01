import React from "react";
import {requestApi} from "../config/functions";
import {Card, Col, Row} from "antd";

class GTDHistory extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            GTDs:[]
        }
        this.getHistory=this.getHistory.bind(this);
    }

    componentDidMount() {
        this.getHistory();
    }

    getHistory(Days=7){
        requestApi("/index.php?action=GTD&method=GetGTDHistory&Days="+Days)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        GTDs:json.Data.List
                    })
                })
            })

    }

    render() {
        return <div className={"container"}>
            {
                this.state.GTDs.map((GTDS,outsideIndex)=>{
                    return(
                        <Card
                            title={GTDS.Date}
                            key={outsideIndex}
                        >
                            {GTDS.GTDs.map((GTD,insideIndex)=>{
                                if (GTD.Content){
                                    return(
                                        <Row>
                                            <Col span={24}>
                                                <Row>
                                                    <Col span={16}>
                                                        {GTD.Content}
                                                    </Col>
                                                    <Col span={4}>
                                                        {GTD.AddTime}
                                                    </Col>
                                                    <Col span={4}>
                                                        {GTD.FinishTime}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    )
                                }else{
                                    return '';
                                }
                            })}
                        </Card>
                    )
                })
            }
        </div>
    }
}

export default GTDHistory;