import React from "react";
import {Button, DatePicker, Form, Input} from "antd";
import {requestApi} from "../config/functions";
import SimpleMDE from "react-simplemde-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";

var dateFormat = "YYYY-MM-DD HH:mm:ss";

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
                            ?<SimpleMDE
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