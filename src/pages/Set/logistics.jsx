import React from 'react';
import { Table, Form, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Grid from '@/components/Grid';
import { connect } from 'dva';

class Logistics extends React.Component {
  state = {
    editData: [],
    data: [],
  };

  formRef = React.createRef();

  componentDidMount() {
    const arr = [];
    if (!localStorage.getItem('logistics')) {
      localStorage.setItem('logistics', JSON.stringify([{ key: 1, name: 'EMS', code: '32' }]));
    }
    const val = JSON.parse(localStorage.getItem('logistics'));
    val.forEach((element) => {
      const { name, code } = element;
      arr[element.key] = {
        name,
        code,
        status: true,
      };
    });
    this.setState({
      data: val,
      editData: arr,
    });
  }

  handleChange = async (e, type, id) => {
    const { editData } = this.state;
    const values = (editData.length && editData[id]) || {};
    values[type] = e;
    const val = editData;
    val[id] = values;
    this.setState({
      editData: val,
    });
  };

  handleSave = async (id) => {
    const { editData, data } = this.state;
    const values = (editData.length && editData[id]) || {};
    const val = data;
    val.forEach((element, index) => {
      if (element?.key === id) {
        val[index] = {
          ...element,
          name: values.name,
          code: values.code,
        };
      }
    });
    localStorage.setItem('logistics', JSON.stringify([...val]));
    this.setState({
      data: [...val],
    });
    this.handleChange(true, 'status', id);
    message.success('保存成功');
  };

  handleDel = async (id) => {
    const { data, editData } = this.state;
    const val = data;
    const edit = editData;
    edit[id] = {};
    val.forEach((element, index) => {
      if (element.key === id) {
        val.splice(index, 1);
      }
    });
    localStorage.setItem('logistics', JSON.stringify([...val]));
    this.setState({
      data: [...val],
      editData: edit,
    });
    message.success('删除成功');
  };

  handleAdd = () => {
    const val = this.state.data;
    const num = (val?.length && val[val.length - 1]?.key) || 5;
    val.push({
      key: num + 1,
      name: '',
      code: '',
    });
    this.setState({
      data: [...val],
    });
  };

  handleNum = (val) => {
    if (val === '' || val == null) {
      return false;
    }
    if (!Number.isNaN(val) && val > 0) {
      return true;
    }
    return false;
  };

  render() {
    const { data, editData } = this.state;
    const { symbol } = this.props;
    const columns = [
      {
        title: '方案名称',
        dataIndex: 'name',
        key: 'name',
        width: '35%',
        align: 'center',
        render: (text, r) => {
          return (
            <>
              <div>
                {editData?.length && editData[r?.key]?.status ? (
                  <span>{text}</span>
                ) : (
                  <Input
                    placeholder="请输入方案名"
                    style={{ width: '60%' }}
                    value={(editData.length && editData[r?.key]?.name) || undefined}
                    onChange={(e) => {
                      this.handleChange(e.target.value, 'name', r?.key);
                    }}
                  />
                )}
              </div>
            </>
          );
        },
      },
      {
        title: '运费',
        dataIndex: 'code',
        key: 'code',
        width: '35%',
        align: 'center',
        render: (text, r) => {
          return (
            <>
              {editData?.length && editData[r?.key]?.status ? (
                <span>
                  {symbol || '$'}
                  {text}
                </span>
              ) : (
                <div>
                  <Input
                    placeholder="请输入运费"
                    style={{ width: ' 60%' }}
                    addonBefore={symbol || '$'}
                    value={(editData.length && editData[r?.key]?.code) || undefined}
                    onChange={(e) => {
                      this.handleChange(e.target.value, 'code', r?.key);
                    }}
                    showCount={true}
                  />
                  {!this.handleNum(editData[r?.key]?.code || 1) ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        fontSize: '12px',
                        color: 'red',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      请输入正数
                    </div>
                  ) : null}
                </div>
              )}
            </>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'key',
        key: 'key',
        width: '30%',
        align: 'center',
        render: (_, r) => {
          return (
            <div>
              {editData?.length && editData[r?.key]?.status ? (
                <span
                  style={{ padding: '0 5px', color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => {
                    this.handleChange(false, 'status', r?.key);
                  }}
                >
                  编辑
                </span>
              ) : (
                <Button
                  type="link"
                  style={{ padding: '0 5px' }}
                  disabled={
                    !(
                      editData[r?.key]?.code &&
                      editData[r?.key]?.name &&
                      this.handleNum(editData[r?.key]?.code || 1)
                    )
                  }
                  onClick={() => {
                    this.handleSave(r?.key);
                  }}
                >
                  保存
                </Button>
              )}
              <span
                style={{ padding: '0 5px', color: '#1890ff', cursor: 'pointer' }}
                onClick={() => {
                  this.handleDel(r?.key);
                }}
              >
                删除
              </span>
            </div>
          );
        },
      },
    ];
    return (
      <Grid>
        <h4 style={{ fontSize: 17, fontWeight: 600 }}>物流设置</h4>
        <Form ref={this.formRef}>
          <Table columns={columns} dataSource={data} pagination={false} rowKey={(r) => r.key} />
        </Form>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <Button
            type="link"
            size="large"
            onClick={() => {
              this.handleAdd();
            }}
          >
            <PlusOutlined />
            新增方案
          </Button>
        </div>
      </Grid>
    );
  }
}
export default connect(({ setting }) => ({
  symbol: setting.symbol,
}))(Logistics);
