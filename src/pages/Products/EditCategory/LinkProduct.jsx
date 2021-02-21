import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal, Select, Row, Col, Table, Input, message, Spin, Empty } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import TableFooter from '@/components/TableFooter';
import defaultImg from '@/assets/defaultImg.png';
import style from '@/global.less';
import styles from './styles.less';
import { debounce } from '@/utils/utils';

const { Option } = Select;
const { Search } = Input;

@connect(({ product, categories, tag, loading }) => ({
  productsList: product.productsList,
  categoryList: categories.categoryList,
  query: product.query,
  proTags: tag.proTags,
  loading: loading.effects['product/fetch'],
  tagLoading: loading.effects['tag/fetchProTags'],
}))
class LinkProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedRowKeys: [],
      currentPage: 1,
      fetching: false,
    };
  }

  async componentDidMount() {
    const { dispatch, proTags } = this.props;
    await dispatch({ type: 'categories/fetchList', payload: {} });
    if (proTags?.length !== 0) {
      await dispatch({
        type: 'tag/initTags',
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'products/clearQuery' });
    sessionStorage.setItem('proQuery', JSON.stringify({}));
  }

  // 点击关联商品
  clickLink = async () => {
    const { linkList, dispatch } = this.props;
    const ids = linkList && linkList.map((item) => item.ID || item);
    this.showModal();
    await dispatch({
      type: 'product/fetch',
      payload: {
        'filter[exclude_id]': ids.join(','),
        page_size: 10,
      },
      save: true,
    });
  };

  select = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };

  // 筛选完后回到第一页
  backPageOne = () => {
    this.setState({
      currentPage: 1,
    });
  };

  // 筛选事件
  changeCate = (category) => {
    const { dispatch, query } = this.props;
    dispatch({
      type: 'product/fetch',
      payload: {
        ...query,
        'filter[category_id]': category,
        page: 1,
        page_size: 10,
      },
      save: true,
    });
    this.backPageOne();
  };

  changeTag = async (tag) => {
    const { dispatch, query } = this.props;
    await dispatch({
      type: 'product/fetch',
      payload: {
        ...query,
        'filter[tag_id]': tag,
        page: 1,
        page_size: 10,
      },
      save: true,
    });
    if (!tag) {
      await dispatch({
        type: 'tag/initTags',
      });
      await dispatch({ type: 'tag/fetchProTags' });
    }
    this.backPageOne();
  };

  search = (search) => {
    const { dispatch, query } = this.props;
    dispatch({
      type: 'product/fetch',
      payload: {
        ...query,
        'filter[search]': search,
        page: 1,
        page_size: 10,
      },
      save: true,
    });
    this.backPageOne();
  };

  // 分页
  changePage = (page, pre, type) => {
    const { dispatch, query, productsList } = this.props;
    const val = {
      page_size: type ? pre : productsList?.meta && productsList?.meta.per_page,
    };
    this.setState({
      currentPage: page,
    });
    dispatch({
      type: 'product/fetch',
      payload: {
        ...query,
        ...val,
        page,
      },
      save: true,
    });
  };

  save = () => {
    const { getLinkData, linkList = [], onChange, decoration, type, keyname } = this.props;
    const { selectedRowKeys } = this.state;
    if (decoration === 'decoration' && linkList.length + selectedRowKeys.length > 15) {
      message.warning(
        `添加的商品数量最多15个，目前已超出${linkList.length + selectedRowKeys.length - 15}个`,
      );
      return;
    }
    if (selectedRowKeys.length > 0) {
      getLinkData(selectedRowKeys, onChange, type, keyname);
    }
    this.setState({
      selectedRowKeys: [],
    });
    this.handleCancel();
  };

  // Modal事件
  showModal = () => {
    const { dispatch, type, productsKeys } = this.props;
    this.setState({
      modalVisible: true,
    });
    if (type === 'logistics') {
      this.setState({
        selectedRowKeys: productsKeys,
      });
    }
    dispatch({
      type: 'tag/fetchProTags',
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
      currentPage: 1,
    });
    dispatch({
      type: 'tag/initTags',
    });
  };

  searchTag = (e) => {
    const { dispatch } = this.props;
    const { fetching } = this.state;
    const that = this;
    if (!fetching) {
      this.setState({ fetching: true });
    }
    async function fake() {
      await dispatch({ type: 'tag/fetchProTags', payload: e });
      that.setState({ fetching: false });
    }
    debounce(fake);
  };

  handleInfiniteOnLoad = (e) => {
    const { dispatch } = this.props;
    e.persist();
    const { target } = e;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      dispatch({ type: 'tag/fetchProTags' });
    }
  };

  render() {
    const { modalVisible, selectedRowKeys, currentPage, fetching } = this.state;
    const {
      productsList,
      categoryList = [],
      proTags = [],
      loading,
      type,
      decoration,
      // linkList = [],
      tagLoading,
      disabledId,
    } = this.props;
    const rowSelection = {
      type: type === 'singlecommodity' ? 'radio' : '',
      selectedRowKeys,
      onChange: this.select,
      getCheckboxProps: (record) => ({
        disabled:
          this.props.gradient &&
          record.bulk_coupon_title &&
          this.props.gradient !== record.bulk_coupon_title, // Column configuration not to be checked
      }),
    };
    // console.log('selectedRowKeys', selectedRowKeys);
    const cateOptions = categoryList?.map((o) => <Option key={o.id}>{o.name}</Option>);
    const tagsOptions = proTags?.map((o) => <Option key={o.id}>{o.name}</Option>);
    const columns = [
      {
        title: type === 'singlecommodity' ? '' : '全选',
        dataIndex: 'image',
        key: 'image',
        width: 80,
        render: (v) =>
          v ? (
            <div
              style={{
                height: 50,
                width: 50,
                border: '1px solid #dadde4',
                backgroundSize: '100% 100%',
                backgroundImage: `url(${v})`,
              }}
            />
          ) : (
            <div
              style={{
                height: 50,
                width: 50,
                border: '1px solid #dadde4',
                backgroundSize: '100% 100%',
                backgroundImage: `url(${defaultImg})`,
              }}
            />
          ),
      },
      {
        dataIndex: 'post_title',
        key: 'post_title',
        render: (v, r) => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 3 }}>
              <p style={{ margin: 0 }}>{r.post_title}</p>
              {r.post_status === 'private' && (
                <p style={{ margin: 0, fontSize: 12, color: '#bfbfbf' }}>
                  <InfoCircleOutlined style={{ marginRight: 5 }} />
                  已下架
                </p>
              )}
            </div>
            {this.props.gradient &&
            r.bulk_coupon_title &&
            this.props.gradient !== r.bulk_coupon_title ? (
              <div style={{ color: '#bfbfbf', flex: 1, textAlign: 'center' }}>
                {r.bulk_coupon_title}
              </div>
            ) : (
              ''
            )}
          </div>
        ),
      },
    ];
    if (type === 'logistics') {
      columns.push({
        title: '',
        key: 'shipping_information',
        width: 200,
        render: (v, r) => r.shipping_information[1],
      });
      rowSelection.getCheckboxProps = (record) => ({
        disabled:
          record.shipping_information !== null &&
          record.shipping_information !== undefined &&
          record.shipping_information.length !== 0 &&
          parseInt(record.shipping_information[0], 10) !== disabledId * 1,
      });
    }

    return (
      <>
        {(type === 'product' || type === 'singlecommodity') && (
          <Button
            onClick={this.clickLink}
            // disabled={loading || (decoration === 'decoration' && linkList.length >= 15)}
            loading={loading}
            type="primary"
            style={
              decoration !== 'decoration'
                ? { display: 'inline-block', position: 'absolute', right: '0px', top: '-36px' }
                : { width: '100%', marginBottom: 10 }
            }
          >
            添加商品
            {/* {decoration === 'decoration' ? `（${linkList.length}/15）` : ''} */}
          </Button>
        )}
        {type === 'link' && (
          <Button
            loading={loading}
            type="primary"
            onClick={this.clickLink}
            style={{ float: 'right' }}
          >
            关联商品
          </Button>
        )}
        {type === 'recommend' && (
          <Button
            onClick={this.clickLink}
            style={{ marginLeft: 20, position: 'relative', bottom: 4 }}
            size="large"
            type="primary"
          >
            添加商品
          </Button>
        )}
        {type === 'holiday' && (
          <Button onClick={this.clickLink} type="primary">
            选择商品
          </Button>
        )}
        {type === 'limit' && (
          <Button onClick={this.clickLink} type="primary">
            新增
          </Button>
        )}
        {type === 'logistics' && (
          <Button
            onClick={this.clickLink}
            style={{
              display: 'inline-block',
              position: 'absolute',
              right: '38px',
              top: '35px',
              zIndex: 2,
            }}
            type="primary"
          >
            添加商品
          </Button>
        )}
        <Modal
          title={type === 'product' ? '请选择商品' : '请选择关联商品'}
          visible={modalVisible}
          onCancel={this.handleCancel}
          maskClosable={false}
          width={640}
          footer={false}
          destroyOnClose
        >
          <Row gutter={10}>
            <Col span={8}>
              <Select
                onChange={this.changeTag}
                style={{ width: '100%' }}
                placeholder="请选择标签"
                allowClear
                showSearch
                onSearch={this.searchTag}
                loading={tagLoading}
                optionFilterProp="children"
                onPopupScroll={this.handleInfiniteOnLoad}
                notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
                defaultActiveFirstOption={false}
              >
                {tagsOptions}
              </Select>
            </Col>
            <Col span={8}>
              <Select
                onChange={this.changeCate}
                style={{ width: '100%' }}
                placeholder="请选择分类"
                allowClear
              >
                {cateOptions}
              </Select>
            </Col>
            <Col span={8}>
              <Search
                className={style.searchBtn}
                style={{ width: '100%' }}
                placeholder="请输入内容"
                enterButton="查询"
                allowClear
                onSearch={this.search}
              />
            </Col>
          </Row>
          <Table
            style={{ marginTop: 10, marginBottom: 20 }}
            className={styles.linkbox}
            dataSource={productsList?.data}
            rowSelection={rowSelection}
            loading={loading}
            columns={columns}
            rowKey={(r) => r.ID}
            scroll={{ y: productsList?.data?.length > 6 ? 400 : null }}
            pagination={false}
            size="small"
          />
          <TableFooter
            hiddenNum={1}
            total={productsList?.meta && productsList?.meta.total}
            changePage={this.changePage}
            currentPage={currentPage}
            perPage={productsList?.meta && productsList?.meta.per_page}
            // showSizeChanger
            // showQuickJumper
            // changeShowSize={(page, prePage) => this.changePage(page, prePage, true)}
          />
          <div className={styles.footer}>
            <span>
              总共{productsList?.meta && productsList?.meta.total}个商品，已选择
              {selectedRowKeys.length}个
            </span>
            <Button size="large" style={{ marginRight: 20 }} onClick={this.handleCancel}>
              取消
            </Button>
            <Button
              size="large"
              disabled={selectedRowKeys.length === 0}
              onClick={this.save}
              type="primary"
            >
              确定
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

export default LinkProduct;
