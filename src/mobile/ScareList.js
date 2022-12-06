import React from 'react'
import TopBar from "./component/TopBar";
import { Collapse, Divider, Ellipsis } from "antd-mobile";
import { requestApi } from "../config/functions";
import '../css/ScareList.css';

class ScareList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ScareList: [],
            ScarePID: props.match.params.ScareID
        }
        this.getScareList = this.getScareList.bind(this);
    }

    componentDidMount() {
        this.getScareList(this.state.ScarePID);
    }

    getScareList(PID) {
        requestApi("/index.php?action=Scare&method=ScareList&PID=" + PID)
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        this.setState({
                            ScareList: json.Data.ScareList
                        })
                    }
                })
            })
    }

    render() {
        return <div className={"ScareList"}>
            <TopBar
                title={"Life"}
            />
            <Divider>
                <a
                    href={"/Mobile/NewScare/" + this.state.ScarePID}
                >
                    New Reason
                </a>
            </Divider>
            <Collapse>
                {
                    this.state.ScareList.map((scare) => {
                        return (
                            <Collapse.Panel
                                key={scare.ID}
                                title={
                                    <div>
                                        <Ellipsis
                                            content={scare.Scare}
                                            rows={1}
                                            expandText={'...'}
                                            collapseText={'less'}
                                        />
                                    </div>
                                }
                            >
                                <Divider>
                                    <a className={"sub_a"} href={"/Mobile/ScareList/" + scare.ID}>
                                        Sub Scare
                                    </a>
                                    &nbsp;&nbsp;&nbsp;
                                    <a className={"sub_a"} href={"/Mobile/NewScare/" + scare.ID}>
                                        New Scare
                                    </a>
                                    &nbsp;&nbsp;&nbsp;
                                    <a className={"sub_a"} href={"/Mobile/NewExplain/" + scare.ID}>
                                        New Explain
                                    </a>
                                </Divider>
                                {
                                    scare.Explains.map((explain) => {
                                        return (
                                            <div>
                                                <Ellipsis
                                                    key={explain.ID}
                                                    content={explain.ExplainData}
                                                    rows={1}
                                                    expandText={'more'}
                                                    collapseText={'less'}
                                                />
                                                <Divider />
                                            </div>
                                        )
                                    })
                                }
                            </Collapse.Panel>
                        )
                    })
                }
            </Collapse>

        </div>
    }
}

export default ScareList
