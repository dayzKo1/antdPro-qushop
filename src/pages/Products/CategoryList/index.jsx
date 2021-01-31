import React from 'react';
import { Card, Table } from 'antd';
import Grid from '@/components/Grid';
import Search from './search';
import TableFooter from '@/components/TableFooter';
import BasicHeader from '@/components/BasicHeader'

const CategoryList = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Chinese Score',
      dataIndex: 'chinese',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: 'Math Score',
      dataIndex: 'math',
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
    },
    {
      title: 'English Score',
      dataIndex: 'english',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
    {
      title: 'qqq Score',
      dataIndex: 'qqq',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
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
      math: 66,
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
      math: 99,
      english: 89,
      qqq: 70,
    },
  ];

  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }

  return (
    <Grid>
      <BasicHeader title="分类列表" />
      <Card>
        <Search />
        <Table columns={columns} dataSource={data} onChange={onChange} pagination={false} />
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

export default CategoryList;
