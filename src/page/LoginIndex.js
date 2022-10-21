import React from 'react'
import {Col, Row} from "antd";
import Login from "../component/Login";

class LoginIndex extends React.Component{
    render() {
        return <div className="container">
            <Row
                justify={"center"}
                align={"middle"}
            >
                <Col span={24}>
                    <Login />
                </Col>
            </Row>
        </div>
    }
}

export default LoginIndex