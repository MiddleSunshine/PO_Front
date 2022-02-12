import React from "react";
import MenuList from "../component/MenuList";
import PointEdit from "../component/PointEdit";

class PointEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: props.match.params.pid
        }
    }
    componentDidMount() {
        document.title = "Point Edit";
    }

    render() {
        return (
            <div className={"container"}>
                <div>
                    <MenuList />
                </div>
                <hr />
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
