import React from "react";
import {requestApi} from "../config/functions";
import {Button, DatePicker, Drawer, Form, message, Select} from "antd";
import TextArea from "antd/es/input/TextArea";
import SimpleMDE from "react-simplemde-editor";
import MarkdownPreview from '@uiw/react-markdown-preview';
import moment from "moment";
import Label from "./Label";

var dateFormat = "YYYY-MM-DD HH:mm:ss";

class TodoItem extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            GTD:{},
            ID:props.ID,
            editMode:true,
            preID:props.ID,
            labelVisible:false,
            Labels:[],
            selectedLabels:[]
        }
        this.getGTD=this.getGTD.bind(this);
        this.saveGTD=this.saveGTD.bind(this);
        this.getLabels=this.getLabels.bind(this);
        this.getLabelConnection=this.getLabelConnection.bind(this);
        this.SaveLabelConnection=this.SaveLabelConnection.bind(this);
    }

    componentDidMount() {
        this.getGTD(this.state.ID);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.ID==this.state.preID){
            return false;
        }
        (async ()=>{})()
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

    switchDrawer(open){
        (async ()=>{})()
            .then(()=>{
                this.setState({
                    labelVisible:open
                })
            })
            .then(()=>{
                if (!open){
                    this.getLabels();
                }
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
                .then(()=>{
                    this.getLabels();
                })
                .then(()=>{
                    this.getLabelConnection(ID);
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
            .then(()=>{
                this.SaveLabelConnection();
            })
            .catch((error)=>{
                message.error("Error !!!")
            })
    }

    getLabelConnection(GTD_ID){
        requestApi("/index.php?action=GTDLabelConnection&method=GetGTDLabel&ID="+GTD_ID)
            .then((res)=>{
                res.json().then((json)=>{
                    let seletcedLabels=[];
                    json.Data.Connection.map((Item)=>{
                        seletcedLabels.push(Item.Label_ID)
                    });
                    this.setState({
                        selectedLabels:seletcedLabels
                    })
                })
            })
    }

    SaveLabelConnection(){
        if (this.state.GTD.ID){
            requestApi("/index.php?action=GTDLabelConnection&method=UpdateConnection",{
                method:"post",
                mode:"cors",
                body:JSON.stringify({
                    GTD_ID:this.state.GTD.ID,
                    Label_ID:this.state.selectedLabels
                })
            })
        }
    }

    getLabels(){
        requestApi("/index.php?action=GTDLabel&method=List")
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        Labels:json.Data.List
                    })
                })
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
                        label={<Button
                            type={"primary"}
                            onClick={()=>{
                                this.switchDrawer(!this.state.labelVisible);
                            }}
                        >
                            Edit Label
                        </Button>}
                    >
                        <Select
                            mode={"multiple"}
                            showSearch={true}
                            onChange={(newValue)=>{
                                this.setState({
                                    selectedLabels:newValue
                                });
                            }}
                            value={this.state.selectedLabels}
                        >
                            {
                                this.state.Labels.map((labelItem,insideIndex)=>{
                                    return(
                                        <Select.Option value={labelItem.ID} style={{backgroundColor:labelItem.Color}}>
                                            {labelItem.Label}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
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
                <div>
                    <Drawer
                        visible={this.state.labelVisible}
                        onClose={()=>{
                            this.switchDrawer(false)
                        }}
                    >
                        <Label />
                    </Drawer>
                </div>
            </div>
        );
    }

}

export default TodoItem;