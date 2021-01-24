import React, { Component } from 'react';
import { Pagination } from 'antd';

class TableFooter extends Component {
  render() {
    const {
      currentPage,
      changePage,
      changeShowSize,
      showSizeChanger,
      showQuickJumper,
      pageSizeOptions,
      total,
      perPage,
      hiddenNum,
    } = this.props;
    return (
      <div
        style={{
          marginTop: 20,
          height: '37px',
          lineHeight: '37px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {!hiddenNum && <span style={{ position: 'absolute', left: 7 }}>共 {total} 条</span>}
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          pageSize={parseInt(perPage, 10) || 25}
          total={total}
          onChange={changePage}
          onShowSizeChange={changeShowSize}
          showSizeChanger={showSizeChanger}
          showQuickJumper={showQuickJumper}
          pageSizeOptions={pageSizeOptions || ['25', '50', '100']}
          style={{ display: 'inline-block' }}
        />
      </div>
    );
  }
}

export default TableFooter;
