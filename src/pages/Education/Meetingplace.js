import React, { Component, Fragment } from 'react';
import { Table, Input, Select, DatePicker, Button, Card } from 'antd';
import store from './store';
import request from '../../helpers/request';
import { observer } from 'mobx-react';
import Add from './modal/add'

const { RangePicker } = DatePicker;
const Option = Select.Option;
const _status = {
  '-1': '不通过',
  '0': '保存中',
  '1': '流程中',
  '2': '通过'
}

const columns = [
  {
    title: '日期',
    dataIndex: 'apply_date'
  },
  {
    title: '申请人',
    dataIndex: 'username'
  },
  {
    title: '部门',
    dataIndex: 'department'
  },
  {
    title: '公函字号',
    dataIndex: 'letter_size'
  },
  {
    title: '公函标题',
    dataIndex: 'letter_title'
  },
  {
    title: '接待人数',
    dataIndex: 'user_count'
  },
  {
    title: '陪餐人数',
    dataIndex: 'meals_count'
  },
  {
    title: '费用合计',
    dataIndex: 'money'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (text) => (<span>{_status[text]}</span>)
  },
  {
    title: '操作',
    render: (text, render, columns) => <a onClick={() => { return false }}>查看进度</a>
  }
]

@observer
class MeetingPlace extends Component {
  render() {
    let { department, dataSource, time_begin, time_end, status, username, addParams } = store;
    return (
      <Fragment>
        <Card>
          <div>
            <span>日期：</span><RangePicker style={{ width: 250, marginRight: 10 }} defaultValue={[time_begin, time_end]} onChange={(d, t) => { store.time_begin = t[0]; store.time_end = t[1]; }} />
            <span>部门：</span><Select defaultValue={department} onChange={(v) => { store.department = v }} style={{ width: 100, marginRight: 10 }}>
              <Option value="all">全部</Option>
            </Select>
            <span>申请人：</span> <Input style={{ width: 120, marginRight: 10 }} placeholder='全部' onChange={(e) => { store.username = e.target.value }} />
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.fetchList}>查询</Button>
            <Button type='primary' >导出</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <span>状态：</span><Select defaultValue={status} style={{ width: 100, marginRight: 10 }} onChange={(v) => { store.status = v }} ><Option value={3}>全部</Option></Select>
            <Button type='primary' onClick={() => {store.addParams.AddVisible = true}}>新增</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={columns} dataSource={dataSource} rowKey='id' bordered ></Table>
          </div>
        </Card>
        <Add props={addParams} />
      </Fragment>
    )
  }
  fetchList = (e, page = 1, size = 10) => {
    let { time_begin, time_end, status, department, username } = store;
    request({
      url: '/api/v1/meeting/place/list',
      method: 'GET',
      data: {
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
        username,
        status,
        department,
        page,
        size,
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
      }
    })
  }
}

export default MeetingPlace