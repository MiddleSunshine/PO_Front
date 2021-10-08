import React from 'react'
import Point from "../component/point";
import {Card,Select,Row,Col,Button,message,Switch,Tooltip,Modal} from "antd";
import "./../css/Collector.css"
import {SaveOutlined,PlusCircleOutlined,DeleteOutlined,HeartOutlined,FileMarkdownOutlined} from '@ant-design/icons';
import config from "../config/setting";
import Road from "../component/road";
import {requestApi} from "../config/functions";
const { Option } = Select;
const { confirm } = Modal;

class Collector extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            id:props.match.params.pid,
            statusFilter:['new','solved'],
            parentPoint:{
                id:props.match.params.pid,
                AddTime:'',
                LastUpdateTime:'',
                file:'',
                url:'',
                keyword:''
            },
            points:[
                // {
                //     id:0,
                //     keyword:'输入内容',
                //     status:'solved',
                //     children:[
                //         {
                //             id:0
                //         }
                //     ]
                // }
            ],
            statusBackGroupColor:config.statusBackGroupColor,
            statusMap:config.statusMap
        }
        this.newSubPoint=this.newSubPoint.bind(this);
        this.newPoint=this.newPoint.bind(this);
        this.savePoint=this.savePoint.bind(this);
        this.deletePoint=this.deletePoint.bind(this);
        this.openNewPage=this.openNewPage.bind(this);
        this.showMoreFile=this.showMoreFile.bind(this);
        this.handleInputChange=this.handleInputChange.bind(this);
        this.handleSelectorChange=this.handleSelectorChange.bind(this);
        this.getPointsByPID=this.getPointsByPID.bind(this);
        this.getPointDetail=this.getPointDetail.bind(this);
        this.filterPoint=this.filterPoint.bind(this);
        this.changeFavourite=this.changeFavourite.bind(this);
    }
    componentDidMount() {
        this.getPointsByPID(this.state.id);
        this.getPointDetail(this.state.id);
    }
    changeFavourite(index=0,addFavorite='Favourite'){
        (async ()=>{
            let points=this.state.points;
            points[index].Favourite=addFavorite;
            this.setState({
                points:points
            });
            return points[index].ID ?? 0;
        })().then((ID)=>{

        })
    }
    // 初始化页面
    getPointsByPID(pid){
        requestApi("/index.php?action=Points&method=Index&id="+pid,{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                status:this.state.statusFilter.join(",")
            })
        })
            .then((res)=>{
            res.json().then((json)=>{
                this.setState({
                    points:json.Data.points?json.Data.points:[]
                })
            })
        })
    }
    getPointDetail(id){
        if (id){
            requestApi("/index.php?action=Points&method=GetAPoint&id="+id)
                .then((res)=>{
                    res.json().then((json)=>{
                        this.setState({
                            parentPoint:json.Data
                        })
                    })
                })
        }
    }
    // 创建新的孩子节点
    newSubPoint(pid,index){
        let points=this.state.points;
        let newSubPointItem={
            ID:0,
            pid:0,
            status:'init'
        };
        points[index].children.push(newSubPointItem);
        this.setState({
            points:points
        });
    }
    // 创建新的兄弟节点
    newPoint(){
        var newPoint={
            ID:0,
            pid:0,
            keyword:'',
            status:'init',
            children:[]
        };
        newPoint.pid=this.state.id;
        let points=this.state.points;
        points.push(newPoint);
        this.setState({
            points:points
        })
    }
    // 处理兄弟节点的输入框修改
    handleInputChange(event,index){
        let points=this.state.points;
        points[index].keyword=event.target.value;
        this.setState({
            points:points
        });
    }
    // 处理兄弟节点的select框修改
    handleSelectorChange(newStatus,index){
        let points=this.state.points;
        if (!points[index].ID){
            points[index].status=newStatus;
            this.setState({
                points:points
            });
        }else{
            (async ()=>{
                let points=this.state.points;
                points[index].status=newStatus;
                this.setState({
                    points:points
                });
            })().then(
                ()=>{
                    this.savePoint(index);
                }
            );
        }
    }
    // 处理分值修改
    handlePointChange(event,index){
        let points=this.state.points;
        points[index].Point=event.target.value;
        this.setState({
            points:points
        });
    }
    // 保存效果
    savePoint(index,forceUpdate=false){
        let point=this.state.points[index];
        if (point.status==='init'){
            point.status='new';
        }
        requestApi(
            "/index.php?action=Points&method=Save",
            {
                method:"post",
                mode:"cors",
                body:JSON.stringify({
                    point,
                    PID:this.state.id,
                    forceUpdate:forceUpdate
                })
            }
        )
            .then((res)=>{
                res.json().then((json)=>{
                    if (!json.Status){
                        confirm({
                            title: "Point Exists",
                            content:<a href={"/point/edit/"+json.Data.LastID} target={"_blank"}>
                                Check Detail : ID:{json.Data.LastID}
                            </a>,
                            onOk:()=>this.savePoint(index,true)
                        })
                    }else{
                        point.ID=json.Data.ID;
                        let points=this.state.points;
                        message.success("Update Success!");
                        points[index]=point;
                        this.setState({
                            points:points
                        })
                    }
                })
            })
    }
    // 删除节点
    deletePoint(index,force=false){
        let point=this.state.points[index];
        if (point.ID){
            (async ()=>{
                let points=this.state.points;
                points[index].Deleted=1;
                this.setState({
                    points:points
                });
            })().then(()=>{
                this.savePoint(index);
            });
        }else{
            let points=this.state.points.filter((Item,i)=>{
                return i!==index;
            });
            this.setState({
                points:points
            });
        }
    }
    // 打开新的页面
    openNewPage(index){
        let point=this.state.points[index];
        if(!point.ID){
            message.error("Please Save First");
            return false;
        }
        window.open("/points/"+point.ID);
    }
    filterPoint(value){
        (async ()=>{
            this.setState({
                statusFilter:value
            });
        })().then(()=>{
            this.getPointsByPID(this.state.id);
        })
    }
    showMoreFile(){

    }
    render() {
        return(
            <div className="container">
                <Road />
                <hr/>
                <Row>
                    <h1>keyword:{this.state.parentPoint.keyword}</h1>
                </Row>
                <hr/>
                <Row
                    style={{backgroundColor:config.statusBackGroupColor[this.state.parentPoint.status],padding:"10px"}}
                    justify="start" align="top"
                >
                    <Col span={8}>
                        <Row>
                            <a href={"/point/edit/"+this.state.parentPoint.ID} target={"_blank"}>ID:{this.state.parentPoint.ID}</a>
                        </Row>
                        <Row>Point:{this.state.parentPoint.Point}</Row>
                        <Row>Status:{this.state.parentPoint.status}</Row>
                    </Col>
                    <Col span={8}>
                        <Row>AddTime:{this.state.parentPoint.AddTime}</Row>
                        <Row>LastUpdateTime:{this.state.parentPoint.LastUpdateTime}</Row>
                    </Col>
                    <Col span={8}>
                        {
                            this.state.parentPoint.file?
                                <Row>
                                    File:<span>{this.state.parentPoint.file}</span>
                                </Row>
                                :''
                        }
                        {
                            this.state.parentPoint.url?
                                <Row>
                                    Url:<a href={this.state.parentPoint.url} target={"_blank"}>&nbsp;open new page</a>
                                </Row>
                                :''
                        }
                    </Col>
                </Row>
                <hr/>
                {
                    this.state.parentPoint.note?
                        <Row>
                            <Row>
                                Note:{this.state.parentPoint.note}
                            </Row>
                        </Row>
                        :''
                }
                <hr/>
                <Row
                    justify="start" align="middle"
                >
                    <Col span={3}>
                        <Button
                            icon={<PlusCircleOutlined/>}
                            type={"primary"}
                            onClick={()=>this.newPoint()}
                        >
                            New Point
                        </Button>
                    </Col>
                    <Col span={2}>Status Filter</Col>
                    <Col span={7}>
                        <Select
                            style={{width:"100%"}}
                            mode="multiple"
                            defaultValue={this.state.statusFilter}
                            onChange={(value)=>this.filterPoint(value)}
                        >
                            {this.state.statusMap.map((Item)=>{
                                return(
                                    <Option value={Item.value} key={Item.value}>{Item.label}</Option>
                                )
                            })}
                        </Select>
                    </Col>
                </Row>
                <hr/>
                {this.state.points.map((Item,outsideIndex)=>{
                    let backgroundColor=this.state.statusBackGroupColor[Item.status];
                    return(
                        <Card
                            style={{backgroundColor:backgroundColor}}
                            key={outsideIndex}
                            className={"Collector"}
                            title={
                                <Row justify={"center"} align={"middle"} wrap={false} style={{padding:"5px"}}>
                                    <textarea
                                        value={Item.keyword}
                                        onChange={(e)=>this.handleInputChange(e,outsideIndex)}
                                    />
                                </Row>
                            }
                        >
                            <Card
                                className={"actions"}
                                style={{backgroundColor:backgroundColor}}
                            >
                                <Card.Grid
                                    className={"icons"}
                                    onClick={()=>this.openNewPage(outsideIndex)}
                                >
                                    <Tooltip
                                        title={"open new page"}
                                    >
                                        <Button type={"link"}>ID:{Item.ID}</Button>
                                    </Tooltip>
                                </Card.Grid>
                                <Card.Grid className={"icons"}>
                                    <input
                                        value={Item.Point}
                                        style={{width:"100%"}}
                                        placeholder={"Point"}
                                        onChange={(e)=>this.handlePointChange(e,outsideIndex)}
                                    />
                                </Card.Grid>
                                <Card.Grid
                                    className={"icons"}
                                    onClick={()=>this.changeFavourite(outsideIndex,Item.Favourite===''?'Favourite':'')}
                                >
                                    <Tooltip
                                        title={"Add To Favourite"}
                                    >
                                        {
                                            Item.Favourite==='Favourite'
                                            ?<HeartOutlined style={{color:"red"}} />
                                            :<HeartOutlined  />
                                        }

                                    </Tooltip>
                                </Card.Grid>
                                <Card.Grid
                                    className={"icons"}
                                    onClick={()=>this.newSubPoint(Item.ID,outsideIndex)}
                                >
                                    <Tooltip
                                        title={"create new sub point"}
                                    >
                                        <PlusCircleOutlined/>
                                    </Tooltip>
                                </Card.Grid>
                                <Card.Grid
                                    className={"icons"}
                                    onClick={()=>this.savePoint(outsideIndex)}
                                >
                                    <Tooltip
                                        title={"Save"}
                                    >
                                        <SaveOutlined/>
                                    </Tooltip>
                                </Card.Grid>
                                <Card.Grid>
                                    <Select
                                        value={Item.status}
                                        className={Item.status}
                                        onChange={(value)=>this.handleSelectorChange(value,outsideIndex)}
                                    >
                                        {this.state.statusMap.map((Item)=>{
                                            return(
                                                <Option value={Item.value} key={Item.value}>{Item.label}</Option>
                                            )
                                        })}
                                    </Select>
                                </Card.Grid>
                                <Card.Grid
                                    className={"icons"}
                                    onClick={()=>this.deletePoint(outsideIndex)}
                                >
                                    <Tooltip
                                        color={"red"}
                                        title={"Delete the Point"}
                                    >
                                        <DeleteOutlined/>
                                    </Tooltip>
                                </Card.Grid>
                                <Card.Grid className={"icons"}>
                                    <Tooltip
                                        title={"Show/Hide the sub points"}
                                    >
                                        <Switch
                                            checkedChildren={"detail"}
                                            unCheckedChildren={"hide"}
                                            defaultChecked
                                            value={Item.showDetail?Item.showDetail:true}
                                            onChange={(newValue)=>{
                                                let points=this.state.points;
                                                points[outsideIndex].showDetail=newValue;
                                                this.setState({
                                                    points:points
                                                });
                                            }}
                                        />
                                    </Tooltip>
                                </Card.Grid>
                                <Card.Grid className={"icons"}>
                                    <Tooltip title={"Open Edit Page"}>
                                        <Button
                                            icon={<FileMarkdownOutlined />}
                                            type={"link"}
                                            href={"/point/edit/"+Item.ID}
                                            target={"_blank"}
                                        >
                                        </Button>
                                    </Tooltip>
                                </Card.Grid>
                            </Card>
                            {(Item.showDetail===undefined?true:Item.showDetail)?Item.children.map((childItem,index)=>{
                                return(
                                    <Point
                                        key={index}
                                        pid={Item.ID}
                                        id={childItem.ID}
                                    />
                                )
                            }):''}
                        </Card>
                    )
                })}
            </div>
        )
    }
}

export default Collector