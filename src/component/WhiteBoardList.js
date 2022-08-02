import React from "react";
import {requestApi} from "../config/functions";
import {Button, List, message, Row, Col, Input} from "antd";
import {
    FormOutlined,
    DeleteOutlined
} from '@ant-design/icons';

class WhiteBoardList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            PID:props.PID,
            Projects:[],
            newProjectName:""
        }
        this.getProjects=this.getProjects.bind(this);
        this.deleteProject=this.deleteProject.bind(this);
        this.newProject=this.newProject.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.PID!=this.state.PID){
            this.getProjects(nextProps.PID);
        }
    }

    getProjects(PID){
        if (!PID){
            return false;
        }
        requestApi("/index.php?action=WhiteBoard&method=Projects&PID="+PID)
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.setState({
                            Projects:json.Data.Projects,
                            PID:PID
                        });
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    deleteProject(projectPath){
        if (!projectPath){
            message.warn("Can't find the project path");
            return false;
        }
        requestApi("/index.php?action=WhiteBoard&method=DeleteProject",{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                ProjectName:projectPath
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Delete Success");
                        this.getProjects(this.state.PID);
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    newProject(newProjectName){
        if (!newProjectName){
            message.warn("Please input the project name");
            return false;
        }
        requestApi("/index.php?action=WhiteBoard&method=NewProject",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                ProjectName:newProjectName,
                PID:this.state.PID
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Create New Project");
                        this.getProjects(this.state.PID);
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }



    render() {
        return <div>
            <Row>
                <Col span={24}>
                    <Input
                        value={this.state.newProjectName}
                        onChange={(e)=>{
                            this.setState({
                                newProjectName:e.target.value
                            })
                        }}
                        onPressEnter={()=>{
                            this.newProject(this.state.newProjectName)
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <List
                        dataSource={this.state.Projects}
                        renderItem={(project)=>{
                            return(
                                <List.Item
                                    key={project.FileName}
                                    actions={[
                                        <Button
                                            type={"link"}
                                            href={"/WhiteBoard/"+project.FilePath.replace(/\//g,'=')}
                                            target={"_blank"}
                                            icon={<FormOutlined />}
                                        ></Button>,
                                        <Button
                                            type={"link"}
                                            danger={true}
                                            icon={<DeleteOutlined />}
                                            onClick={()=>{
                                                this.deleteProject(project.FilePath)
                                            }}
                                        ></Button>
                                    ]}
                                >
                                    {project.FileName}
                                </List.Item>
                            )
                        }}
                    />
                </Col>
            </Row>
        </div>
    }
}

export default WhiteBoardList