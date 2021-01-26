import React, { Component } from 'react';
import { Card, Table, Row, Col, Select, Input, Button } from 'antd';
import { connect } from 'dva';
import defaultImg from '@/assets/defaultImg.png';
// import { PageContainer } from '@ant-design/pro-layout';
import BasicHeader from '@/components/BasicHeader';
import style from './style.less';

const { Option } = Select;

@connect(({ product, tag, loading }) => ({
  productsList: product.productsList,
  tagsList: tag.tagsList,
  productLoading: loading.effects['product/fetch'],
  tagLoading: loading.effects['tags/fetchProTags'],
  categoryLoading: loading.effects['categories/fetchList'],
}))
class ProducstList extends Component {
  state = {
    tag: undefined,
    category: undefined,
    search: undefined,
    status: undefined,
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch({ type: 'product/fetch' });
    await dispatch({
      type: 'tag/fetch',
      payload: {
        page: 1,
        sort: 'name',
      },
    });
  }

  handleSearch = (value) => {
    if (value) {
      fetch(value, (data) => this.setState({ data }));
    } else {
      this.setState({ data: [] });
    }
  };

  handleChange = (value) => {
    this.setState({ value });
  };

  // 保存搜索信息
  saveSearch = (e) => {
    console.log(e.target.value);
    this.setState({
      search: e.target.value,
    });
  };

  search = async () => {
    const { search } = this.state;
    console.log('--', search);
    const { dispatch } = this.props;
    await dispatch({
      type: 'product/fetch',
      payload: {
        'filter[search]': search,
      },
    });
  };

  render() {
    const columns = [
      {
        title: '商品',
        dataIndex: 'title',
        render: (title, r) => (
          <>
            <Row>
              <Col span={4}>
                <div
                  style={{
                    height: 50,
                    width: 50,
                    margin: 0,
                    border: '1px solid #dadde4',
                    backgroundSize: '100% 100%',
                    backgroundImage: `url(${r.image || defaultImg})`,
                  }}
                />
              </Col>
              <Col span={20}>
                <span>{title}</span>
              </Col>
            </Row>
          </>
        ),
      },
      {
        title: '分类',
        dataIndex: 'categories',
      },
      {
        title: '状态',
        dataIndex: 'post_status',
        render: (v, r) => (
          <>
            {r.post_status === 'publish' && <div>上架中</div>}
            {r.post_status === 'private' && <div>已下架</div>}
          </>
        ),
      },
      {
        title: '操作',
        // dataIndex: 'address',
        align: 'right',
        render: () => <div className={style.link}>编辑</div>,
      },
    ];

    const { productLoading, tagLoading, tagsList = {}, productsList } = this.props;
    const { tag, category, search, status } = this.state;
    const tagOptions =
      tagsList?.data?.length > 0 && tagsList?.data.map((d) => <Option key={d.id}>{d.name}</Option>);
    console.log('search', search);
    return (
      // <PageContainer>
      <>
        <BasicHeader title="商品列表" />
        <Card className={style.cardbox}>
          <Row gutter={15} style={{ marginBottom: 10 }}>
            <Col span={4}>
              <Select
                style={{ width: '100%' }}
                showSearch
                value={category}
                placeholder="选择分类"
                allowClear
                onChange={this.handleChange}
                onSearch={this.handleSearch}
                loading={tagLoading}
              >
                {/* {tagOptions} */}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                showSearch
                style={{ width: '100%' }}
                value={tag}
                placeholder="选择标签"
                allowClear
                onChange={this.handleChange}
                onSearch={this.handleSearch}
              >
                {tagOptions}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                style={{ width: '100%' }}
                value={status}
                placeholder="选择状态"
                allowClear
                onChange={this.handleChange}
                onSearch={this.handleSearch}
              >
                <Option value="publish">上架中</Option>
                <Option value="private">已下架</Option>
              </Select>
            </Col>
            <Col span={5}>
              <Input
                placeholder="请输入商品名或SKU"
                allowClear
                value={search}
                onChange={this.saveSearch}
              />
            </Col>
            <Col span={5}>
              <Button type="primary" style={{ marginRight: 10 }} onClick={this.search}>
                {' '}
                查询
              </Button>
              <Button>重置</Button>
            </Col>
          </Row>
          <Table
            loading={productLoading}
            rowKey={(r) => r.id}
            columns={columns}
            dataSource={productsList.data}
          />
        </Card>
        {/* // </PageContainer> */}
      </>
    );
  }
}

export default ProducstList;
