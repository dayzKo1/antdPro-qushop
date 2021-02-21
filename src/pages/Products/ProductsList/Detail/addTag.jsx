import React, { Component } from 'react';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

class AddTag extends Component {
  state = {
    tags: undefined,
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
  };

  async componentDidMount() {
    const { detail } = this.props;
    const tagInit = detail.tags && detail.tags.map((item) => item.name);
    this.setState({
      tags: tagInit,
    });
    console.log('cateInit ,this.state.cates', tagInit, this.state.cates);
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  handleEditInputChange = (e) => {
    this.setState({ editInputValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    this.setState(({ tags, editInputIndex, editInputValue }) => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;

      return {
        tags: newTags,
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
    const { tags, inputVisible, inputValue, editInputIndex, editInputValue } = this.state;

    return (
      <>
        {tags &&
          tags.map((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={this.saveEditInputRef}
                  style={{ width: '30%' }}
                  key={tag}
                  size="small"
                  // className="tag-input"
                  value={editInputValue}
                  onChange={this.handleEditInputChange}
                  onBlur={this.handleEditInputConfirm}
                  onPressEnter={this.handleEditInputConfirm}
                />
              );
            }

            const isLongTag = tag.length > 20;

            const tagElem = (
              <Tag
                // className="edit-tag"
                color="orange"
                key={tag}
                closable
                onClose={() => this.handleClose(tag)}
              >
                <span
                  onDoubleClick={(e) => {
                    if (index !== 0) {
                      this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                        this.editInput.focus();
                      });
                      e.preventDefault();
                    }
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
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
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput}>
            <PlusOutlined /> 添加标签
          </Tag>
        )}
      </>
    );
  }
}

export default AddTag;
