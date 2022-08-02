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
            ProjectName:props.match.params.ProjectName.replace(/=/g,'/')
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
                        if (json.Data.document.length){
                            this.setState({
                                document:JSON.parse(json.Data.document)
                            });
                        }
                    }else{
                        message.warn(json.Message)
                    }
                })
                    .then(()=>{
                        console.log(this.state.document)
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
            {
                this.state.document.length
                    ? <Tldraw
                        document={this.state.document}
                        onChange={(app)=>{
                            this.setState({
                                document:app.document
                            })
                        }}
                        onSaveProject={(app)=>{
                            this.saveProject();
                            return false;
                        }}
                    />
                    :<Tldraw
                        onChange={(app)=>{
                            this.setState({
                                document:app.document
                            })
                        }}
                        onSaveProject={()=>{
                            this.saveProject();
                            return false;
                        }}
                    />

            }

        </div>
    }
}

export default WhiteBoard