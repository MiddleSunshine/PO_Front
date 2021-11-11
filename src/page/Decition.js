import React from 'react';
import {Row, Col, Button} from "antd";
import "../css/Decision.css";

class Decition extends React.Component{
    render() {
        return <div className="container Decision">
            <Row>
                <h1>If you can't make a decision, then leave it to fate</h1>
            </Row>
            <Row>
                <Col span={6}>
                    <Row>

                    </Row>
                </Col>
                <Col span={18}>

                </Col>
            </Row>
        </div>
    }
}

export default Decition;