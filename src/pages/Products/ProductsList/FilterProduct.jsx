import React, { Component } from 'react';
import { Row, Col, Select, Input, Button } from 'antd';
import { connect } from 'dva';
import style from './style.less';

const { Option } = Select;
const { Search } = Input;

@connect(({ product, tag, categories, loading }) => ({
  productsList: product.productsList,
  query: product.query,
  tagsList: tag.tagsList,
  categoriesList: categories.categoriesList,
  productLoading: loading.effects['product/fetch'],
  tagLoading: loading.effects['tags/fetchProTags'],
  categoryLoading: loading.effects['categories/fetchList'],
}))
class FilterProduct extends Component {
  state = {
    tag: undefined,
    category: undefined,
    search: undefined,
    status: undefined,
  };

  async componentDidMount() {
    const query = JSON.parse(sessionStorage.getItem('proQuery')) || {};
    this.setState({
      tag: query['filter[tag]'],
      category: query['filter[category]'],
      search: query['filter[search]'],
      status: query['filter[status]'],
    });
  }

  // 分类筛选
  changeCategories = async (value) => {
    const { dispatch, query } = this.props;
    await dispatch({
      type: 'product/fetch',
      payload: {
        ...query,
        'filter[category]': value,
        page: 1,
      },
      save: true,
    });
    this.setState({
      category: value,
    });
  };

  // 标签筛选
  changeTag = async (value) => {
    const { dispatch, query } = this.props;
    await dispatch({
      type: 'product/fetch',
      payload: {
        ...query,
        'filter[tag]': value,
        page: 1,
      },
      save: true,
    });
    this.setState({
      tag: value,
    });
  };

  // 标签搜索
  searchTag = async (value) => {
    const { dispatch } = this.props;
    // const { category, status,search}=this.state;
    await dispatch({
      type: 'tag/fetch',
      payload: {
        sort: 'name',
        'filter[name]': value,
      },
    });
    this.setState({
      tag: value,
    });
  };

  // 状态筛选
  changeStatus = async (value) => {
    const { dispatch, query } = this.props;
    await dispatch({
      type: 'product/fetch',
      payload: {
        ...query,
        'filter[status]': value,
        page: 1,
      },
      save: true,
    });
    this.setState({
      status: value,
    });
  };

  // 保存商品名或SKU搜索信息
  saveSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  // 商品名或SKU搜索
  search = (search) => {
    const { dispatch, query } = this.props;
    dispatch({
      type: 'product/fetch',
      payload: {
        ...query,
        'filter[search]': search,
        page: 1,
      },
      save: true,
    });
  };

  // 搜索
  reset = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'product/fetch',
      save: true,
    });
    this.setState({
      tag: undefined,
      category: undefined,
      search: undefined,
      status: undefined,
    });
  };

  render() {
    const { tagLoading, tagsList = {}, categoriesList = {} } = this.props;
    const { tag, category, search, status } = this.state;
    const tagOptions =
      tagsList?.data?.length > 0 && tagsList?.data.map((d) => <Option key={d.id}>{d.name}</Option>);
    const categoriesOptions =
      categoriesList?.data?.length > 0 &&
      categoriesList?.data.map((d) => <Option key={d.term_taxonomy_id}>{d.name}</Option>);

    return (
      // <PageContainer>
      <>
        <Row gutter={15} style={{ marginBottom: 10 }}>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              showSearch
              value={category}
              placeholder="选择分类"
              allowClear
              onChange={this.changeCategories}
              // onSearch={this.changeCategories}
              loading={tagLoading}
            >
              {categoriesOptions}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              showSearch
              style={{ width: '100%' }}
              value={tag}
              placeholder="选择标签"
              allowClear
              onChange={this.changeTag}
              onSearch={this.searchTag}
              loading={tagLoading}
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
              onChange={this.changeStatus}
            >
              <Option value="publish">上架中</Option>
              <Option value="private">已下架</Option>
            </Select>
          </Col>
          <Col span={5}>
            <Search
              placeholder="请输入商品名或SKU"
              className={style.search}
              allowClear
              value={search}
              onChange={this.saveSearch}
              onSearch={this.search}
            />
          </Col>
          <Col span={5}>
            <Button type="primary" style={{ marginRight: 10 }} onClick={this.search}>
              {' '}
              查询
            </Button>
            <Button onClick={this.reset}>重置</Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default FilterProduct;
