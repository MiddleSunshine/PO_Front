import React from 'react'
import {Tldraw} from "@tldraw/tldraw";
import {requestApi} from "../config/functions";
import {message} from "antd/es";

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
        window.document.title=this.state.ProjectName
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
                        if (json.Data.document){
                            this.setState({
                                document:JSON.parse(json.Data.document)
                            });
                        }
                    }else{
                        message.warn(json.Message)
                    }
                })
            })
    }

    saveProject(document){
        requestApi("/index.php?action=WhiteBoard&method=SaveProject",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                ProjectName:this.state.ProjectName,
                document:document
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
        console.log(this.state.document)
        return <div>
            {
                this.state.document!={}
                    ? <Tldraw
                        document={this.state.document}
                        onSaveProject={(app)=>{
                            this.saveProject(app.document);
                            return false;
                        }}
                    />
                    :<Tldraw
                        onSaveProject={(app)=>{
                            this.saveProject(app.document);
                            return false;
                        }}
                    />

            }

        </div>
    }
}

export default WhiteBoard