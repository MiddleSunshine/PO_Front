import React from 'react';
import {Row} from "antd";

class PointHistory extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            startTime:"",
            endTime:"",
            pointList:[]
        }
    }
    render() {
        return <div className="container">
            <Row>

            </Row>
            <Row>

            </Row>
        </div>;
    }
}

export default PointHistory