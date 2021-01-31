import React from 'react';
import { Row, Col, Form, Input, Button, Select, DatePicker } from 'antd';
// import Grid from '@/components/Grid';
import { connect } from 'dva';
// import style from "./style.less"

const Searchs = () => {


  const handleSubmit = ({address,time,sreach,sub}) => {
    console.log("fd",address,time,sreach,sub)
    dispatch({
      type:"customers/queryCustomers",
      payload:{
        filter:{
          subscribed:sub||undefined,
          search:sreach||undefined,
          country:"CN",
          date:[
            "2021-01-02",
            "2021-02-18"
          ]
        },
        page:1
      }
    })
  }
  return (
    <div style={{ margin: '10px 0 30px' }}>
      <Form onFinish={handleSubmit}>
        <Row gutter={{ xxl: 16, xl: 8, lg: 8 }} style={{ display: 'flex' }}>
          <Col>
            <Form.Item name="sub">
              <Select
                style={{ width: 140 }}
                placeholder="全部订阅状态"
                allowClear
              >
                <Select.Option value={1}>已订阅</Select.Option>
                <Select.Option value={0}>未订阅</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="address">
              <Select
                style={{ width: 140 }}
                placeholder="全部地区"
                allowClear
              >
                <Select.Option value={1}>福建</Select.Option>
                <Select.Option value={0}>安徽</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="time">
              <DatePicker.RangePicker />
            </Form.Item>
          </Col>
          <Col style={{ flex: 'auto' }}>
            <Form.Item name="sreach">
              <Input placeholder="请输入姓名/邮箱/手机" />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" >查询</Button>
          </Col>
          <Col>
            <Button>重置</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default connect((state) => ({
  set: state.user.a,
}))(Searchs);
