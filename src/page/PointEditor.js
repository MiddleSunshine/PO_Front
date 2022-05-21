import React from "react";
import MenuList from "../component/MenuList";
import PointEdit from "../component/PointEdit";
import {Col, Divider, Row} from "antd";
import SubPointList from "../component/SubPointList";

class PointEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: props.match.params.pid
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
                    <Col span={13}>
                        <PointEdit
                            ID={this.state.ID}
                        />
                    </Col>
                    <Col span={11}>
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
