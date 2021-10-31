import React from "react";
import {Badge, Card, Timeline} from "antd";
import {requestApi} from "../config/functions";

class SubPointList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            points:[],
            pid:props.ID,
            preId:props.ID
        };
        this.getPoints=this.getPoints.bind(this);
    }

    componentDidMount() {
        this.getPoints(this.state.pid)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.ID!=this.state.preId){
            this.getPoints(nextProps.ID);
        }
    }


    getPoints(pid){
        let body={};
        requestApi("/index.php?action=Points&method=Index&id=" + pid, {
            method: "post",
            mode: "cors",
            body: JSON.stringify(body)
        })
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        points: json.Data.points ? json.Data.points : [],
                        pid:pid,
                        preId:pid
                    })
                })
            })
    }

    render() {
        return <div className="container">
            {
                this.state.points.map((Point,outsideIndex)=>{
                    return(
                        <Badge.Ribbon
                            text={Point.status}
                            key={outsideIndex}
                        >
                            <Card
                                title={Point.keyword}
                            >
                                <Timeline>
                                    {
                                        Point.children.map((subPoint,insideIndex)=>{
                                            return(
                                                <Timeline.Item
                                                    key={insideIndex}
                                                >
                                                    {subPoint.keyword}
                                                </Timeline.Item>
                                            )
                                        })
                                    }
                                </Timeline>
                            </Card>
                        </Badge.Ribbon>
                    )
                })
            }
        </div>;
    }
}

export default SubPointList;