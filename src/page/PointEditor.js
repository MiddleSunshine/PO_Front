import React from "react";
import MenuList from "../component/MenuList";
import PointEdit from "../component/PointEdit";
import {Col, Divider, Row, InputNumber} from "antd";
import SubPointList from "../component/SubPointList";

class PointEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: props.match.params.pid,
            width:11
        }
    }
    componentDidMount() {
        document.title = "Point Edit";
    }

    render() {
        return (
            <div className={"container"}>
                <div>
                    <MenuList />
                </div>
                <br />
                <Row>
                    <Col span={24-this.state.width}>
                        <PointEdit
                            ID={this.state.ID}
                        />
                    </Col>
                    <Col span={this.state.width}>
                        <Row>
                            <InputNumber
                                value={this.state.width}
                                onChange={(newValue)=>{
                                    this.setState({
                                        width:newValue
                                    })
                                }}
                            />
                        </Row>
                        <SubPointList
                            ID={this.state.ID}
                        />
                    </Col>
                </Row>
            </div>
        );
    }

}

export default PointEditor
