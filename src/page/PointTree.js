import React from "react";
import {Button, Card, Col, Drawer, Row, Tree} from "antd";
import {requestApi} from "../config/functions";
import MarkdownPreview from "@uiw/react-markdown-preview";
import PointEdit from "../component/PointEdit";
import {
    CloseOutlined,
    FormOutlined,
    UnorderedListOutlined,
    DeploymentUnitOutlined
} from '@ant-design/icons';
import MenuList from "../component/MenuList";
import "../css/PointTree.css";

class PointTree extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            PID:props.match.params.pid,
            treeData:[],
            points:[],
            selectedPoint:{},
            editPointID:-1
        }
        this.getTreeData=this.getTreeData.bind(this);
        this.newPointPreview=this.newPointPreview.bind(this);
        this.deletePointPreview=this.deletePointPreview.bind(this);
    }

    componentDidMount() {
        this.getTreeData(this.state.PID);
        document.title="Point Tree Mode";
    }

    newPointPreview(ID){
        if (this.state.selectedPoint.hasOwnProperty(ID)){
            return false;
        }
        requestApi("/index.php?action=Points&method=GetDetailWithFile&ID="+ID)
            .then((res)=>{
                res.json().then((json)=>{
                    let point=json.Data.Point;
                    point.FileContent=json.Data.FileContent;
                    let points=this.state.points;
                    let selectedPoints=this.state.selectedPoint;
                    selectedPoints[ID]=1;
                    points.unshift(point);
                    this.setState({
                        points:points,
                        selectedPoint:selectedPoints
                    })
                })
            })
    }

    deletePointPreview(ID){
        let points=this.state.points.filter((point)=>{
            return point.ID-ID!=0;
        });
        let selectedPoints=this.state.selectedPoint;
        delete selectedPoints[ID];
        this.setState({
            points:points,
            selectedPoint:selectedPoints
        })
    }

    getTreeData(PID){
        requestApi("index.php?action=PointMindMap&method=TreeMode&PID="+PID)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        treeData:json.Data.Data
                    })
                })
            })
    }

    render() {
        let height=window.screen.availHeight-200;
        return <div className="container PointTree">
            <Row>
                <Col span={24}>
                    <MenuList/>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span={6}>
                    <Tree
                        treeData={this.state.treeData}
                        checkStrictly={true}
                        checkable={true}
                        onCheck={(checkedKeys,info)=>{
                            if (info.checked){
                                this.newPointPreview(info.node.key);
                            }else{
                                this.deletePointPreview(info.node.key);
                            }
                        }}
                    />
                </Col>
                <Col 
                    span={18}
                    className={"ContentPart"}
                    style={{height:height+"px"}}
                >
                    {
                        this.state.points.map((point,outsideIndex)=>{
                            return(
                                <Card
                                    headStyle={{backgroundColor:"#f0f0f0",fontWeight:"bolder"}}
                                    key={point.ID}
                                    title={
                                        <h3
                                            onClick={()=>{
                                                this.setState({
                                                    editPointID:point.ID
                                                });
                                            }}
                                            style={{cursor:"pointer"}}
                                        >{point.keyword}</h3>
                                    }
                                    extra={
                                        <Button
                                            icon={<CloseOutlined />}
                                            type="primary"
                                            shape="circle"
                                            onClick={()=>{
                                                this.deletePointPreview(point.ID);
                                            }}
                                            size={"small"}
                                        />
                                    }
                                    actions={[
                                        <FormOutlined
                                            onClick={()=>{
                                                window.open("/point/edit/"+point.ID);
                                            }}
                                        />,
                                        <UnorderedListOutlined
                                            onClick={()=>{
                                                window.open("/pointTable/"+point.ID);
                                            }}
                                        />,
                                        <DeploymentUnitOutlined
                                            onClick={()=>{
                                                window.open("/pointRoad/"+point.ID);
                                            }}
                                        />
                                    ]}
                                >
                                    <Row>
                                        <Col span={24}>
                                            Note:{point.note}
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        <Col span={24}>
                                            <MarkdownPreview
                                                source={point.FileContent}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            )
                        })
                    }
                </Col>
            </Row>
            <Row>
                <Drawer
                    title={"Point Edit"}
                    width={800}
                    placement={"right"}
                    visible={this.state.editPointID>0}
                    onClose={()=>{
                        (async ()=>{})()
                            .then(()=>{
                                this.setState({
                                    editPointID:-1
                                });
                            }).then(()=>{
                                this.getTreeData(this.state.PID);
                        })
                    }}
                >
                    <PointEdit
                        ID={this.state.editPointID}
                    />
                </Drawer>
            </Row>
        </div>
    }
}

export default PointTree