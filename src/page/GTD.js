import React from "react";
import {requestApi} from "../config/functions";
import {Row, Col, Card, Checkbox, message, Input, Drawer, Divider, Switch} from "antd";
import {
    CaretDownOutlined,
    CaretRightOutlined,
    MenuUnfoldOutlined,
    PlusOutlined,
    DeleteOutlined,
    FormOutlined
} from '@ant-design/icons'
import TodoItem from "../component/TodoItem";
import GTDCategory from "../component/GTDCategory";

const DISPLAY_HIDDEN='none';
const DISPLAY_FLEX='flex';

class GTD extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Categories:[],
            GTDs:[],
            activeGTD:{},
            activeGTDOutsideIndex:0,
            activeGTDInsideIndex:0,
            editGTDContentID:0,
            todoItemDrawerVisible:false,
            activeType:""
        }
        this.SyncData=this.SyncData.bind(this);
        this.onDragStart=this.onDragStart.bind(this);
        this.onDragOver=this.onDragOver.bind(this);
        this.onDrop=this.onDrop.bind(this);
        this.updateSameCategory=this.updateSameCategory.bind(this);
        this.hideSubGTD=this.hideSubGTD.bind(this);
        this.updateActiveGTD=this.updateActiveGTD.bind(this);
        this.closeDrawer=this.closeDrawer.bind(this);
    }
    componentDidMount() {
        this.SyncData();
    }

    SyncData(){
        let body={};
        requestApi("/index.php?action=GTD&method=List",{
            method:"post",
            mode:"cors",
            body:JSON.stringify(body)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        Categories:json.Data.Categories,
                        GTDs:json.Data.List
                    })
                })
            })
    }

    updateSameCategory(CategoryID,ID,PID,Option){
        requestApi("/index.php?action=GTD&method=UpdateCID",{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                CategoryID:CategoryID,
                ID:ID,
                PID:PID,
                Option:Option
            })
        })
            .then((res)=>{
                this.SyncData();
            })
    }

    onDragStart(event,ID,CategoryID,type='Same',outsideIndex,insideIndex){
        (async ()=>{})()
            .then(()=>{
                this.hideSubGTD(true,outsideIndex,insideIndex)
            })
            .then(()=>{
                event.dataTransfer.setData('GTD',JSON.stringify( {
                    ID:ID,
                    CategoryID:CategoryID,
                    Option:type
                }));
            })
    }

    onDragOver(event,outsideIndex,insideIndex){
        event.preventDefault();
    }

    onDrop(event,PID,CategoryID){
        let GTD=JSON.parse(event.dataTransfer.getData('GTD'));
        if (CategoryID==GTD.CategoryID && GTD.ID!=PID){
            this.updateSameCategory(CategoryID,GTD.ID,PID,GTD.Option);
        }
        event.preventDefault();
    }

    hideSubGTD(hide=true,outsideIndex,insideIndex){
        let GTDS=this.state.GTDs;
        let subGTD=GTDS[outsideIndex].GTDS[insideIndex];
        subGTD.offset=parseInt(subGTD.offset);
        GTDS[outsideIndex].GTDS.map((Item,index)=>{
            Item.offset=parseInt(Item.offset);
            if (index>insideIndex && Item.offset>subGTD.offset){
                if (hide){
                    Item.Display=DISPLAY_HIDDEN;
                }else{
                    Item.Display=DISPLAY_FLEX;
                }
            }
        })
        this.setState({
            GTDs:GTDS
        });
    }

    updateActiveGTD(GTD,outsideIndex,insideIndex){
        this.setState({
            activeGTD:GTD,
            activeGTDOutsideIndex:outsideIndex,
            activeGTDInsideIndex:insideIndex,
            activeType:"GTD"
        });
    }

    Update(GTD){
        requestApi("/index.php?action=GTD&method=Update",{
            method:"post",
            mode:"cors",
            body:JSON.stringify(GTD)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status!=1){
                        message.error(json.Message);
                    }
                    return json.Status;
                })
                    .then((Status)=>{
                        if (Status==1){
                            this.SyncData();
                        }
                    })
            })
    }

    closeDrawer(){
        (async ()=>{})()
            .then(()=>{
                this.setState({
                    todoItemDrawerVisible:false
                })
            })
            .then(()=>{
                this.SyncData();
            })
    }

    render() {
        return <div className="container">
            <Row>
                <Col span={1}>
                    <MenuUnfoldOutlined />
                </Col>
                <Col span={1}>
                    <PlusOutlined />
                </Col>
                <Col span={5}>
                    <Input />
                </Col>
                <Col span={1}>
                    <DeleteOutlined />
                </Col>
                <Col span={1}>
                    Category
                </Col>
                <Col span={1}>
                    <Switch />
                </Col>
                <Col span={1}>
                    TodoItem
                </Col>
                <Col span={1}>
                    <Switch />
                </Col>
                <Col span={1}>
                    Focus
                </Col>
                <Col span={1}>
                    <Switch />
                </Col>
                <Col span={1}>
                    <FormOutlined
                        onClick={()=>{
                            switch (this.state.activeType){
                                case "GTD":
                                    this.setState({
                                        todoItemDrawerVisible:true
                                    });
                                    break;
                                case "Category":

                            }
                        }}
                    />
                </Col>
            </Row>
            <Divider> GTD </Divider>
            <Row>
                <Col span={4}>
                    <Row>
                        <Col span={24}>
                            {this.state.Categories.map((Item,index)=>{
                                return(
                                    <Row>
                                        <Col span={4}>
                                            <Checkbox />
                                        </Col>
                                        <Col span={20}>
                                            {Item.Category}
                                        </Col>
                                    </Row>
                                )
                            })}
                        </Col>
                    </Row>
                </Col>
                <Col span={20}>
                    {
                        this.state.GTDs.map((Category,index)=>{
                            return (
                                <Card
                                    title={Category.Category}
                                >
                                    {
                                        Category.GTDS.map((GTD,insideIndex)=>{
                                            let ContentSpan=20-GTD.offset;
                                            let leftIcon='';
                                            let nextGTD=Category.GTDS[insideIndex+1];
                                            if (nextGTD && nextGTD.offset>GTD.offset){
                                                if (nextGTD.Display==DISPLAY_HIDDEN){
                                                    leftIcon=<CaretRightOutlined/>
                                                }else{
                                                    leftIcon=<CaretDownOutlined/>
                                                }
                                            }
                                            if (!GTD.Display){
                                                GTD.Display=DISPLAY_FLEX;
                                            }
                                            return (
                                                <Row
                                                    style={{display:GTD.Display}}
                                                    key={insideIndex}
                                                    onDrop={(e)=>this.onDrop(e,GTD.ID,GTD.CategoryID)}
                                                    onDragOver={(e)=>this.onDragOver(e,index,insideIndex)}
                                                    onClick={()=>{
                                                        this.updateActiveGTD(GTD,index,insideIndex);
                                                    }}
                                                >
                                                    <Col
                                                        span={1}
                                                        offset={GTD.offset}
                                                        draggable={true}
                                                        onDragStart={(e)=>this.onDragStart(
                                                            e,GTD.ID,
                                                            GTD.CategoryID,
                                                            'Same',
                                                            index,
                                                            insideIndex
                                                        )}
                                                        onClick={(e)=>{
                                                            e.preventDefault();
                                                            this.hideSubGTD(
                                                                nextGTD.Display==DISPLAY_FLEX,
                                                                index,
                                                                insideIndex
                                                            );
                                                        }}
                                                    >
                                                        {leftIcon}
                                                    </Col>
                                                    <Col
                                                        span={1}
                                                    >
                                                        <Checkbox />
                                                    </Col>
                                                    <Col
                                                        span={ContentSpan}
                                                        draggable={true}
                                                        onDragStart={(e)=>this.onDragStart(
                                                            e,GTD.ID,
                                                            GTD.CategoryID,
                                                            'Sub',
                                                            index,
                                                            insideIndex
                                                        )}
                                                        onClick={()=>{
                                                            this.setState({
                                                                editGTDContentID:GTD.ID
                                                            })
                                                        }}
                                                        onBlur={()=>{
                                                            (async ()=>{

                                                            })()
                                                                .then(()=>{
                                                                    this.Update(this.state.activeGTD);
                                                                })
                                                                .then(()=>{
                                                                    this.setState({
                                                                        editGTDContentID:0
                                                                    })
                                                                })
                                                        }}
                                                    >
                                                        {
                                                            this.state.editGTDContentID==GTD.ID
                                                            ?<Input
                                                                value={this.state.activeGTD.Content}
                                                                onChange={(e)=>{
                                                                    this.setState({
                                                                        activeGTD:{
                                                                            ...this.state.activeGTD,
                                                                            Content:e.target.value
                                                                        }
                                                                    })
                                                                }}
                                                                /> :GTD.Content
                                                        }
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                    }
                                </Card>
                            )
                        })
                    }
                </Col>
            </Row>
            <Row>
                <Drawer
                    visible={this.state.todoItemDrawerVisible}
                    width={800}
                    onClose={()=>{
                        this.closeDrawer();
                    }}
                >
                    <TodoItem
                        ID={this.state.activeGTD.ID}
                    />
                </Drawer>
            </Row>
            <Row>
                <Drawer>
                    <GTDCategory />
                </Drawer>
            </Row>
        </div>
    }
}

export default GTD