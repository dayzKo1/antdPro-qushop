import React, { useState, useEffect } from 'react';
import { Card, Table } from 'antd';
import { connect } from 'dva';
import Grid from '@/components/Grid';
import Search from './search';
import TableFooter from '@/components/TableFooter';
import BasicHeader from '@/components/BasicHeader';
import style from './style.less';

const countries = require('i18n-iso-countries');
countries.registerLocale(require('i18n-iso-countries/langs/zh.json'));
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

const Customers = (props) => {
  const { customersData, dispatch, loading, meta, query } = props;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(async () => {
    dispatch({
      type: 'customers/queryCustomers',
      payload: {
        page: currentPage,
      },
    });
  }, []);

  const columns = [
    {
      title: '姓名',
      dataIndex: 'display_name',
      width: '20%',
      align: 'center',
    },
    {
      title: '地区',
      dataIndex: 'country',
      width: '20%',
      align: 'center',
      render: (text) => <div>{countries.getName(text, 'zh')}</div>,
    },
    {
      title: '订阅状态',
      dataIndex: 'subscribed',
      width: '20%',
      align: 'center',
      render: (text) => (
        <div>
          {text ? (
            <div className={`${style.yes} ${style.tag}`}>已订阅</div>
          ) : (
            <div className={`${style.no} ${style.tag}`}>未订阅</div>
          )}
        </div>
      ),
    },
    {
      title: '订单数',
      dataIndex: 'order_count',
      width: '20%',
      align: 'center',
      sorter: true,
    },
    {
      title: '订单总金额',
      dataIndex: 'order_total',
      width: '20%',
      align: 'center',
      render: (text) => <div>{`$ ${text}`}</div>,
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      chinese: 98,
      math: 60,
      english: 70,
      qqq: 70,
    },
    {
      key: '2',
      name: 'Jim Green',
      chinese: 98,
      math: false,
      english: 89,
      qqq: 70,
    },
    {
      key: '3',
      name: 'Joe Black',
      chinese: 98,
      math: 90,
      english: 70,
      qqq: 70,
    },
    {
      key: '4',
      name: 'Jim Red',
      chinese: 88,
      math: false,
      english: 89,
      qqq: 70,
    },
  ];

  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
    const { field, order } = sorter;
    if (field === 'order_count') {
      const val = order === 'ascend' ? 'count' : '-count';
      dispatch({
        type: 'customers/queryCustomers',
        payload: {
          ...query,
          sort: order ? val : undefined,
        },
      });
    }
  }

  const changePage = (page, prePage) => {
    dispatch({
      type: 'customers/queryCustomers',
      payload: {
        ...query,
        page,
        page_size: prePage,
      },
    });
    setCurrentPage(page);
  };

  return (
    <Grid className={style.customers}>
      <BasicHeader title="顾客" />
      <Card>
        <Search currentPage={currentPage} />
        <Table
          className={style.tables}
          columns={columns}
          dataSource={customersData || data}
          onChange={onChange}
          pagination={false}
          loading={loading}
        />
        <TableFooter
          total={meta && meta.total}
          changePage={changePage}
          currentPage={currentPage}
          perPage={meta && meta.per_page}
          showSizeChanger
          showQuickJumper
        />
      </Card>
    </Grid>
  );
};

export default connect((state) => ({
  customersData: state.customers.customersData,
  meta: state.customers.meta,
  query: state.customers.query,
  loading: state.loading.effects['customers/queryCustomers'],
}))(Customers);
