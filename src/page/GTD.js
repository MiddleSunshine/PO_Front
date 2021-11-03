import React from "react";
import {requestApi} from "../config/functions";
import {
    Row,
    Col,
    Card,
    Checkbox,
    message,
    Input,
    Drawer,
    Divider,
    Switch,
    Modal,
    Button,
    Tag,
    Collapse, Select
} from "antd";
import {
    CaretDownOutlined,
    CaretRightOutlined,
    MenuUnfoldOutlined,
    PlusOutlined,
    FormOutlined,
    ClearOutlined,
    CheckOutlined,
    ProfileOutlined,
    NumberOutlined
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

const SHOW_FINISH_GTD_KEY='show_all_gtd_session_storage_key';
const SHOW_FINISHTIME_GTD_YES='YES';
const SHOW_FINISH_GTD_NO='NO';

var hotKeysMap=[
    {hotkey:"shift+n",label:"快速创建子任务"},
    {hotkey:"shift+[",label:"向左缩进"},
    {hotkey:"shift+]",label:"向右缩进"},
    {hotkey:"shift+e",label:"编辑当前激活行"},
    {hotkey:"shift+up",label:"向上移动激活行"},
    {hotkey:"shift+down",label:"向下移动激活行"},
    {hotkey:"shift+m",label:"折叠所有行"},
    {hotkey:"shift+s",label:"展开所有行"},
    {hotkey:"shift+q",label:"展示当前激活行的注释"},
    {hotkey:"shift+i",label:"当前激活行进入编辑状态"}
];

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
            NewCategoryName:"",
            displayCategory:true,
            labelEditGID:{},
            selectedLabels:[],
            usefulLabels:[],
        }
        this.SyncData=this.SyncData.bind(this);
        this.onDragStart=this.onDragStart.bind(this);
        this.onDragOver=this.onDragOver.bind(this);
        this.onDrop=this.onDrop.bind(this);
        this.updateSameCategory=this.updateSameCategory.bind(this);
        this.updateDiffCategory=this.updateDiffCategory.bind(this);
        this.hideSubGTD=this.hideSubGTD.bind(this);
        this.updateActiveGTD=this.updateActiveGTD.bind(this);
        this.closeDrawer=this.closeDrawer.bind(this);
        this.onKeyDown=this.onKeyDown.bind(this);
        this.UpdateFinishTime=this.UpdateFinishTime.bind(this);
        this.updateActiveCategory=this.updateActiveCategory.bind(this);
        this.createNewCategory=this.createNewCategory.bind(this);
        this.RecordNewCategory=this.RecordNewCategory.bind(this);
        this.startEditData=this.startEditData.bind(this);
        this.moveActiveRecord=this.moveActiveRecord.bind(this);
        this.handleCategoryCheckBoxChange=this.handleCategoryCheckBoxChange.bind(this);
        this.showSubGTD=this.showSubGTD.bind(this);
        this.focusMode=this.focusMode.bind(this);
        this.showGTDNote=this.showGTDNote.bind(this);
        this.getLabels=this.getLabels.bind(this);
        this.startEditLabel=this.startEditLabel.bind(this);
        this.stopEditLabel=this.stopEditLabel.bind(this);
        this.finishInput=this.finishInput.bind(this);
        this.UpdateOffsetForce=this.UpdateOffsetForce.bind(this);
        this.startInput=this.startInput.bind(this);
    }
    componentDidMount() {
        this.SyncData();
        document.title="GTD";
        this.getLabels();
    }

    SyncData(){
        let body={};
        if(sessionStorage.getItem(SHOW_FINISH_GTD_KEY)==SHOW_FINISHTIME_GTD_YES){
            body.ShowFinishTimeGTD=sessionStorage.getItem(SHOW_FINISH_GTD_KEY);
        }
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

    handleCategoryCheckBoxChange(CategoryID,e=true){
        let GTDs=this.state.GTDs;
        GTDs.map((Item)=>{
            if(Item.ID==CategoryID){
                Item.Display=e.target.checked;
            }
        });
        this.setState({
            GTDs:GTDs
        });
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

    updateDiffCategory(CategoryID,ID,PID,Option){
        requestApi("/index.php?action=GTD&method=UpdateCategory",{
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
        if (CategoryID!=GTD.CategoryID && GTD.ID!=PID){
            this.updateDiffCategory(CategoryID,GTD.ID,PID,GTD.Option);
        }
        event.preventDefault();
    }

    focusMode(focusModeOn){
        if (focusModeOn){
            let GTDs=this.state.GTDs;
            let offset,stop;
            for (let outsideIndex=0;outsideIndex<GTDs.length;outsideIndex++){
                if (GTDs[outsideIndex].GTDS[0].Display==DISPLAY_HIDDEN){
                    continue;
                }
                stop=false;
                for (let insideIndex=1;insideIndex<GTDs[outsideIndex].GTDS.length;insideIndex++){
                    if (!stop){
                        offset=parseInt(GTDs[outsideIndex].GTDS[insideIndex].offset);
                        GTDs[outsideIndex].GTDS[insideIndex].Display=(offset>0)?DISPLAY_FLEX:DISPLAY_HIDDEN;
                        if (offset==0){
                            stop=true;
                        }
                    }else{
                        GTDs[outsideIndex].GTDS[insideIndex].Display=DISPLAY_HIDDEN;
                    }
                }
            }
            this.setState({
                GTDs:GTDs
            });
        }else{
            this.showSubGTD(false);
        }
    }

    hideSubGTD(hide=true,outsideIndex,insideIndex){
        let GTDS=this.state.GTDs;
        let subGTD=GTDS[outsideIndex].GTDS[insideIndex];
        subGTD.offset=parseInt(subGTD.offset);
        let stop=false;
        GTDS[outsideIndex].GTDS.map((Item,index)=>{
            if (!stop){
                Item.offset=parseInt(Item.offset);
                if (index>insideIndex && Item.offset>subGTD.offset){
                    if (hide){
                        Item.Display=DISPLAY_HIDDEN;
                    }else{
                        Item.Display=DISPLAY_FLEX;
                    }
                }
                if (index>insideIndex && Item.offset==0){
                    stop=true;
                }
            }
        });
        this.setState({
            GTDs:GTDS
        });
    }

    showSubGTD(hide=false){
        let GTDs=this.state.GTDs;
        for (let outsideIndex=0;outsideIndex<this.state.GTDs.length;outsideIndex++){
            for (let insideIndex=1;insideIndex<this.state.GTDs[outsideIndex].GTDS.length;insideIndex++){
                if (hide){
                    if(parseInt(GTDs[outsideIndex].GTDS[insideIndex].offset)){
                        GTDs[outsideIndex].GTDS[insideIndex].Display=DISPLAY_HIDDEN;
                    }
                }else{
                    GTDs[outsideIndex].GTDS[insideIndex].Display=DISPLAY_FLEX;
                }
            }
        }
        this.setState({
            GTDs:GTDs
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

    moveActiveRecord(up=true){
        switch (this.state.activeType){
            case ACTIVE_TYPE_TODOITEM:
                if (this.state.activeGTD){
                    let newInsideIndex=parseInt(this.state.activeGTDInsideIndex)+(up?-1:+1);
                    let newOutsideIndex=parseInt(this.state.activeGTDOutsideIndex);
                    // 向上越过边界，到达上一个Category
                    if(newInsideIndex<0){
                        newOutsideIndex--;
                        if (newOutsideIndex<0){
                            newOutsideIndex=0;
                        }
                        newInsideIndex=newInsideIndex=this.state.GTDs[newOutsideIndex].GTDS.length-1;
                    }else if (!this.state.GTDs[this.state.activeGTDOutsideIndex].GTDS[newInsideIndex]){
                        // 向下越界，到达下一个Category
                        newInsideIndex=0;
                        newOutsideIndex++;
                        if (!this.state.GTDs[newOutsideIndex]){
                            newOutsideIndex=this.state.activeGTDOutsideIndex;
                        }
                    }
                    let newActiveGTD=this.state.GTDs[newOutsideIndex].GTDS[newInsideIndex];
                    if (newActiveGTD){
                        this.setState({
                            activeGTD:newActiveGTD,
                            activeGTDOutsideIndex:newOutsideIndex,
                            activeGTDInsideIndex:newInsideIndex
                        })
                    }else{
                        message.warn("Code Error");
                    }
                }
                break;
            case ACTIVE_TYPE_CATEGORY:
                debugger
                if (this.state.activeCategory){
                    let newActiveCategoryIndex=0;
                    this.state.GTDs.map((Item,outsideIndex)=>{
                        if (Item.ID==this.state.activeCategory.ID){
                            newActiveCategoryIndex=outsideIndex+(up?-1:1);
                        }
                    });
                    if (newActiveCategoryIndex<0){
                        newActiveCategoryIndex=0;
                    }else if (!this.state.GTDs[newActiveCategoryIndex]){
                        newActiveCategoryIndex=this.state.GTDs.length-1;
                    }
                    this.setState({
                        activeCategory:this.state.GTDs[newActiveCategoryIndex]
                    });
                }
                break;
        }
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

    UpdateOffsetForce(ID,Option){
        requestApi("/index.php?action=GTD&method=UpdateOffsetForce&ID="+ID+"&Option="+Option)
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.SyncData();
                    }else{
                        message.warn(json.Message)
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

    startEditData(){
        switch (this.state.activeType){
            case ACTIVE_TYPE_TODOITEM:
                if (this.state.activeGTD.ID){
                    this.setState({
                        todoItemDrawerVisible:true
                    });
                }else{
                    message.warn("Please Choose GTD Item");
                }
                break;
            case "Category":
                if(this.state.activeCategory.ID){
                    this.setState({
                        categoryDrawerVisible:true
                    });
                }else{
                    message.warn("Please Choose Category")
                }
                break;
        }
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
                        if (this.state.activeCategory.ID){
                            this.NewTodoItem(0,this.state.activeCategory.ID);
                        }
                        break;
                }
                break;
            case "shift+[":
                if (!this.state.activeGTD.ID){
                    return false;
                }
                // this.UpdateOffset(this.state.activeGTD.ID,parentGTD.ID,OPTION_SAME);
                this.UpdateOffsetForce(this.state.activeGTD.ID,OPTION_SAME);
                break;
            case "shift+]":
                if (!this.state.activeGTD.ID){
                    return false;
                }
                this.UpdateOffsetForce(this.state.activeGTD.ID,OPTION_SUB);
                // this.UpdateOffset(this.state.activeGTD.ID,parentGTD.ID,OPTION_SUB);
                break;
            case "shift+e":
                this.startEditData();
                break;
            case "shift+up":
                this.moveActiveRecord();
                break;
            case "shift+down":
                this.moveActiveRecord(false);
                break;
            case "shift+m":
                this.showSubGTD(true);
                break;
            case "shift+s":
                this.showSubGTD(false);
                break;
            case "shift+q":
                if (this.state.activeGTD.ID){
                    this.showGTDNote(this.state.activeGTDOutsideIndex,this.state.activeGTDInsideIndex);
                }
                break;
            case "shift+i":
                e.preventDefault();
                this.startInput(this.state.activeGTD);
                break;
        }
    }

    showGTDNote(outsideIndex,insideIndex){
        let GTDs=this.state.GTDs;
        GTDs[outsideIndex].GTDS[insideIndex].ShowNote=!GTDs[outsideIndex].GTDS[insideIndex].ShowNote;
        this.setState({
            GTDs:GTDs
        });
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

    removeLabel(GTD_ID,LabelID){
        if (GTD_ID && LabelID){
            requestApi("/index.php?action=GTDLabelConnection&method=DeleteConnection&GTD_ID="+GTD_ID+"&Label_ID="+LabelID)
                .then((res)=>{
                    res.json().then((json)=>{
                        if (json.Status==1){
                            message.success("Delete Label Success")
                        }else{
                            message.warn("Delete Failed");
                        }
                    })
                })
        }
    }

    getLabels(){
        requestApi("/index.php?action=GTDLabel&method=List")
            .then((res)=>{
                res.json().then((json)=>{
                    json.Data.List.map((Item)=>{
                        Item.ID=parseInt(Item.ID)
                    })
                    this.setState({
                        usefulLabels:json.Data.List
                    })
                })
            })
    }

    startEditLabel(GTD){
        let selectedLabel=[];
        GTD.Labels.map((Label)=>{
            selectedLabel.push(parseInt(Label.Label.ID));
        })
        this.setState({
            labelEditGID:GTD,
            selectedLabels:selectedLabel
        });
    }

    stopEditLabel(){
        if (this.state.labelEditGID.ID){
            requestApi("/index.php?action=GTDLabelConnection&method=UpdateConnection",{
                method:"post",
                mode:"cors",
                body:JSON.stringify({
                    GTD_ID:this.state.labelEditGID.ID,
                    Label_ID:this.state.selectedLabels
                })
            }).then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.setState({
                            labelEditGID:{},
                            selectedLabels:[]
                        })
                    }
                    return json.Status==1;
                })
                    .then((success)=>{
                        if (success){
                            this.SyncData();
                        }
                    })
            })
        }
    }

    startInput(GTD){
        if (GTD.ID){
            this.setState({
                editGTDContentID:GTD.ID
            })
        }
    }

    finishInput(){
        (async ()=>{})()
            .then(()=>{
                this.Update(this.state.activeGTD);
            })
            .then(()=>{
                this.setState({
                    editGTDContentID:0
                })
            })
    }

    render() {
        let hotKeyName=[];
        hotKeysMap.map((Item)=>{
            hotKeyName.push(Item.hotkey);
        })
        return <Hotkeys
            keyName={hotKeyName.join(",")}
            onKeyDown={(keyName,e,handler)=>{
                this.onKeyDown(keyName,e,handler);
            }}
        >
            <div className="GTD">
                <Row
                    align={"middle"}
                    justify={"space-around"}
                >
                    <Col span={1}>
                        <MenuUnfoldOutlined
                            style={{cursor:"pointer"}}
                            onClick={()=>{
                                this.setState({
                                    displayCategory:!this.state.displayCategory
                                })
                            }}
                        />
                    </Col>
                    <Col span={1}>
                        <PlusOutlined
                            onClick={()=>{
                                if (this.state.activeCategory.ID){
                                    this.NewTodoItem(0,this.state.activeCategory.ID);
                                }
                            }}
                        />
                    </Col>
                    <Col span={5}>
                        <Input
                            style={{maxHeight:"30px"}}
                        />
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
                        <Switch
                            defaultChecked={sessionStorage.getItem(SHOW_FINISH_GTD_KEY)==SHOW_FINISHTIME_GTD_YES}
                            onChange={(checked)=>{
                                (async ()=>{})()
                                    .then(()=>{
                                        sessionStorage.setItem(SHOW_FINISH_GTD_KEY,checked?SHOW_FINISHTIME_GTD_YES:SHOW_FINISH_GTD_NO);
                                    })
                                    .then(()=>{
                                        this.SyncData();
                                    })
                            }}
                        />
                    </Col>
                    <Col span={1}>
                        Focus
                    </Col>
                    <Col span={1}>
                        <Switch
                            onChange={(checked)=>{
                                this.focusMode(checked);
                            }}
                        />
                    </Col>
                    <Col span={1}>
                        <FormOutlined
                            onClick={()=>{
                                this.startEditData();
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col offset={1} span={22}>
                        <Divider> {this.state.activeType?this.state.activeType:"Welcome"} </Divider>
                        <Row
                            align={"top"}
                            justify={"space-around"}
                        >
                            {
                                this.state.displayCategory?<Col span={4}>
                                    <Row>
                                        <Col span={24}>
                                            {this.state.Categories.map((Item,index)=>{
                                                return(
                                                    <Row>
                                                        <Col span={4}>
                                                            <Checkbox
                                                                defaultChecked={true}
                                                                onChange={(checked)=>{
                                                                    this.handleCategoryCheckBoxChange(Item.ID,checked);
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
                                    <Row style={{marginTop:"10px"}}>
                                        <Collapse>
                                            {hotKeysMap.map((Item,hotkeysIndex)=>{
                                                return <Collapse.Panel key={hotkeysIndex} header={Item.hotkey}>
                                                    {Item.label}
                                                </Collapse.Panel>
                                            })}
                                        </Collapse>
                                    </Row>
                                </Col>:''
                            }
                            <Col span={this.state.displayCategory?20:24}>
                                {
                                    this.state.GTDs.map((Category,index)=>{
                                        let CategoryDisplay="block";
                                        if(Category.Display!=undefined && !Category.Display){
                                            CategoryDisplay='none';
                                        }
                                        return (
                                            <Card
                                                key={index}
                                                style={{display:CategoryDisplay}}
                                                title={
                                                    <Row
                                                        onDrop={(e)=>{
                                                            this.onDrop(e,0,Category.ID);
                                                        }}
                                                        onDragOver={(e)=>{
                                                            this.onDragOver(e,index,0);
                                                        }}
                                                    >
                                                        <Col span={24}>
                                                            <Row>
                                                                <Col span={23}>
                                                                    <h3
                                                                        style={{fontWeight:Category.ID==this.state.activeCategory.ID?"bolder":"normal",cursor:"pointer",height:"100%"}}
                                                                        onClick={()=>{
                                                                            this.updateActiveCategory(Category)
                                                                        }}
                                                                    >
                                                                        {Category.Category}
                                                                    </h3>
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
                                                                    ?<Row style={{borderTop:"1px solid #f0f0f0"}}>
                                                                        <MarkdownPreview
                                                                            source={Category.note}
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
                                                        let ContentSpan=18-GTD.offset;
                                                        let leftIcon='';
                                                        let nextGTD=Category.GTDS[insideIndex+1];
                                                        if (nextGTD && nextGTD.offset>GTD.offset){
                                                            if (nextGTD.Display==DISPLAY_HIDDEN){
                                                                leftIcon=<CaretRightOutlined/>
                                                            }else{
                                                                leftIcon=<CaretDownOutlined/>
                                                            }
                                                        }
                                                        return (
                                                            <Row
                                                                style={{display:GTD.Display,color:GTD.FinishTime?"#6C6C6C":"#262626",paddingBottom:"5px",paddingTop:"5px"}}
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
                                                                                    GTD.FinishTime?<CheckOutlined style={{fontSize:"19px"}} />:''
                                                                                }
                                                                            </div>
                                                                        </Col>
                                                                        <Col
                                                                            style={{fontWeight:this.state.activeGTD.ID==GTD.ID?"bolder":"normal"}}
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
                                                                                this.startInput(GTD);
                                                                            }}
                                                                            className={"GTDBorder"}
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
                                                                                        onBlur={()=>{
                                                                                            this.finishInput();
                                                                                        }}
                                                                                        onPressEnter={()=>{
                                                                                            this.finishInput();
                                                                                        }}
                                                                                    /> :GTD.FinishTime?
                                                                                        <span style={{textDecoration:"line-through"}}>{GTD.Content}</span>
                                                                                        :GTD.Content?
                                                                                            <span>{GTD.Content}</span>
                                                                                            :<span style={{color:"gray"}}>Plese input the content</span>
                                                                            }
                                                                        </Col>
                                                                        <Col span={2} className={"GTDBorder"}>
                                                                            {
                                                                                GTD.EndTime?
                                                                                    <Tag
                                                                                        color="red"
                                                                                    >
                                                                                        {GTD.EndTime}
                                                                                    </Tag>
                                                                                    :''
                                                                            }
                                                                        </Col>
                                                                        <Col
                                                                            span={1}
                                                                            className={"GTDBorder"}
                                                                        >
                                                                            {GTD.note
                                                                                ?<ProfileOutlined
                                                                                    onClick={()=>{
                                                                                        this.showGTDNote(index,insideIndex);
                                                                                    }}
                                                                                />
                                                                                :''
                                                                            }
                                                                        </Col>
                                                                        <Col span={1} className={"GTDBorder"}>
                                                                            <NumberOutlined
                                                                                onClick={()=>{
                                                                                    this.startEditLabel(GTD);
                                                                                }}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                    {
                                                                        this.state.labelEditGID.ID==GTD.ID
                                                                        ?<Row>
                                                                            <Col span={24}>
                                                                                <Select
                                                                                    style={{width:"100%",paddingTop:"5px"}}
                                                                                    mode={"multiple"}
                                                                                    showSearch={true}
                                                                                    value={this.state.selectedLabels}
                                                                                    onChange={(newSelectedValue)=>{
                                                                                        this.setState({
                                                                                            selectedLabels:newSelectedValue
                                                                                        });
                                                                                    }}
                                                                                    onBlur={()=>{
                                                                                        this.stopEditLabel();
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        this.state.usefulLabels.map((Item)=>{
                                                                                            return (
                                                                                                <Select.Option
                                                                                                    value={parseInt(Item.ID)}
                                                                                                    key={Item.ID}
                                                                                                    style={{backgroundColor:Item.Color}}
                                                                                                >
                                                                                                    {Item.Label}
                                                                                                </Select.Option>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </Select>
                                                                            </Col>
                                                                        </Row>
                                                                            :GTD.Labels.length>0
                                                                                ?<Row
                                                                                    align={"middle"}
                                                                                    justify={"start"}
                                                                                    style={{paddingTop:"5px"}}
                                                                                >
                                                                                    <Col
                                                                                        offset={2+parseInt(GTD.offset)}
                                                                                        span={15-parseInt(GTD.offset)}
                                                                                    >
                                                                                        {GTD.Labels.map((labelConnection,labelIndex)=>{
                                                                                            return <Tag
                                                                                                key={labelIndex}
                                                                                                color={labelConnection.Label.Color}
                                                                                                closable={true}
                                                                                                onClose={()=>{
                                                                                                    this.removeLabel(GTD.ID,labelConnection.Label.ID)
                                                                                                }}
                                                                                            >
                                                                                                {labelConnection.Label.Label}
                                                                                            </Tag>
                                                                                        })}
                                                                                    </Col>
                                                                                </Row>
                                                                                :''
                                                                    }
                                                                    {
                                                                        GTD.ShowNote
                                                                            ?<Row
                                                                                className={"NotePart"}
                                                                            >
                                                                                <Col span={22-GTD.offset} offset={2+parseInt(GTD.offset)}>
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