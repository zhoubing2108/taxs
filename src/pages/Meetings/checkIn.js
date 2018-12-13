import React, { Component, Fragment } from 'react';
import { Table, Button, DatePicker, Select, Input, Card } from 'antd';
import store from './store';
import { observer } from 'mobx-react';
import request from '../../helpers/request'

const { RangePicker } = DatePicker;

@observer
class CheckIn extends Component {
  columns = [
    {
      title: '日期',
      dataIndex: 'create_time'
    },
    {
      title: '姓名',
      dataIndex: 'username'
    },
    {
      title: '手机号码',
      dataIndex: 'phone'
    },
    {
      title: '部门',
      dataIndex: 'department'
    },
    {
      title: '签到地点',
      dataIndex: 'address'
    },
    {
      title: '签到时间',
      dataIndex: 'sign_time'
    },
    {
      title: '会议主题',
      dataIndex: 'theme'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    }
  ]
  render() {
    let { check_address, check_time_begin, check_time_end, check_dataSource } = store;
    return (
      <Fragment>
        <Card>
          <div>
            <span>日期：</span><RangePicker style={{ width: 250, marginRight: 10 }} defaultValue={[check_time_begin, check_time_end]} onChange={(d, t) => { store.check_time_begin = t[0]; store.check_time_end = t[1]; }} />
            <span>部门：</span><Input style={{ width: 120, marginRight: 10 }} placeholder='全部' onChange={(e) => { store.deparment = e.target.value }} placeholder='全部' />
            <span>姓名：</span> <Input style={{ width: 120, marginRight: 10 }} onChange={(e) => { store.username = e.target.value }} placeholder='全部' />
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.fetchList}>查询</Button>
            <Button type='primary' >导出</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <span>签到地点：</span><Select defaultValue={check_address} style={{ width: 100, marginRight: 10 }}>
              <Option value="全部">全部</Option>
            </Select>
            <span>会议主题：</span><Input style={{ width: 120, marginRight: 10 }} onChange={(e) => { store.check_theme = e.target.value }} placeholder='全部' />
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={this.columns} dataSource={check_dataSource} rowKey='id' bordered ></Table>
          </div>
        </Card>
      </Fragment>
    )
  }
  fetchList = (e, page = 1, size = 10) => {
    let { check_address, check_theme, check_time_begin, check_time_end, department, username } = store;
    request({
      url: '/api/v1/meeting/sign/in/list',
      method: 'GET',
      data: {
        address: check_address,
        theme: check_theme,
        username,
        department,
        time_begin: check_time_begin.format('YYYY-MM-DD'),
        time_end: check_time_end.format('YYYY-MM-DD'),
        page,
        size
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.check_dataSource = res.data;
      }
    })
  }
}

export default CheckIn