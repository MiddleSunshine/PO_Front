import React from 'react'
import {Tldraw} from "@tldraw/tldraw";
import {requestApi} from "../config/functions";
import {message} from "antd/es";
import {BUCKET_LONG_FILE, uploadFile} from "../component/imageUpload";

class WhiteBoard extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            patchAssert:false,
            document: {},
            isInitDocument:false,
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
                        let document=json.Data.document?JSON.parse(json.Data.document):false;
                        this.setState({
                            document:document,
                            isInitDocument:document==false?false:true
                        });
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
                document:JSON.stringify(document)
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
                this.state.isInitDocument
                    ? <Tldraw
                        onChangePage={(app)=>{
                            if (!this.state.patchAssert){
                                (async ()=>{})()
                                    .then(()=>{
                                        app.patchAssets(this.state.document.assets);
                                    })
                                    .then(()=>{
                                        this.setState({
                                            patchAssets:true
                                        })
                                    })
                                    .then(()=>{
                                        console.warn("Patch Success")
                                        console.log(app.document)
                                    })
                            }
                        }}
                        document={this.state.document}
                        onSaveProject={(app)=>{
                            this.saveProject(app.document);
                            return false;
                        }}
                        onAssetCreate={async (app,file,id)=>{
                            return await uploadFile(BUCKET_LONG_FILE,file);
                        }}
                    />
                    :<Tldraw
                        onSaveProject={(app)=>{
                            this.saveProject(app.document);
                            return false;
                        }}
                        onAssetCreate={async (app,file,id)=>{
                            return await uploadFile(BUCKET_LONG_FILE,file);
                        }}
                    />

            }

        </div>
    }
}

export default WhiteBoard