import React, { useEffect, useState } from 'react';
import { Card, Table, Avatar, Row, Col } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import Grid from '@/components/Grid';
import Search from './search';
import BasicHeader from '@/components/BasicHeader';
import defaultImg from '@/assets/defaultImg.png';
import BatchSelect from './BatchSelect';
import style from './style.less';

const CategoryList = (props) => {
  const [batchSel, setBatchSel] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { dispatch, categoriesData, loading, updateLoading } = props;
  useEffect(() => {
    dispatch({
      type: 'categories/queryCategories',
    });
  }, []);

  const columns = [
    {
      title: () => (
        <div className={style.title} style={{ paddingLeft: '20%' }}>
          分类
        </div>
      ),
      dataIndex: 'name',
      width: '33%',
      render: (text, record) => (
        <Row>
          <Col>
            <Avatar
              size={{ xs: 64, sm: 64, md: 64, lg: 64, xl: 64, xxl: 64 }}
              src={record.thumbnail_url || defaultImg}
              shape="square"
            />
          </Col>
          <Col className={style.avatar}>
            <div className={style.avatarText}>{text}</div>
            <div className={style.avatarText2}>已上架{record.product_count || 0}个商品</div>
          </Col>
        </Row>
      ),
    },
    {
      title: () => <div className={style.title}>商品数量</div>,
      dataIndex: 'total_count',
      width: '34%',
      align: 'center',
      sorter: true,
    },
    {
      title: () => <div className={style.title}>操作</div>,
      dataIndex: 'parent',
      width: '33%',
      align: 'center',
      render: () => (
        <Link to="./" disabled>
          编辑
        </Link>
      ),
    },
  ];

  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }

  // 选择行
  const select = (selectedRow) => {
    if (selectedRow.length) {
      setBatchSel(true);
    } else {
      setBatchSel(false);
    }
    setSelectedRowKeys(selectedRow);
  };

  // 批量导入后清除选中列表
  const clearSelRowKeys = () => {
    setBatchSel(false);
    setSelectedRowKeys([]);
  };
  //  展示批量选择
  const showBatchSel = () => {
    setBatchSel(!batchSel);
  };

  return (
    <Grid>
      <BasicHeader title="分类列表" />
      <Card>
        <BatchSelect
          batchSel={batchSel}
          selectedRowKeys={selectedRowKeys}
          clearSelRowKeys={clearSelRowKeys}
          showBatchSel={showBatchSel}
        />
        <Search />
        <Table
          columns={columns}
          dataSource={categoriesData || []}
          onChange={onChange}
          rowKey={(r) => r.id}
          rowSelection={{
            selectedRowKeys,
            onChange: select,
          }}
          pagination={false}
          loading={updateLoading || loading}
        />
      </Card>
    </Grid>
  );
};

export default connect((state) => ({
  categoriesData: state.categories.categoriesData,
  meta: state.categories.meta,
  query: state.categories.query,
  loading: state.loading.effects['categories/queryCategories'],
  updateLoading: state.loading.effects['categories/batchDel'],
}))(CategoryList);
