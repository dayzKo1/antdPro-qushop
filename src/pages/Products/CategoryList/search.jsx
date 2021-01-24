import React from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
// import Grid from '@/components/Grid';
import { connect } from 'dva';
// import style from "./style.less"

class Searchs extends React.Component {
  render() {
    return (
      <div style={{ margin: '10px 0 30px' }}>
        <Form>
          <Row gutter={{ xxl: 16, xl: 8, lg: 8 }} style={{ display: 'flex' }}>
            {/* <Col>
							<Form.Item name="subscription">
								<Select
									style={{ width: 140 }}
									placeholder="全部订阅状态"
									allowClear
								// onChange={this.changeOrderStatus}
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
								// onChange={this.changeOrderStatus}
								>
									<Select.Option value={1}>福建</Select.Option>
									<Select.Option value={0}>安徽</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col>
							<Form.Item name="range-picker">
								<DatePicker.RangePicker />
							</Form.Item>
						</Col> */}
            <Col xs={10} style={{ flex: 'auto' }}>
              <Form.Item name="range-picker">
                <Input placeholder="请输入分类名称" />
              </Form.Item>
            </Col>
            <Col xs={2}>
              <Button>查询</Button>
            </Col>
            <Col>
              <Button>重置</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default connect((state) => ({
  set: state.user.a,
}))(Searchs);
