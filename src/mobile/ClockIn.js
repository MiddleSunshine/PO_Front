import React from 'react';
import { Row, Col, Avatar, message, Divider } from 'antd';
import {
  LoginOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { requestApi } from '../config/functions';

class ClockInMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      offWorkChecked: false,
      message: ""
    }
    this.startWork = this.startWork.bind(this);
    this.endWork = this.endWork.bind(this);
  }

  startWork() {
    requestApi("index.php?action=ClockIn&method=StartWork")
      .then((res) => {
        res.json().then((json) => {
          if (json.Status == 1) {
            message.success("Check In Succss");
          } else {
            // message.warn(json.Message);
            this.setState({
              message: "Checked @ " + json.Data.working_hours
            })
          }
        })
      }).then(() => {
      this.setState({
        checked: true
      })
    })
  }

  endWork() {
    requestApi("/index.php?action=ClockIn&method=FinishWork")
      .then((res) => {
        res.json().then((json) => {
          if (json.Status == 1) {
            message.success("工作一天辛苦了，请尽情享受下班的自由时间");
          } else {
            message.error(json.Message);
          }
        })
      })
      .then(()=>{
        this.setState({
          offWorkChecked:true
        })
      })
  }

  render() {
    return <div
      className="container"
    >
      <Row
        align={ "middle" }
        justify={ "center" }
      >
        { this.state.message }
      </Row>
      <Row
        style={ { height: "100vh" } }
        align={ "middle" }
        justify={ "center" }
      >
        <Col>
          <Divider>Start Work</Divider>
          <div
            onClick={ () => {
              this.startWork();
            } }
          >
            <Avatar
              style={ { backgroundColor: this.state.checked ? "#ff4d4f" : "gray" } }
              size={ { xs: 300, sm: 300, md: 300 } }
              icon={ <LoginOutlined /> }
            />
          </div>
          <Divider>Off Work</Divider>
          <div
            onClick={ () => {
              this.endWork();
            } }
          >
            <Avatar
              style={ { backgroundColor: this.state.offWorkChecked ? "#ff4d4f" : "gray" } }
              size={ { xs: 300, sm: 300, md: 300 } }
              icon={ <LogoutOutlined /> }
            />
          </div>
        </Col>
      </Row>
    </div>
  }
}

export default ClockInMobile
