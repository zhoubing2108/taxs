import React, { Component, Fragment } from 'react';
import { Table, Input, Select, DatePicker, Button, Card } from 'antd';
import request from '../../helpers/request';
import store from './store';
import {observer} from 'mobx-react';
import { withRouter } from "react-router-dom";


const { RangePicker } = DatePicker;
const Option = Select.Option;
const _status = {
  '-1':'不通过',
  '0':'保存中',
  '1':'流程中',
  '2':'通过'
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
    title: '部门',
    dataIndex: 'department'
  },
  {
    title: '用车时间',
    dataIndex: 'apply_date'
  },
  {
    title: '目的地',
    dataIndex: 'address'
  },
  {
    title: '人数',
    dataIndex: 'count'
  },
  {
    title: '用车原因',
    dataIndex: 'reason'
  },
  {
    title: '出行人员',
    dataIndex: 'members'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render:(text)=>(<span>{_status[text]}</span>)
  },
  {
    title: '操作',
    render: (text,render,columns) => <a onClick={() => {return false}}>查看进度</a>
  }
]
@observer
class UseCar extends Component {
  render() {
    console.log(this.props)
    let { department,dataSource, time_begin, time_end, status,reason } = store;
    return (
      <Fragment>
        <Card>
          <div>
            <span>日期：</span><RangePicker style={{ width: 250, marginRight: 10 }} defaultValue={[time_begin,time_end]} onChange={(d, t) => { store.time_begin = t[0]; store.time_end = t[1]; }} />
            <span>部门：</span><Select defaultValue={department} onChange={(v) => { store.department = v }} style={{ width: 100, marginRight: 10 }}>
              <Option value="全部">全部</Option>
              <Option value="国防部">国防部</Option>
            </Select>
            <span>申请人：</span> <Input style={{ width: 120, marginRight: 10 }} onChange={(e) => { store.username = e.target.value }} placeholder='全部' />
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.fetchList} >查询</Button>
            <Button type='primary' >导出</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <span>状态：</span><Select defaultValue={status} style={{ width: 100, marginRight: 10 }} onChange={(v) => { store.status = v }} ><Option value={3}>全部</Option></Select>
            <span>用车原因：</span><Select defaultValue={reason} style={{ width: 100, marginRight: 10 }} onChange={(v) => { store.reason = v }} ><Option value={'全部'}>全部</Option></Select>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={columns} dataSource={dataSource} rowKey='id' bordered />
          </div>
        </Card>
      </Fragment>
    )
  }
  fetchList = (e, page = 1, size = 10) => {
    let { time_begin, time_end, reason, status, department, username } = store;
    request({
      url: '/api/v1/car/list',
      method: 'GET',
      data: {
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end:time_end.format('YYYY-MM-DD'),
        reason,
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

export default withRouter(UseCar)