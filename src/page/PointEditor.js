import React from "react";
import PointEdit from "../component/PointEdit";
import Road from "../component/road";

class PointEditor extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            ID:props.match.params.pid
        }
    }
    componentDidMount() {
        document.title="Point Edit";
    }

    render() {
        return (
            <div className={"container"}>
                <div>
                    <Road />
                </div>
                <hr/>
                <div>
                    <PointEdit
                        ID={this.state.ID}
                    />
                </div>
            </div>
        );
    }

}

export default PointEditor