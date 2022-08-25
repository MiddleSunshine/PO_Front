import React from 'react';
import { Row, Col, Avatar, message } from 'antd';
import {
  HeartOutlined
} from '@ant-design/icons'
import { requestApi } from '../config/functions';

class ClockInMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      message: ""
    }
    this.startWork = this.startWork.bind(this);
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
              message: "Checked @ "+json.Data.working_hours
            })
          }
        })
      }).then(() => {
      this.setState({
        checked: true
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
        <Col
          onClick={ () => {
            this.startWork();
          } }
        >
          <Avatar
            style={ { backgroundColor: this.state.checked ? "#ff4d4f" : "gray" } }
            size={ { xs: 300, sm: 300, md: 300 } }
            icon={ <HeartOutlined /> }
          />
        </Col>
      </Row>
    </div>
  }
}

export default ClockInMobile
