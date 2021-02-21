import React, { Component } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import moment from 'moment';
import LinkProduct from './LinkProduct';
import LinkItem from './LinkItem';
import styles from './styles.less';

class LinkList extends Component {
  state = {
    selectList: [],
    delModal: false,
  };

  // 点击选中
  select = (index) => {
    const { selectList } = this.state;
    const list = selectList;
    if (list.includes(index)) {
      list.splice(
        list.findIndex((item) => item === index),
        1,
      );
    } else {
      list.unshift(index);
    }
    this.setState({
      selectList: list,
    });
  };

  // 取消选中
  cancelSel = () => {
    this.setState({
      selectList: [],
    });
  };

  // 批量移除
  batchDel = () => {
    const { selectList } = this.state;
    const { onChange, batchDelLink } = this.props;
    batchDelLink(selectList, onChange);
    this.setState({
      selectList: [],
      delModal: false,
    });
  };

  // 移动到顶部
  setTop = () => {
    const { selectList } = this.state;
    const { onChange, setTopLink } = this.props;
    setTopLink(selectList, onChange);
    this.setState({
      selectList: [],
    });
  };

  // 排序
  sort = (value) => {
    const { linkList, sortLink, onChange, changeSortType } = this.props;
    const list = JSON.parse(JSON.stringify(linkList));
    switch (value) {
      case 'price_descending':
        list.sort((a, b) => b.min_price * 1 - a.min_price * 1);
        break;
      case 'price_ascending':
        list.sort((a, b) => a.min_price * 1 - b.min_price * 1);
        break;
      case 'best_selling_descending':
        list.sort((a, b) => b.total_sales - a.total_sales);
        break;
      case 'best_selling_descending_descending':
        list.sort((a, b) => a.total_sales - b.total_sales);
        break;
      case 'created_descending':
        list.sort((a, b) => moment(b.post_date).format('X') - moment(a.post_date).format('X'));
        break;
      case 'created_ascending':
        list.sort((a, b) => moment(a.post_date).format('X') - moment(b.post_date).format('X'));
        break;
      default:
        break;
    }
    sortLink(list, onChange);
    changeSortType(value);
  };

  // modal事件
  handleCancel = () => {
    this.setState({
      delModal: false,
    });
  };

  showModal = () => {
    this.setState({
      delModal: true,
    });
  };

  delList = (e) => {
    const { selectList } = this.state;
    for (let i = 0; i < selectList.length; i += 1) {
      if (selectList[i] > e) {
        selectList.splice(i, 1, selectList[i] - 1);
      } else if (selectList[i] === e) {
        selectList.splice(i, 1);
        i -= 1;
      }
    }
    console.log(selectList);
  };

  render() {
    const { linkList, delLink, getLinkData, onChange, sortType } = this.props;
    const { selectList } = this.state;
    return (
      <>
        <div className={styles.title}>
          <span>关联商品</span>
          <LinkProduct
            type="link"
            linkList={linkList}
            onChange={onChange}
            getLinkData={getLinkData}
          />
        </div>
        <DndProvider backend={Backend}>
          {linkList &&
            linkList.length > 0 &&
            linkList.map((data, index) => (
              <LinkItem
                key={data.ID || data.term_taxonomy_id}
                data={data}
                index={index}
                onChange={onChange}
                delLink={delLink}
                // moveItem={moveItem}
                sortType={sortType}
                selectList={selectList}
                select={this.select}
                type="editCategory"
                delList={this.delList}
              />
            ))}
        </DndProvider>
      </>
    );
  }
}

export default LinkList;
