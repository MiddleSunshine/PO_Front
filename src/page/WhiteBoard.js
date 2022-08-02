import React from 'react'
import {Tldraw} from "@tldraw/tldraw";
import {requestApi} from "../config/functions";
import {message} from "antd/es";
import {Button} from "antd";

class WhiteBoard extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            document:{},
            ProjectName:props.match.params.ProjectName
        }
        this.getDocument=this.getDocument.bind(this);
        this.saveProject=this.saveProject.bind(this);
    }

    componentDidMount() {
        this.getDocument(this.state.ProjectName);
    }

    getDocument(filePath){
        requestApi("/index.php?action=WhiteBoard&method=ProjectDetail",{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                ProjectName:filePath
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.setState({
                            document:JSON.parse(json.Data.document)
                        });
                    }else{
                        message.warn(json.Message)
                    }
                })
            })
    }

    saveProject(){
        requestApi("/index.php?action=WhiteBoard&method=SaveProject",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                ProjectName:this.state.ProjectName,
                document:this.state.document
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save Success");
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    render() {
        return <div>
            <Button
                type={"primary"}
                onClick={()=>{
                    this.saveProject();
                }}
            >
                Save Project
            </Button>
            <hr/>
            <Tldraw
                document={this.state.document}
                onChange={(app)=>{
                    this.setState({
                        document:app.document
                    })
                }}
            />
        </div>
    }
}

export default WhiteBoard