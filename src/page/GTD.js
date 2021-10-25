import React from "react";
import {requestApi} from "../config/functions";
import {Row, Col, Card, Checkbox, message, Input, Drawer, Divider, Switch, Modal, Button} from "antd";
import {
    CaretDownOutlined,
    CaretRightOutlined,
    MenuUnfoldOutlined,
    PlusOutlined,
    FormOutlined,
    ClearOutlined,
    CheckOutlined,
    ProfileOutlined
} from '@ant-design/icons'
import TodoItem from "../component/TodoItem";
import Hotkeys from 'react-hot-keys'
import GTDCategory from "../component/GTDCategory";
import "../css/GTD.css"
import MarkdownPreview from "@uiw/react-markdown-preview";
import moment from "moment";
import config from "../config/setting";

const DISPLAY_HIDDEN='none';
const DISPLAY_FLEX='flex';

const OPTION_SAME='Same';
const OPTION_SUB='Sub';

const ACTIVE_TYPE_TODOITEM='GTD';
const ACTIVE_TYPE_CATEGORY='Category';

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
            activeCategory:{},
            categoryDrawerVisible:false,
            activeType:"",
            createNewModalVisible:false,
            NewCategoryName:""
        }
        this.SyncData=this.SyncData.bind(this);
        this.onDragStart=this.onDragStart.bind(this);
        this.onDragOver=this.onDragOver.bind(this);
        this.onDrop=this.onDrop.bind(this);
        this.updateSameCategory=this.updateSameCategory.bind(this);
        this.hideSubGTD=this.hideSubGTD.bind(this);
        this.updateActiveGTD=this.updateActiveGTD.bind(this);
        this.closeDrawer=this.closeDrawer.bind(this);
        this.onKeyDown=this.onKeyDown.bind(this);
        this.UpdateFinishTime=this.UpdateFinishTime.bind(this);
        this.updateActiveCategory=this.updateActiveCategory.bind(this);
        this.createNewCategory=this.createNewCategory.bind(this);
        this.RecordNewCategory=this.RecordNewCategory.bind(this);
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
            activeType:ACTIVE_TYPE_TODOITEM
        });
    }

    updateActiveCategory(Category){
        this.setState({
            activeCategory:Category,
            activeType:ACTIVE_TYPE_CATEGORY
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

    UpdateOffset(ID,PID,Option){
        requestApi("/index.php?action=GTD&method=RecordOffset",{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                ID:ID,
                PID:PID,
                Option:Option
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.SyncData();
                    }
                })
            })
    }

    UpdateFinishTime(ID){
        requestApi("/index.php?action=GTD&method=UpdateFinishTime&ID="+ID)
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Checked!");
                    }else{
                        message.error("Update FinishTime Error")
                    }
                })
            }).catch((error)=>{
                message.error("System Error");
        })
    }

    NewTodoItem(ID,CategoryID){
        requestApi("/index.php?action=GTD&method=CreateNewGTD",{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                PID:ID,
                CategoryID:CategoryID
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.SyncData();
                    }
                })
            })
    }

    closeDrawer(){
        (async ()=>{})()
            .then(()=>{
                this.setState({
                    todoItemDrawerVisible:false,
                    categoryDrawerVisible:false
                })
            })
            .then(()=>{
                this.SyncData();
            })
    }

    onKeyDown(keyName,e,handler){
        let parentGTD=this.state.GTDs[this.state.activeGTDOutsideIndex].GTDS[this.state.activeGTDInsideIndex-1];
        switch (keyName){
            case "shift+n":
                switch (this.state.activeType){
                    case ACTIVE_TYPE_TODOITEM:
                        if (this.state.activeGTD.ID){
                            this.NewTodoItem(
                                this.state.activeGTD.ID,
                                this.state.activeGTD.CategoryID
                            );
                        }
                        break;
                    case ACTIVE_TYPE_CATEGORY:
                        break;
                }
                break;
            case "shift+[":
                if (!this.state.activeGTD.ID){
                    return false;
                }
                this.UpdateOffset(this.state.activeGTD.ID,parentGTD.ID,OPTION_SAME);
                break;
            case "shift+]":
                if (!this.state.activeGTD.ID){
                    return false;
                }
                this.UpdateOffset(this.state.activeGTD.ID,parentGTD.ID,OPTION_SUB);
                break;
        }
    }

    createNewCategory(modalVisible=true){
        this.setState({
            createNewModalVisible:modalVisible,
            NewCategoryName:""
        })
    }

    RecordNewCategory(){
        requestApi("/index.php?action=GTDCategory&method=NewCategory",{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                Category:this.state.NewCategoryName
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Create New Category");
                    }else{
                        message.warn("Create Failed");
                    }
                    return json.Status==1;
                })
                    .then((result)=>{
                        if (result){
                            this.SyncData();
                        }
                        return result;
                    })
                    .then((result)=>{
                        if (result){
                            this.createNewCategory(false);
                        }
                    })
                    .catch((error)=>{
                        message.error("System Error!");
                    })
            })
    }

    render() {
        return <Hotkeys
            keyName={"shift+n,shift+[,shift+]"}
            onKeyDown={(keyName,e,handler)=>{
                this.onKeyDown(keyName,e,handler);
            }}
        >
            <div className="container GTD">
                <Row
                    align={"middle"}
                    justify={"space-around"}
                >
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
                        <ClearOutlined
                            onClick={()=>{
                                this.SyncData();
                            }}
                        />
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
                                    case ACTIVE_TYPE_TODOITEM:
                                        this.setState({
                                            todoItemDrawerVisible:true
                                        });
                                        break;
                                    case "Category":
                                        this.setState({
                                            categoryDrawerVisible:true
                                        });
                                        break;
                                }
                            }}
                        />
                    </Col>
                </Row>
                <Divider> {this.state.activeType?this.state.activeType:"Welcome"} </Divider>
                <Row>
                    <Col span={4}>
                        <Row>
                            <Col span={24}>
                                {this.state.Categories.map((Item,index)=>{
                                    return(
                                        <Row>
                                            <Col span={4}>
                                                <Checkbox
                                                    defaultChecked={true}
                                                    onChange={()=>{

                                                    }}
                                                />
                                            </Col>
                                            <Col span={20}>
                                                {Item.Category}
                                            </Col>
                                        </Row>
                                    )
                                })}
                                <Row style={{marginTop:"20px"}}>
                                    <Button
                                        type={"primary"}
                                        onClick={()=>{
                                            this.createNewCategory();
                                        }}
                                    >
                                        New Category
                                    </Button>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={20}>
                        {
                            this.state.GTDs.map((Category,index)=>{
                                return (
                                    <Card
                                        title={
                                            <Row>
                                                <Col span={24}>
                                                    <Row>
                                                        <Col span={23}>
                                                            <p
                                                                style={{fontWeight:Category.ID==this.state.activeCategory.ID?"bolder":"normal",cursor:"pointer"}}
                                                                onClick={()=>{
                                                                    this.updateActiveCategory(Category)
                                                                }}
                                                            >
                                                                {Category.Category}
                                                            </p>
                                                        </Col>
                                                        <Col span={1}>
                                                            <ProfileOutlined
                                                                onClick={()=>{
                                                                    let GTDs=this.state.GTDs;
                                                                    GTDs[index].ShowNote=!GTDs[index].ShowNote;
                                                                    this.setState({
                                                                        GTDs:GTDs
                                                                    });
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {
                                                        (Category.ShowNote)
                                                        ?<Row>
                                                            <MarkdownPreview
                                                                source={GTD.note}
                                                            />
                                                            </Row>
                                                            :''
                                                    }
                                                </Col>
                                            </Row>
                                        }
                                    >
                                        {
                                            Category.GTDS.map((GTD,insideIndex)=>{
                                                let ContentSpan=21-GTD.offset;
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
                                                        style={{display:GTD.Display,color:GTD.FinishTime?"#6C6C6C":"#262626",paddingBottom:"5px",paddingTop:"5px",fontWeight:this.state.activeGTD.ID==GTD.ID?"bolder":"normal"}}
                                                        key={insideIndex}
                                                        onDrop={(e)=>this.onDrop(e,GTD.ID,GTD.CategoryID)}
                                                        onDragOver={(e)=>this.onDragOver(e,index,insideIndex)}
                                                        onClick={()=>{
                                                            this.updateActiveGTD(GTD,index,insideIndex);
                                                        }}
                                                    >
                                                        <Col span={24}>
                                                            <Row>
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
                                                                        if (nextGTD){
                                                                            this.hideSubGTD(
                                                                                nextGTD.Display==DISPLAY_FLEX,
                                                                                index,
                                                                                insideIndex
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    {leftIcon}
                                                                </Col>
                                                                <Col
                                                                    span={1}
                                                                >
                                                                    <div
                                                                        className={"CheckBox"}
                                                                        onClick={()=>{
                                                                            (async ()=>{})()
                                                                                .then(()=>{
                                                                                    let GTDs=this.state.GTDs;
                                                                                    GTDs[index].GTDS[insideIndex].FinishTime=GTDs[index].GTDS[insideIndex].FinishTime?'':moment().format(config.DateTimeStampFormat).toString();
                                                                                    this.setState({
                                                                                        GTDs:GTDs
                                                                                    });
                                                                                })
                                                                                .then(()=>{
                                                                                    this.UpdateFinishTime(GTD.ID);
                                                                                });
                                                                        }}
                                                                    >
                                                                        {
                                                                            GTD.FinishTime?<CheckOutlined />:''
                                                                        }
                                                                    </div>
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
                                                                        (async ()=>{})()
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
                                                                                autoFocus={true}
                                                                                value={this.state.activeGTD.Content}
                                                                                onChange={(e)=>{
                                                                                    this.setState({
                                                                                        activeGTD:{
                                                                                            ...this.state.activeGTD,
                                                                                            Content:e.target.value
                                                                                        }
                                                                                    })
                                                                                }}
                                                                            /> :GTD.FinishTime?
                                                                                <span style={{textDecoration:"line-through"}}>{GTD.Content}</span>
                                                                                :GTD.Content
                                                                    }
                                                                </Col>
                                                                <Col
                                                                    span={1}
                                                                >
                                                                    <ProfileOutlined
                                                                        onClick={()=>{
                                                                            let GTDs=this.state.GTDs;
                                                                            GTDs[index].GTDS[insideIndex].ShowNote=!GTDs[index].GTDS[insideIndex].ShowNote;
                                                                            this.setState({
                                                                                GTDs:GTDs
                                                                            });
                                                                        }}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            {
                                                                GTD.ShowNote
                                                                    ?<Row
                                                                        style={{backgroundColor:"#f0f0f0",minHeight:"22px",marginTop:"10px"}}
                                                                    >
                                                                        <Col span={24}>
                                                                            <MarkdownPreview
                                                                                source={GTD.note}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                    :""
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
                    <Drawer
                        visible={this.state.categoryDrawerVisible}
                        width={800}
                        onClose={()=>{
                            this.closeDrawer();
                        }}
                    >
                        <GTDCategory
                            ID={this.state.activeCategory.ID}
                        />
                    </Drawer>
                </Row>
                <Row>
                    <Modal
                        visible={this.state.createNewModalVisible}
                        title={"Create New Category"}
                        onCancel={()=>{
                            this.createNewCategory(false);
                        }}
                        onOk={()=>{
                            this.RecordNewCategory();
                        }}
                    >
                        <Input
                            value={this.state.NewCategoryName}
                            onChange={(e)=>{
                                this.setState({
                                    NewCategoryName:e.target.value
                                })
                            }}
                        />
                    </Modal>
                </Row>
            </div>
        </Hotkeys>
    }
}

export default GTD