import React from "react";
import {requestApi} from "../config/functions";

class PointsRoad extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            pointTable:[]
        }
        this.getTableData=this.getTableData.bind(this);
    }

    componentDidMount() {
        this.getTableData(99);
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

    render() {
        return (
            <div className="container">
                <table>
                {
                    this.state.pointTable.map((lines,outsideIndex)=>{
                        return(
                            <tr key={outsideIndex}>
                                {
                                    lines.map((Item,insideIndex)=>{
                                        let component={};
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
            </div>
        );
    }
}

export default PointsRoad