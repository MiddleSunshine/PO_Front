import React from "react";
import {Card, Col, Row, Tree} from "antd";
import {requestApi} from "../config/functions";
import MarkdownPreview from "@uiw/react-markdown-preview";

class PointTree extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            PID:props.match.params.pid,
            treeData:[],
            points:[],
            selectedPoint:{}
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
                    points.push(point);
                    this.setState({
                        points:points,
                        selectedPoint:selectedPoints
                    })
                })
            })
    }

    deletePointPreview(ID){
        let points=this.state.points.filter((point)=>{
            return point.ID-ID>0;
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
        return <div className="container">
            <Row>
                <Col span={8}>
                    <Tree
                        treeData={this.state.treeData}
                        // defaultExpandAll={true}
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
                <Col span={16}>
                    {
                        this.state.points.map((point,outsideIndex)=>{
                            return(
                                <Card
                                    key={point.ID}
                                    title={point.keyword}
                                >
                                    <MarkdownPreview
                                        source={point.FileContent}
                                    />
                                </Card>
                            )
                        })
                    }
                </Col>
            </Row>
        </div>
    }
}

export default PointTree