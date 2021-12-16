import { Button, Col, Row,message } from "antd";
import React from "react";
import SimpleMdeReact from "react-simplemde-editor";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { requestApi } from "../config/functions";
import SummaryPoints from "./SummaryPoints";

class EditPointSummaryFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: props.match.params.ID,
            EditMode: parseInt(props.match.params.Edit) == 1,
            pointSummary: {},
            pointList: []
        }
        this.getSummaryDetail = this.getSummaryDetail.bind(this);
        this.savePointSummary = this.savePointSummary.bind(this);

    }

    componentDidMount() {
        this.getSummaryDetail(this.state.ID)
    }

    getSummaryDetail(ID) {
        if (ID) {
            requestApi("/index.php?action=PointSummary&method=Detail&ID=" + ID)
                .then((res) => {
                    res.json().then((json) => {
                        this.setState({
                            pointSummary: json.Data.PointSummary
                        })
                    })
                })
        }
    }

    savePointSummary() {
        requestApi("/index.php?action=PointSummary&method=CommonSave",{
            mode:"cors",
            body:JSON.stringify(this.state.pointSummary),
            method:"post"
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save Success !");
                    }else{
                        message.warn(json.Message);    
                    }
                })
            })
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
                <Col span={2}>
                    <Button
                        type={"primary"}
                        onClick={()=>{
                            this.savePointSummary();
                        }}
                    >
                        Save
                    </Button>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col span={17}>
                    {
                        this.state.EditMode
                            ? <SimpleMdeReact
                                value={this.state.pointSummary.file_content}
                                onChange={(newValue) => {
                                    this.setState({
                                        pointSummary: {
                                            ...this.state.pointSummary,
                                            file_content: newValue
                                        }
                                    })
                                }}
                            />
                            : <MarkdownPreview
                                source={this.state.pointSummary.file_content}
                            />
                    }
                </Col>
                <Col span={6}>
                    <SummaryPoints
                        ID={this.state.ID}
                    />
                </Col>
            </Row>
        </div>;
    }
}

export default EditPointSummaryFile;
