import React from "react";
import {requestApi} from "../config/functions";
import MindMapConnection from "../component/MindMap";
import config from "../config/setting";

import "../css/PointRoad.css"
import {Drawer, Tooltip} from "antd";
import PointEdit from "../component/PointEdit";

const SHOW_LENGTH=9;

class PointsRoad extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            pointTable:[],
            pid:props.match.params.pid,
            EditPoint:{},
        }
        this.getTableData=this.getTableData.bind(this);
        this.EditPoint=this.EditPoint.bind(this);
    }

    componentDidMount() {
        this.getTableData(this.state.pid);
    }

    getTableData(id){
        if (id){
            requestApi("/index.php?action=PointMindMap&method=Index&id="+id)
                .then((res)=>{
                    res.json().then((json)=>{
                        this.setState({
                            pointTable:json.Data.Table
                        })
                    })
                })
        }
    }

    EditPoint(point){
        this.setState({
            EditPoint:point
        })
    }

    render() {
        return (
            <div className="container PointRoad">
                <table>
                {
                    this.state.pointTable.map((lines,outsideIndex)=>{
                        return(
                            <tr key={outsideIndex}>
                                {
                                    lines.map((Item,insideIndex)=>{
                                        let component={};
                                        switch (Item.Type){
                                            case "Empty":
                                            case "Plus":
                                                component=<MindMapConnection shape={Item.Data} />
                                                break;
                                            case "Point":
                                                let showWord=Item.Data.keyword;
                                                if(showWord.length>SHOW_LENGTH){
                                                    showWord=showWord.slice(0,SHOW_LENGTH);
                                                    showWord=showWord+"...";
                                                }
                                                let style={
                                                    backgroundColor:config.statusBackGroupColor[Item.Data.status]
                                                }
                                                if (Item.Data.ID==this.state.pid){
                                                    style.fontSize="20px";
                                                    style.textAlign="center";
                                                    style.color="gold";
                                                }
                                                component=<div
                                                    className={"Point"}
                                                    style={style}
                                                >
                                                    <Tooltip
                                                        title={Item.Data.keyword}
                                                    >
                                                        <span
                                                            onClick={()=>{
                                                                this.EditPoint(Item.Data);
                                                            }}
                                                        >
                                                            {showWord}
                                                        </span>
                                                    </Tooltip>
                                                </div>
                                                break;
                                        }
                                        return(
                                            <td key={insideIndex}>
                                                {component}
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
                </table>
                <div>
                    <Drawer
                        visible={this.state.EditPoint.ID}
                        onClose={()=>{
                            this.EditPoint({ID:0});
                        }}
                        width={1000}
                        placement={"left"}
                    >
                        <PointEdit
                            ID={this.state.EditPoint.ID}
                        />
                    </Drawer>
                </div>
            </div>
        );
    }
}

export default PointsRoad