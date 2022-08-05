import React from "react";
import {Button, Form, Input, List, message} from "antd";
import Links from "./Links";
import {requestApi} from "../config/functions";

class RecentPoints extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Points:[],
            Page:1,
            PageSize:100,
            SearchKeyWords:""
        }
        this.getPoints=this.getPoints.bind(this);
    }

    getPoints(page,pageSize,SearchKeyWords){
        if (page<=0){
            page=0;
        }
        requestApi("/index.php?action=Points&method=RecentPoints&page="+page+"PageSize="+pageSize,{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                keyword:SearchKeyWords
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.setState({
                            Points:json.Data.Points
                        })
                    }else{
                        message.warn(json.Message)
                    }
                })
            }).then(()=>{
                this.setState({
                    Page:page,
                    PageSize:pageSize,
                    SearchKeyWords:SearchKeyWords
                })
        })
    }

    render() {
        return <div className="container">
            <List
                header={
                <Form>
                    <Form.Item>
                        <Input
                            value={this.state.SearchKeyWords}
                            onChange={(e)=>{
                                this.setState({
                                    SearchKeyWords:e.target.value
                                })
                            }}
                            onPressEnter={()=>{
                                this.getPoints(this.state.Page,this.state.PageSize,this.state.SearchKeyWords)
                            }}
                        />
                    </Form.Item>
                </Form>
                }
                footer={
                <Form>
                    <Form.Item>
                        <Button
                            onClick={()=>{
                                this.getPoints(this.state.Page-1,this.state.PageSize,this.state.SearchKeyWords)
                            }}
                        >Pre</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            onClick={()=>{
                                this.getPoints(this.state.Page+1,this.state.PageSize,this.state.SearchKeyWords)
                            }}
                        >Next</Button>
                    </Form.Item>
                    <Form.Item>
                        <Input
                            value={this.state.PageSize}
                            onChange={(e)=>{
                                this.setState({
                                    PageSize:e.target.value
                                })
                            }}
                            onPressEnter={()=>{
                                this.getPoints(this.state.Page,this.state.PageSize,this.state.SearchKeyWords)
                            }}
                        />
                    </Form.Item>
                </Form>
                }
                dataSource={this.state.Points}
                renderItem={(point)=>{
                    return(
                        <List.Item.Meta
                            avatar={point.SearchAble}
                            key={point.ID}
                            title={point.keyword}
                            description={point.LastUpdateTime+"</br>"+point.note}
                            extra={<Links
                                PID={point.ID}
                                Color={"#1890ff"}
                            />}
                        >
                            {
                                point.keyword
                            }
                        </List.Item.Meta>
                    )
                }}
            />
        </div>
    }
}

export default RecentPoints