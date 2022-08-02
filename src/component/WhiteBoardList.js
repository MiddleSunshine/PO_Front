import React from "react";
import {requestApi} from "../config/functions";
import {message} from "antd/es";
import {Button, List} from "antd";
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
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.PID!=this.state.PID){
            this.getProjects(nextProps.PID);
        }
    }

    getProjects(PID){
        requestApi("/index.php?action=WhiteBoard&mehtod=Projects&PID="+PID)
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



    render() {
        return <div>
            <List
                dataSource={this.state.Projects}
                renderItem={(project)=>{
                    return(
                        <List.Item
                            key={project.FileName}
                            actions={[
                                <Button
                                    type={"link"}
                                    href={"/WhiteBoard/"+project.FilePath}
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
                        />
                    )
                }}
            />
        </div>
    }
}

export default WhiteBoardList