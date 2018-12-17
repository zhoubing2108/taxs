import React, { Component, Fragment } from 'react';
import { Table, DatePicker, Button, Input, Select, Card } from 'antd';
import store from './store';
import Append from './append/append';
import Modify from './modify/modify';
import { observer } from 'mobx-react';
import request from '../../helpers/request';
import exportFile from '../../helpers/export-file';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};


@observer
class Meeting extends Component {
  columns = [
    {
      title: '日期',
      dataIndex: 'create_time'
    },
    {
      title: '会议主题',
      dataIndex: 'theme'
    },
    {
      title: '内容概要',
      dataIndex: 'outline'
    },
    {
      title: '签到地点',
      dataIndex: 'address'
    },
    {
      title: '签到开始时间',
      dataIndex: 'time_begin'
    },
    {
      title: '签到截止时间',
      dataIndex: 'time_end',
    },
    {
      title: '会议开始时间',
      dataIndex: 'meeting_begin'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      render: (record, text, columns) => (
        <span>
          <a style={{ marginRight: 10 }} onClick={() => this.editItem(record)}>编辑</a>
          <a onClick={() => this.deleteItem(record)}>删除</a>
        </span>)
    }
  ]
  render() {
    let { addParams, modifyParams, address, time_begin, time_end, dataSource, editItem } = store;
    dataSource = dataSource.slice();
    return (
      <Fragment>
        <Card>
          <span style={{ marginRight: 5 }}>
            日期:<RangePicker style={{ width: 240, marginLeft: 5 }} defaultValue={[time_begin, time_end]} onChange={(d, t) => { store.time_begin = t[0]; store.time_end = t[1]; }} />
          </span>
          <span style={{ marginRight: 5 }}>
            签到地点:
          <Select defaultValue={address} style={{ width: 100, marginLeft: 5 }}>
              <Option value="全部">全部</Option>
            </Select>
          </span>
          <span>
            会议主题: <Input style={{ width: 120, marginLeft: 5 }} placeholder='全部' onChange={(e) => { store.theme = e.target.value }} />
          </span>
          <Button type='primary' style={{ marginLeft: 10 }} onClick={this.fetchList}>查询</Button>
          <Button type='primary' style={{ float: 'right', marginLeft: 5 }}onClick={()=>{this.export()}} >导出</Button>
          <Button type='primary' style={{ float: 'right', marginLeft: 5 }} onClick={() => { store.addParams.AddVisible = true }} > 新增</Button>
          <div style={{ marginTop: 15 }}>
            <Table columns={this.columns} dataSource={dataSource} rowKey='id' bordered ></Table>
          </div>
        </Card>
        <Append props={addParams} />
        <Modify props={modifyParams} editItem={editItem} />
      </Fragment>
    )
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = (e, page = 1, size = 10) => {
    let { address, theme, time_begin, time_end } = store;
    request({
      url: '/api/v1/meeting/list',
      method: 'GET',
      data: {
        address,
        theme,
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
        page,
        size
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
      }
    })
  }
  editItem = (item) => {
    store.modifyParams.ModifyVisible = true;
    store.editItem = item;
  }
  deleteItem = (record) => {
    let { id } = record;
    request({
      url: '/api/v1/meeting/delete',
      method: 'POST',
      data: {
        id
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {

      }
    })
  }
  export = () => {
    let { address, theme, time_begin, time_end } = store;
    console.log(address, theme, time_begin, time_end );
    exportFile({
      url: '/api/v1/meeting/export',
      data: {
        address, 
        theme,
         time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
      }
    })
  }
}

export default Meeting