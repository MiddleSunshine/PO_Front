import { Button, Col, Row } from "antd";
import React from "react";
import SimpleMdeReact from "react-simplemde-editor";
import MarkdownPreview from '@uiw/react-markdown-preview';

class EditPointSummaryFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: props.match.params.ID,
            EditMode: parseInt(props.match.params.Edit) == 1,
            pointSummary: {}
        }
    }
    render() {
        return <div className={"container"}>
            <Row>
                <Col span={2}>
                    <Button
                        type={"primary"}
                        onClick={() => {
                            this.setState({
                                EditMode: !this.state.EditMode
                            })
                        }}
                    >
                        {
                            this.state.EditMode ? "Preview" : "Edit"
                        }
                    </Button>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col span={20}>
                    {
                        this.state.EditMode
                            ? <SimpleMdeReact />
                            : <MarkdownPreview />
                    }
                </Col>
                <Col span={4}>

                </Col>
            </Row>
        </div>;
    }
}

export default EditPointSummaryFile;
