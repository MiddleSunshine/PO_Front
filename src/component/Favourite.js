import React from "react";
import {requestApi} from "../config/functions";

class Favourite extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            favouritePoints:[]
        }
        this.getFavourite=this.getFavourite.bind(this);
    }

    getFavourite() {
        requestApi("/index.php?action=Points&method=GetFavouritePoints")
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        favouritePoints: json.Data
                    })
                })
            })
    }

    render() {
        return null
    }
}

export default Favourite