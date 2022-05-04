import React from "react";
import config from "../config/setting";
import ReactECharts from 'echarts-for-react';
import {requestApi} from "../config/functions";
import {Input} from "antd";

/**
 * echart文档演示
 * https://echarts.apache.org/examples/zh/editor.html?c=sunburst-drink
 */
class Summary extends React.Component{
    constructor(props) {
        super([props]);
        this.state={
            pid:-1,
            data:[],
            connection:[],
            categories:[],
        }
        this.getData=this.getData.bind(this);
    }
    componentDidMount() {
        document.title="Summary";
    }

    getData(pid){
        if (pid<0){
            return false;
        }
        requestApi("/index.php?action=Summary&method=Index2&pid="+pid)
            .then((res)=>{
                res.json().then((json)=>{
                    let data=json.Data.point;
                    let categories=[];
                    config.statusMap.map((Item,index)=>{
                        categories.push({
                            base:Item.value,
                            name:Item.label,
                            keyword:{}
                        });
                        data.push({
                            category:Item.value,
                            name:Item.label,
                            value:Item.value
                        });
                        return Item;
                    })
                    this.setState({
                        data:data,
                        connection:json.Data.links,
                        categories:categories
                    })
                })
            })
    }
    render() {
        let option={
            legend: {
                data: config.statusMap.map((Item)=>{
                    return Item.value
                })
            },
            series: [{
                type: 'graph',
                layout: 'force',
                animation: false,
                label: {
                    normal: {
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                draggable: true,
                data:this.state.data,
                categories: this.state.categories,
                force: {
                    // initLayout: 'circular'
                    // repulsion: 20,
                    edgeLength: 5,
                    repulsion: 20,
                    gravity: 0.2
                },
                edges: this.state.connection
            }]
        };
        return (
            <div className="container">
                <Input
                    value={this.state.pid}
                    onChange={(e)=>{
                        this.setState({
                            pid:e.target.value
                        })
                    }}
                    placeholder={"set the id"}
                    onPressEnter={()=>{
                        this.getData(this.state.pid)
                    }}
                />
                {
                    this.state.pid<0
                        ?null
                        :<ReactECharts
                            option={option}
                            style={{ height: '700px', width: '100%' }}
                        />
                }

            </div>
        )
    }
}

export default Summary