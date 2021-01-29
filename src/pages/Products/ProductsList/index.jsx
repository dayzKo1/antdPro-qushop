import React, { Component } from 'react';
import { Card, Table, Row, Col, Tag } from 'antd';
import { connect } from 'dva';
import defaultImg from '@/assets/defaultImg.png';
// import { PageContainer } from '@ant-design/pro-layout';
import BasicHeader from '@/components/BasicHeader';
import TableFooter from '@/components/TableFooter';
import BatchSelect from './BatchSelect';
import FilterProduct from './FilterProduct';
import style from './style.less';

@connect(({ product, tag, categories, loading }) => ({
  productsList: product.productsList,
  query: product.query,
  tagsList: tag.tagsList,
  categoriesList: categories.categoriesList,
  productLoading: loading.effects['product/fetch'],
  tagLoading: loading.effects['tags/fetchProTags'],
  categoryLoading: loading.effects['categories/fetchList'],
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
      type: 'categories/fetch',
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
    console.log('params', page, prePage);
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
    console.log(selectedRows);
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
            {r.post_status === 'publish' && <Tag color="green">上架中</Tag>}
            {r.post_status === 'private' && <Tag color="magenta">已下架</Tag>}
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

    const { productLoading, productsList, query } = this.props;
    const { currentPage, selectedRowKeys, batchSel } = this.state;
    const nuewCurrenPage = query.page;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.batchSelect,
    };

    return (
      // <PageContainer>
      <>
        <BasicHeader title="商品列表" />
        <Card className={style.cardbox}>
          <FilterProduct />
          <BatchSelect
            batchSel={batchSel}
            selectedRowKeys={selectedRowKeys}
            clearBatchSelect={this.clearBatchSelect}
          />
          <Table
            loading={productLoading}
            pagination={false}
            rowSelection={rowSelection}
            rowKey={(r) => r.ID}
            columns={columns}
            dataSource={productsList.data}
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
