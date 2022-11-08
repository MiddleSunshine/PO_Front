import React from 'react'
import {
    AutoCenter,
    Avatar,
    Button,
    CapsuleTabs,
    Divider, DotLoading,
    Grid,
    Image,
    ImageViewer,
    Mask, Rate,
    Space,
    TextArea
} from "antd-mobile";
import {SmileOutline,FrownOutline,StarOutline,HeartOutline,CameraOutline} from 'antd-mobile-icons';

import "../css/Mind.css";
import {ImageUploader} from "antd-mobile/2x";
import {BUCKET_LONG_FILE, BUCKET_TEMP_FILE, uploadFile} from "../component/imageUpload";

class Mind extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            activeKey:-1,
            type:"",
            note:"",
            ImageUrl:[],
            rate:0
        }
        this.HandleUpload=this.HandleUpload.bind(this);
        this.updateType=this.updateType.bind(this);
        this.saveMind=this.saveMind.bind(this);
    }

    async HandleUpload(fileObject){
        let url=await uploadFile(BUCKET_TEMP_FILE,fileObject);
        let imageUrls=this.state.ImageUrl;
        if (url){
            imageUrls.push(url)
        }
        this.setState({
            ImageUrl:imageUrls
        });
        return {
            url:url
        }

    }

    updateType(type){
        this.setState({
            type:type
        })
    }

    saveMind(){
        // todo 这里编写保存的效果
    }

    render() {
        const TypeMap=[
            {
                component:<SmileOutline className={"Icon"} />,
                type:"Happy"
            },
            {
                component: <FrownOutline className={"Icon"} />,
                type:"Unhappy"
            },
            {
                component: <StarOutline className={"Icon"} />,
                type:"Star"
            },
            {
                component: <HeartOutline className={"Icon"} />,
                type:"Important"
            }
        ];

        return (
            <div className={"container Mind"}>
                <AutoCenter>
                <Grid columns={4} gap={10}>
                    {
                        TypeMap.map((itemType)=>{
                            return(
                                <Grid.Item>
                                    <div
                                        onClick={()=>{
                                            this.updateType(itemType.type)
                                        }}
                                        className={itemType.type+" Icon"}
                                        style={{color:this.state.type==itemType.type?'white':'black'}}
                                    >
                                        {itemType.component }
                                    </div>
                                </Grid.Item>
                            )
                        })
                    }
                </Grid>
                </AutoCenter>
                <Divider />
                <AutoCenter>
                    <div
                        className={this.state.type}
                    >
                        <Rate
                            style={{
                                '--inactive-color':"white"
                            }}
                            count={5}
                            value={this.state.rate}
                            onChange={(newValue)=>{
                                this.setState({
                                    rate:newValue
                                })
                            }}
                        />
                    </div>
                </AutoCenter>
                <Divider />
                <TextArea
                    placeholder={"Input your feeling"}
                    rows={4}
                    className={"InputNote"}
                    value={this.state.note}
                    onChange={(newValue)=>{
                        this.setState({
                            note:newValue
                        });
                    }}
                />
                <Divider />
                <AutoCenter>
                    <Button
                        size={"mini"}
                        color={"primary"}
                        onClick={()=>{
                            this.saveMind();
                        }}
                    >
                        Save
                    </Button>
                </AutoCenter>
                <Divider />
                <AutoCenter>
                    <ImageUploader
                        upload={(file)=>{
                            return this.HandleUpload(file);
                        }}>
                        <CameraOutline className={"Icon"} />
                    </ImageUploader>
                </AutoCenter>
            </div>
        );
    }
}

export default Mind