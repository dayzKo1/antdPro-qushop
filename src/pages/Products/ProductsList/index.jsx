import React, { Component } from 'react';
import { Card, Table, Row, Col, Tag, Button } from 'antd';
import { connect } from 'dva';
import defaultImg from '@/assets/defaultImg.png';
import { history } from 'umi';
import BasicHeader from '@/components/BasicHeader';
import TableFooter from '@/components/TableFooter';
import BatchSelect from './BatchSelect';
import FilterProduct from './FilterProduct';
import style from './style.less';
import styles from '@/global.less';

@connect(({ product, tag, categories, loading }) => ({
  productsList: product.productsList,
  query: product.query,
  tagsList: tag.tagsList,
  categoriesData: categories.categoriesData,
  productLoading: loading.effects['product/fetch'],
}))
class ProducstList extends Component {
  state = {
    currentPage: 1,
    batchSel: false,
    selectedRowKeys: [],
    selectedRows: [],
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    const query = JSON.parse(sessionStorage.getItem('proQuery')) || {};
    await dispatch({
      type: 'product/fetch',
      payload: {
        page: 1,
        ...query,
      },
      save: true,
    });
    await dispatch({
      type: 'tag/fetch',
      payload: {
        page: 1,
        sort: 'name',
      },
    });
    await dispatch({
      type: 'categories/queryCategories',
      payload: {
        sort: 'name',
      },
    });
  }

  async componentWillUnmount() {
    sessionStorage.removeItem('proQuery');
  }

  // 分页
  changePage = async (page, prePage) => {
    const { dispatch, query } = this.props;
    await dispatch({
      type: 'product/fetch',
      payload: {
        ...query,
        page,
        page_size: prePage,
      },
      save: true,
    });
    this.setState({
      currentPage: page,
    });
  };

  // 多选
  batchSelect = (selectedRowKeys, selectedRows) => {
    if (selectedRowKeys.length) {
      this.setState({
        batchSel: true,
      });
    } else {
      this.setState({
        batchSel: false,
      });
    }
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  // 清除多选
  clearBatchSelect = () => {
    this.setState({
      batchSel: false,
      selectedRowKeys: [],
    });
  };

  // 更新数据
  updateData = async () => {
    const { dispatch, query } = this.props;
    // const query = JSON.parse(sessionStorage.getItem('proQuery')) || {};
    await dispatch({
      type: 'product/fetch',
      payload: {
        page: 1,
        ...query,
      },
      save: true,
    });
  };

  // changeBetch
  changeBetch = () => {
    const { batchSel } = this.state;
    this.setState({
      batchSel: !batchSel,
    });
  };

  // 点击行
  clickRow = (r) => {
    if (!window.getSelection().toString()) {
      history.push(`/products/detail/${r.ID}`);
    }
  };

  // 添加商品
  addProduct = () => {
    history.push(`/products/add`);
  };

  render() {
    const columns = [
      {
        title: '商品',
        dataIndex: 'title',
        width: '50%',
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
        render: (v) =>
          v.map((item) => {
            return (
              <Tag key={item.term_taxonomy_id} color="blue">
                {item.name}
              </Tag>
            );
          }),
      },
      {
        title: '状态',
        dataIndex: 'post_status',
        render: (v, r) => (
          <>
            {r.post_status === 'publish' && <Tag color="green">上架中</Tag>}
            {r.post_status === 'private' && <Tag color="magenta">已下架</Tag>}
          </>
        ),
      },
      {
        title: '操作',
        // dataIndex: 'address',
        width: '15%',
        align: 'right',
        render: (_, v) => (
          <a style={{ padding: '10px 0 10px 10px' }} onClick={() => this.clickRow(v)}>
            编辑
          </a>
        ),
      },
    ];

    const { productLoading, productsList, query } = this.props;
    const { currentPage, selectedRowKeys, batchSel } = this.state;
    const nuewCurrenPage = query?.page;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.batchSelect,
    };

    return (
      // <PageContainer>
      <>
        <BasicHeader title="商品列表">
          <Button
            style={{ float: 'right' }}
            loading={productLoading}
            type="primary"
            size="large"
            onClick={this.addProduct}
          >
            添加商品
          </Button>
        </BasicHeader>
        <Card className={style.cardbox} style={{ minWidth: '900px' }}>
          <FilterProduct />
          <BatchSelect
            batchSel={batchSel}
            selectedRowKeys={selectedRowKeys}
            clearBatchSelect={this.clearBatchSelect}
            updateData={this.updateData}
            changeBetch={this.changeBetch}
          />
          <Table
            loading={productLoading}
            className={styles.tables}
            pagination={false}
            rowSelection={rowSelection}
            rowKey={(r) => r.ID}
            columns={columns}
            dataSource={productsList.data}
            onRow={(record) => {
              return {
                onClick: () => this.clickRow(record), // 点击行
              };
            }}
          />
          <TableFooter
            total={productsList.meta && productsList.meta.total}
            changePage={this.changePage}
            currentPage={nuewCurrenPage || currentPage}
            perPage={productsList.meta && productsList.meta.per_page}
            showSizeChanger
            showQuickJumper
            // changeShowSize={(page, prePage) => this.changePage(page, prePage, true)}
          />
        </Card>
        {/* // </PageContainer> */}
      </>
    );
  }
}

export default ProducstList;
