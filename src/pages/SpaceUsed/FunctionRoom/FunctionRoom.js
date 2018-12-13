import React, { Component, Fragment } from 'react';
import { Input, Table, Select, Button, DatePicker, Card } from 'antd';
import { observer } from 'mobx-react';
import request from '../../../helpers/request';
import store from './store'
import Add from './modal/add'

const { RangePicker } = DatePicker;
const _status = {
  '-1': '不通过',
  '0': '保存中',
  '1': '流程中',
  '2': '通过'
}
const columns = [
  {
    title: '日期',
    dataIndex: 'create_time'
  },
  {
    title: '申请人',
    dataIndex: 'username'
  },
  {
    title: '使用单位',
    dataIndex: 'unit'
  },
  {
    title: '使用时间',
    dataIndex: 'time_begin'
  },
  {
    title: '申请使用事由',
    dataIndex: 'reason'
  },
  {
    title: '场地名称',
    dataIndex: 'space'
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
class FunctionRoom extends Component {
  render() {
    let { department, dataSource, time_begin, time_end, status, space, addParams } = store;
    return (
      <Fragment>
        <Card>
          <div>
            <span>日期：</span><RangePicker style={{ width: 250, marginRight: 10 }} defaultValue={[time_begin, time_end]} onChange={(d, t) => { store.time_begin = t[0]; store.time_end = t[1]; }} />
            <span>部门：</span>
            <Select defaultValue={department} onChange={(v) => { store.department = v }} style={{ width: 100, marginRight: 10 }}>
              <Option value={'全部'}>全部</Option></Select>
            <span>申请人：</span> <Input style={{ width: 120, marginRight: 10 }} onChange={(e) => { store.username = e.target.value }} placeholder='全部' />
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.fetchList} >查询</Button>
            <Button type='primary' >导出</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <span>状态：</span><Select defaultValue={status} style={{ width: 100, marginRight: 10 }}><Option value={3}>全部</Option></Select>
            <span>场地名称：</span><Select defaultValue={space} style={{ width: 100, marginRight: 10 }}><Option value={'全部'}>全部</Option></Select>
            <Button type='primary' onClick={()=>{store.addParams.AddVisible = true}} >新增</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={columns} dataSource={dataSource} rowKey='id' bordered > </Table>
          </div>
        </Card>
        <Add props={addParams} />
      </Fragment>
    )
  }
  fetchList = (e, page = 1, size = 10) => {
    let { department, time_begin, time_end, status, username, space } = store;
    request({
      url: '/api/v1/multi/list',
      method: 'GET',
      data: {
        department,
        username,
        status,
        space,
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
        page,
        size
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data
      }
    })
  }
}

export default FunctionRoom