import React from "react";
import {Button, DatePicker, Form, Input, message, Select} from "antd";
import {requestApi} from "../config/functions";
import MDEditor from '@uiw/react-md-editor';
import MarkdownPreview from "@uiw/react-markdown-preview";

var dateFormat = "YYYY-MM-DD HH:mm:ss";

const CATEGORY_STATUS_MAP=[
    {label:"Active",value:"Processing"},
    {label:"Archived",value:"Archived"}
];

class GTDCategory extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Category:{},
            ID:props.ID,
            preID:props.ID,
            editMode:false
        }
        this.getCategory=this.getCategory.bind(this);
        this.handleChange=this.handleChange.bind(this);
    }

    componentDidMount() {
        this.getCategory(this.state.ID);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.ID!=this.state.preID){
            (async ()=>{})()
                .then(()=>{
                    this.setState({
                        ID:nextProps.ID,
                        preID:nextProps.ID
                    })
                })
                .then(()=>{
                    this.getCategory(nextProps.ID);
                })
        }
    }

    SaveCategory(){
        requestApi("/index.php?action=GTDCategory&method=UpdateCategory",{
            method:"post",
            mode:"cors",
            body:JSON.stringify(this.state.Category)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save Success");
                    }else{
                        message.warn("Save Failed");
                    }
                })
            }).catch((error)=>{
                message.error("System Error");
        })
    }

    getCategory(ID){
        requestApi("/index.php?action=GTDCategory&method=Detail&id="+ID)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        Category:json.Data
                    });
                })
            })
    }

    handleChange(key,value){
        let Category=this.state.Category;
        Category[key]=value;
        this.setState({
            Category:Category
        });
    }
    render() {
        return (
            <div>
                <Form
                    layout={"vertical"}
                >
                    <Form.Item
                        label={
                            <Button
                                type={"primary"}
                                onClick={()=>{
                                    this.SaveCategory();
                                }}
                            >
                                Save
                            </Button>
                        }
                    >
                        <Input
                            value={this.state.Category.Category}
                            onChange={(e)=>{
                                this.handleChange('Category',e.target.value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Status"}
                    >
                        <Select
                            value={this.state.Category.Status}
                            onChange={(newValue)=>{
                                this.handleChange('Status',newValue);
                            }}
                        >
                            {
                                CATEGORY_STATUS_MAP.map((Item,index)=>{
                                    return(
                                        <Select.Option value={Item.value}>
                                            {Item.label}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={<Button
                            type={"primary"}
                            onClick={()=>{
                                this.setState({
                                    editMode:!this.state.editMode
                                })
                            }}
                        >
                            {this.state.editMode?"Save Note":"Edit Note"}
                        </Button>}
                    >
                        {
                            this.state.editMode
                            ?<MDEditor
                                preview={"edit"}
                                value={this.state.Category.note}
                                onChange={(newValue)=>{
                                    this.handleChange('note',newValue);
                                }}
                                />
                                :<MarkdownPreview
                                    source={this.state.Category.note}
                                />
                        }
                    </Form.Item>
                    <Form.Item
                        label={"FinishTime - EndTime"}
                    >
                        <DatePicker />
                        &nbsp;&nbsp;-&nbsp;&nbsp;
                        <DatePicker />
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default GTDCategory;