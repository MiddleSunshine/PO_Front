import React from "react";
import {Button, Col, Comment, Divider, Drawer, Form, Input, message, Modal, Popconfirm, Row} from "antd";
import SimpleMDE from "react-simplemde-editor";
import {requestApi} from "../config/functions";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {
    ChromeOutlined,
    CloseCircleOutlined,
    SaveOutlined,
    FormOutlined
} from '@ant-design/icons';

class BookMarks extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            bookMarks:[],
            visible:props.Visible
        }
        this.closeDrawer=this.closeDrawer.bind(this);
    }

    componentDidMount() {
        this.getBookMarks();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            visible:nextProps.Visible
        })
    }

    startEditMode(index){
        let bookmarks=this.state.bookMarks;
        bookmarks[index].editMode=true;
        this.setState({
            bookmarks:bookmarks
        });
    }

    saveBookmark(index){
        let bookMark=this.state.bookMarks[index];
        requestApi("/index.php?action=BookMarkManager&method=SaveBookMark",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                Name:bookMark.Name,
                Note:bookMark.Note,
                Href:bookMark.Href
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save Success")
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    updateBookmark(index,key,value){
        let bookmarks=this.state.bookMarks;
        switch (key){
            case "Name":
                bookmarks[index]['OldName']=bookmarks[index]['Name'];
                break;
            case "editMode":
                if (!value){
                    this.saveBookmark(index);
                }
                break;
        }
        bookmarks[index][key]=value;
        this.setState({
            bookMarks:bookmarks
        })
    }

    updateBookMarkName(index){
        let bookmark=this.state.bookMarks[index];
        if (bookmark.OldName){
            requestApi("/index.php?action=BookMarkManager&method=UpdateBookMarkName",{
                method:"post",
                mode:"cors",
                body:JSON.stringify({
                    NewName:bookmark.Name,
                    OldName:bookmark.OldName
                })
            })
                .then((res)=>{
                    res.json().then((json)=>{
                        if (json.Status==1){
                            message.success("Save New Name Success !")
                        }else{
                            message.warn(json.Message)
                        }
                    })
                })
        }
    }

    getBookMarks(){
        requestApi("/index.php?action=BookMarkManager&method=BookMarkList")
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        bookMarks:json.Data.BookMarks
                    })
                })
            })
    }

    deleteBookMark(index){
        let bookmark=this.state.bookMarks[index];
        requestApi("/index.php?action=BookMarkManager&method=DeleteBookMark",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                Name:bookmark.Name
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.getBookMarks();
                    }
                })
            })
    }

    closeDrawer(){
        (async ()=>{})()
            .then(()=>{
                this.setState({
                    visible:false
                })
            })
            .then(()=>{
                this.props.afterCloseDrawer();
            })
    }

    render() {
        return <div className="container">
            <Drawer
                title={"Book Mark List"}
                visible={this.state.visible}
                width={1000}
                placement={"left"}
                onClose={()=>{
                    this.closeDrawer();
                }}
            >
                {
                    this.state.bookMarks.map((Item,index)=>{
                        return(
                            <div
                                key={index}
                                style={{borderTop:"1px solid #d9d9d9"}}
                            >
                                <Comment
                                    actions={[
                                        Item.editMode?
                                            <Button type={"link"} icon={<SaveOutlined />} onClick={()=>{this.updateBookmark(index,'editMode',false)}}></Button>
                                            :<Button type={"link"} icon={<FormOutlined />} onClick={()=>{this.updateBookmark(index,'editMode',true)}}></Button>,
                                        <Input
                                            prefix={"Name"}
                                            style={{width:"400px"}}
                                            value={Item.Name}
                                            onChange={(e)=>{
                                                this.updateBookmark(index,'Name',e.target.value);
                                            }}
                                            onPressEnter={()=>{
                                                this.updateBookMarkName(index);
                                            }}
                                        />,
                                        <div style={{width:"10px"}}></div>
                                        ,
                                        <Input
                                            prefix={"Href: "}
                                            style={{width:"400px"}}
                                            value={Item.Href}
                                            onChange={(e)=>{
                                                this.updateBookmark(index,'Href',e.target.value)
                                            }}
                                            onPressEnter={()=>{
                                                this.saveBookmark(index);
                                            }}
                                        />,
                                        <div style={{width:"10px"}}></div>,
                                        <Button
                                            href={Item.Href}
                                            target={"_blank"}
                                            type={"link"}
                                            icon={<ChromeOutlined />}
                                        >
                                        </Button>,
                                        <Popconfirm
                                            title={"Delete Check ?"}
                                            onConfirm={()=>{this.deleteBookMark(index)}}
                                        >
                                            <Button
                                                danger={true}
                                                type={"link"}
                                                icon={<CloseCircleOutlined />}
                                            >
                                            </Button>
                                        </Popconfirm>
                                    ]}
                                    content={
                                        Item.editMode
                                            ?<SimpleMDE
                                                value={Item.Note}
                                                onChange={(newValue)=>{
                                                    this.updateBookmark(index,'Note',newValue)
                                                }}
                                            />
                                            : <MarkdownPreview
                                            source={Item.Note}
                                        />
                                    }
                                />
                            </div>
                        )
                    })
                }
            </Drawer>
        </div>
    }
}

export default BookMarks

export class NewBookMark extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Name:"",
            Note:"",
            Href:"",
            modalVisible:props.Visible
        }
        this.initData=this.initData.bind(this);
        this.closeModal=this.closeModal.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            modalVisible:nextProps.Visible
        })
        this.initData();
    }

    initData(){
        this.setState({
            Name:document.title,
            Href:window.location.pathname
        })
    }

    saveNewBookMarket(){
        requestApi("/index.php?action=BookMarkManager&method=SaveBookMark",{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                Name:this.state.Name,
                Note:this.state.Note,
                Href:this.state.Href
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save Book Mark Success")
                        return true;
                    }else{
                        message.warn(json.Message);
                        return false;
                    }

                })
                    .then((result)=>{
                        if (result){
                            this.setState({
                                Name:"",
                                Note:"",
                                Href:"",
                                modalVisible:false
                            })
                        }
                    })
            })

    }

    closeModal(){
        (async ()=>{})()
            .then(()=>{
                this.setState({
                    Name:"",
                    Note:"",
                    modalVisible:false
                });
            })
            .then(()=>{
                this.props.afterCloseModal();
            })
    }

    render() {
        return <div className="container">
            <Modal
                closable={false}
                footer={null}
                title={
                    <Row>
                        <Col span={2}>
                            <Button
                                type={"primary"}
                                onClick={()=>{
                                    this.saveNewBookMarket();
                                }}

                            >
                                Save
                            </Button>
                        </Col>
                        <Col span={22}>
                            <Input
                                value={this.state.Href}
                                onChange={(e)=>{
                                    this.setState({
                                        Href:e.target.value
                                    })
                                }}
                            />
                        </Col>
                    </Row>
                }
                visible={this.state.modalVisible}
                width={1000}
                onCancel={()=>{
                    this.closeModal();
                }}
            >
                <Form>
                    <Form.Item
                    >
                        <Input
                            value={this.state.Name}
                            onChange={(e)=>{
                                this.setState({
                                    Name:e.target.value
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <SimpleMDE
                            value={this.state.Note}
                            onChange={(newValue)=>{
                                this.setState({
                                    Note:newValue
                                })
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    }
}