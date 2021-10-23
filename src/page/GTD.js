import React from "react";
import {requestApi} from "../config/functions";
import {Row, Col, Card, Checkbox} from "antd";

class GTD extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Categories:[],
            GTDs:[]
        }
        this.SyncData=this.SyncData.bind(this);
        this.onDragStart=this.onDragStart.bind(this);
        this.onDragOver=this.onDragOver.bind(this);
        this.onDrop=this.onDrop.bind(this);
        this.updateSameCategory=this.updateSameCategory.bind(this);
    }
    componentDidMount() {
        this.SyncData();
    }

    SyncData(){
        let body={};
        requestApi("/index.php?action=GTD&method=List",{
            method:"post",
            mode:"cors",
            body:JSON.stringify(body)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        Categories:json.Data.Categories,
                        GTDs:json.Data.List
                    })
                })
            })
    }

    updateSameCategory(CategoryID,ID,PID,Option){
        requestApi("/index.php?action=GTD&method=UpdateCID",{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                CategoryID:CategoryID,
                ID:ID,
                PID:PID,
                Option:Option
            })
        })
            .then((res)=>{
                this.SyncData();
            })
    }

    onDragStart(event,ID,CategoryID,type='Same'){
        event.dataTransfer.setData('GTD',JSON.stringify( {
            ID:ID,
            CategoryID:CategoryID,
            Option:type
        }));
    }

    onDragOver(event,outsideIndex,insideIndex){
        event.preventDefault();
    }

    onDrop(event,PID,CategoryID){
        let GTD=JSON.parse(event.dataTransfer.getData('GTD'));
        if (CategoryID==GTD.CategoryID && GTD.ID!=PID){
            this.updateSameCategory(CategoryID,GTD.ID,PID,GTD.Option);
        }
        event.preventDefault();
    }

    render() {
        return <div className="container">
            <Row>

            </Row>
            <Row>
                <Col span={4}>

                </Col>
                <Col span={20}>
                    {
                        this.state.GTDs.map((Category,index)=>{
                            return (
                                <Card
                                    title={Category.Category}
                                >
                                    {
                                        Category.GTDS.map((GTD,insideIndex)=>{
                                            let ContentSpan=20-GTD.offset;
                                            return (
                                                <Row
                                                    key={insideIndex}
                                                    onDrop={(e)=>this.onDrop(e,GTD.ID,GTD.CategoryID)}
                                                    onDragOver={(e)=>this.onDragOver(e,index,insideIndex)}
                                                >
                                                    <Col
                                                        span={1}
                                                        offset={GTD.offset}
                                                        draggable={true}
                                                        onDragStart={(e)=>this.onDragStart(e,GTD.ID,GTD.CategoryID,'Same')}
                                                    >

                                                    </Col>
                                                    <Col
                                                        span={1}
                                                    >
                                                        <Checkbox />
                                                    </Col>
                                                    <Col
                                                        span={ContentSpan}
                                                        draggable={true}
                                                        onDragStart={(e)=>this.onDragStart(e,GTD.ID,GTD.CategoryID,'Sub')}
                                                    >
                                                        {GTD.Content}
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                    }
                                </Card>
                            )
                        })
                    }
                </Col>
            </Row>
        </div>
    }
}

export default GTD