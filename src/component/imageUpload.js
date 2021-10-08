import React from "react";
import {Row, Col, Input} from 'antd';
import {fetch} from "whatwg-fetch";

class ImageUpload extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            localImageUrl:'',
            fileObject:{}
        }
        this.handlePaste=this.handlePaste.bind(this);
    }
    componentDidMount() {
        document.addEventListener(
            "paste",
            (e)=>{
                this.handlePaste(e);
            }
        );
    }

    handlePaste(event){
        switch (event.clipboardData.items[0].kind){
            case "string":
                break;
            case "file":
                (async ()=>{})()
                    .then(()=>{
                        return event.clipboardData.items[0].getAsFile()
                    }).then((file)=>{
                        let format=new FormData();
                        format.append("myfile",file);
                        fetch("http://"+document.domain+":8091/uploadImage.php",{
                            method:"post",
                            mode:"cors",
                            body:format
                        })
                            .then((res)=>{
                                debugger
                            })
                })
                break;
            default:

        }
    }

    render() {
        return <div className="container">
            <Row>
                {
                    this.state.localImageUrl
                        ?<image src={this.state.localImageUrl} />
                        :''
                }
            </Row>
        </div>;
    }
}

export default ImageUpload;