import React, { Component } from 'react';
import { Tag, Input, Tooltip } from 'antd';
// import { connect } from 'dva';
import { PlusOutlined } from '@ant-design/icons';

// const { Option } = Select;

// @connect(({ categories }) => ({
//   categoryList: categories.categoryList,
// }))

class EditableTagGroup extends Component {
  state = {
    cates: undefined,
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
  };

  async componentDidMount() {
    const { detail } = this.props;
    const cateInit = detail.categories && detail.categories.map((item) => item.name);
    this.setState({
      cates: cateInit,
    });
    // dispatch({ type: 'categories/fetchList' });
  }

  handleClose = (removedTag) => {
    const cates = this.state.cates.filter((tag) => tag !== removedTag);
    this.setState({ cates });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { cates } = this.state;
    if (!cates) {
      cates = [inputValue];
    }
    if (inputValue && cates && cates.indexOf(inputValue) === -1) {
      cates = [...cates, inputValue];
    }
    this.setState({
      cates,
      inputVisible: false,
      inputValue: '',
    });
  };

  handleEditInputChange = (e) => {
    this.setState({ editInputValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    this.setState(({ cates, editInputIndex, editInputValue }) => {
      const newCates = [...cates];
      newCates[editInputIndex] = editInputValue;

      return {
        cates: newCates,
        editInputIndex: -1,
        editInputValue: '',
      };
    });
  };

  saveInputRef = (input) => {
    this.input = input;
  };

  saveEditInputRef = (input) => {
    this.editInput = input;
  };

  render() {
    const { cates, inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
    // const { categoryList } = this.props;
    // const cateOptions = categoryList.map(o => (
    //   <Option key={o.term_taxonomy_id} value={o.name}>
    //     {o.name}
    //   </Option>
    // ));
    return (
      <>
        {cates &&
          cates.map((cate, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={this.saveEditInputRef}
                  style={{ width: '30%' }}
                  key={cate}
                  size="small"
                  // className="tag-input"
                  value={editInputValue}
                  onChange={this.handleEditInputChange}
                  onBlur={this.handleEditInputConfirm}
                  onPressEnter={this.handleEditInputConfirm}
                />
              );
            }

            const isLongCate = cate.length > 20;

            const cateElem = (
              <Tag
                // className="edit-tag"
                color="blue"
                key={cate}
                closable
                onClose={() => this.handleClose(cate)}
              >
                <span
                  onDoubleClick={(e) => {
                    if (index !== 0) {
                      this.setState({ editInputIndex: index, editInputValue: cate }, () => {
                        this.editInput.focus();
                      });
                      e.preventDefault();
                    }
                  }}
                >
                  {isLongCate ? `${cate.slice(0, 20)}...` : cate}
                </span>
              </Tag>
            );
            return isLongCate ? (
              <Tooltip title={cate} key={cate}>
                {cateElem}
              </Tooltip>
            ) : (
              cateElem
            );
          })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            style={{ width: '30%' }}
            type="text"
            size="small"
            // className="tag-input"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        //   <Select
        //     mode="multiple"
        //     ref={this.saveInputRef}
        //     style={{ width: '100%' }}
        //     size="small"
        //     value={inputValue}
        //     onChange={this.handleInputChange}
        //     onBlur={this.handleInputConfirm}
        //     onPressEnter={this.handleInputConfirm}
        //     allowClear
        //   // placeholder={tr('products.category1.placeholder', '请选择商品分类')}
        // >
        //   {cateOptions}
        // </Select>
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput}>
            <PlusOutlined /> 添加分类
          </Tag>
        )}
      </>
    );
  }
}

export default EditableTagGroup;
