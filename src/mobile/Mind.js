import React from 'react'
import {AutoCenter, Avatar, Button, CapsuleTabs, Divider, Grid, Space, TextArea} from "antd-mobile";
import {SmileOutline,FrownOutline,StarOutline,HeartOutline} from 'antd-mobile-icons';

import "../css/Mind.css";

class Mind extends React.Component {
    constructor(props) {
        super(props);
        this.state={

        }
    }

    render() {
        return (
            <div className={"container Mind"}>
                <AutoCenter>
                <Grid columns={2} gap={30}>
                    <Grid.Item>
                        <SmileOutline
                            className={"Icon"}
                            style={{backgroundColor:"#87d068"}}
                        />
                    </Grid.Item>
                    <Grid.Item>
                        <FrownOutline
                            style={{backgroundColor:"#108ee9"}}
                            className={"Icon"}
                        />
                    </Grid.Item>
                    <Grid.Item>
                        <StarOutline
                            style={{backgroundColor:"#ff8f1f"}}
                            className={"Icon"}
                        />
                    </Grid.Item>
                    <Grid.Item>
                        <HeartOutline
                            style={{backgroundColor:"#ff3141"}}
                            className={"Icon"}
                        />
                    </Grid.Item>
                </Grid>
                </AutoCenter>
                <Divider />
                <TextArea
                    placeholder={"Input your feeling"}
                    rows={8}
                />
                <Divider />
                <AutoCenter>
                    <Button
                        size={"large"}
                        color={"primary"}
                    >
                        Save
                    </Button>
                </AutoCenter>
            </div>
        );
    }
}

export default Mind