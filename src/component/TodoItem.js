import React from "react";
import {requestApi} from "../config/functions";
import {Button, DatePicker, Form, message} from "antd";
import TextArea from "antd/es/input/TextArea";
import SimpleMDE from "react-simplemde-editor";
import MarkdownPreview from '@uiw/react-markdown-preview';
import moment from "moment";

var dateFormat = "YYYY-MM-DD HH:mm:ss";

class TodoItem extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            GTD:{},
            ID:props.ID,
            editMode:true,
            preID:props.ID
        }
        this.getGTD=this.getGTD.bind(this);
        this.saveGTD=this.saveGTD.bind(this);
    }

    componentDidMount() {
        this.getGTD(this.state.ID);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.ID==this.state.preID){
            return false;
        }
        (async ()=>{})
            .then(()=>{
                this.getGTD(nextProps.ID);
            })
            .then(()=>{
                this.setState({
                    ID:nextProps.ID,
                    preID:nextProps.ID
                });
            })
    }

    getGTD(ID){
        if (ID){
            requestApi("/index.php?action=GTD&method=Detail&id="+ID)
                .then((res)=>{
                    res.json().then((json)=>{
                        this.setState({
                            GTD:json.Data
                        })
                    })
                })
        }else{
            this.setState({
                GTD:{}
            })
        }
    }

    saveGTD(){
        requestApi("/index.php?action=GTD&method=Update",{
            method:"post",
            mode:"cors",
            body:JSON.stringify(this.state.GTD)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1) {
                        message.success("Save Success");
                    }else{
                        message.error("Save Failed!")
                    }
                })
            })
            .catch((error)=>{
                message.error("Error !!!")
            })
    }

    render() {
        return (
            <div>

                <Form
                    layout={"vertical"}
                >
                    <Form.Item
                        label={<Button
                            type={"primary"}
                            onClick={()=>{
                                this.saveGTD();
                            }}
                        >
                            Save
                        </Button>}
                    >
                        <TextArea
                            value={this.state.GTD.Content}
                            onChange={(e)=>{
                                this.setState({
                                    GTD:{
                                        ...this.state.GTD,
                                        Content:e.target.value
                                    }
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Button
                                type={"primary"}
                                onClick={()=>{
                                    this.setState({
                                        editMode:!this.state.editMode
                                    })
                                }}
                            >
                                {this.state.editMode?"Save Note":"Edit Note"}
                            </Button>
                        }
                    >
                        {
                            this.state.editMode
                            ?<SimpleMDE
                                value={this.state.GTD.note}
                                onChange={(newValue)=>{
                                    this.setState({
                                        GTD:{
                                            ...this.state.GTD,
                                            note:newValue
                                        }
                                    })
                                }}
                                />
                                :<MarkdownPreview
                                    source={this.state.GTD.note}
                                />
                        }
                    </Form.Item>
                    <Form.Item
                        label={"StartTime - EndTime "}
                    >
                        <DatePicker
                            showTime={true}
                            value={this.state.GTD.StartTime?moment(this.state.GTD.StartTime,dateFormat):""}
                            onChange={(date,dateString)=>{
                                this.setState({
                                    GTD:{
                                        ...this.state.GTD,
                                        StartTime:dateString
                                    }
                                })
                            }}
                        />
                        &nbsp;&nbsp;-&nbsp;&nbsp;
                        <DatePicker
                            showTime={true}
                            value={this.state.GTD.EndTime?moment(this.state.GTD.EndTime,dateFormat):""}
                            onChange={(date,dateString)=>{
                                this.setState({
                                    GTD:{
                                        ...this.state.GTD,
                                        EndTime:dateString
                                    }
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"FinishTime"}
                    >
                        <DatePicker
                            showTime={true}
                            value={this.state.GTD.FinishTime?moment(this.state.GTD.FinishTime,dateFormat):""}
                            onChange={(date,dateString)=>{
                                this.setState({
                                    GTD:{
                                        ...this.state.GTD,
                                        FinishTime:dateString
                                    }
                                })
                            }}
                        />
                    </Form.Item>
                </Form>
            </div>
        );
    }

}

export default TodoItem;