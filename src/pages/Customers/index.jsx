import React, { useState, useEffect } from 'react';
import { Card, Table } from 'antd';
import { connect } from 'dva';
import Grid from '@/components/Grid';
import Search from './search';
import TableFooter from '@/components/TableFooter';
import BasicHeader from '@/components/BasicHeader'
import style from "./style.less"

const Customers = props => {
  const {customersData}=props;
  useEffect(()=>{
    console.log(props)
    const {dispatch}=props;
    dispatch({
      type:"customers/queryCustomers",
      payload:{
        filter:{
          subscribed:0
        },
        page:1
      }
    })
  },[])

  const columns = [
    {
      title: '姓名',
      dataIndex: 'display_name',
      width: "20%",
      align: 'center'
    },
    {
      title: '地区',
      dataIndex: 'country',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
      width: "20%",
      align: 'center'
    },
    {
      title: '订阅状态',
      dataIndex: 'subscribed',
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
      width: "20%",
      align: 'center',
      render: (text) => (
        <div>
          {
            text ? <div className={`${style.yes} ${style.tag}`}>已订阅</div> : <div className={`${style.no} ${style.tag}`}>未订阅</div>
          }
        </div>
      )
    },
    {
      title: '订单数',
      dataIndex: 'order_count',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
      width: "20%",
      align: 'center'
    },
    {
      title: '订单总金额',
      dataIndex: 'order_total',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
      width: "20%",
      align: 'center',
      render: (text) => (
        <div>
          {`$ ${text}`}
        </div>
      )
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
  }

  return (
    <Grid className={style.customers}>
      <BasicHeader title="顾客" />
      <Card>
        <Search />
        <Table className={style.tables} columns={columns} dataSource={customersData||data} onChange={onChange} pagination={false} />
        <TableFooter
          // total={groupProData.meta && groupProData.meta.total}
          // changePage={this.changePage}
          // currentPage={currentPage}
          // perPage={groupProData.meta && groupProData.meta.per_page}
          showSizeChanger
          showQuickJumper
        // changeShowSize={(page, prePage) => this.changePage(page, prePage, true)}
        />
      </Card>
    </Grid>
  );
};

export default  connect((state)=>({
  customersData:state.customers.customersData
}))(Customers);
