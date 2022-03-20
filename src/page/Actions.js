import React from "react";
import MenuList from "../component/MenuList";

class Actions extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            actions:[]
        }
    }

    getActions(startTime=''){

    }

    render() {
        return (
            <div className={"container"}>
                <MenuList />
            </div>
        );
    }

}

export default Actions