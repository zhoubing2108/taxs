import React, { Component, Fragment } from 'react';
import { Table, Input, Select, DatePicker, Button, Card } from 'antd';
import { observer } from 'mobx-react';
import store from './store';
import request from '../../helpers/request';
import Append from './modal/append';
import { withRouter } from "react-router-dom";
import nextStore from './Progress/store';
import exportFile from '../../helpers/export-file';



const { RangePicker } = DatePicker;
const Option = Select.Option;
const _status = {
  '-1': '不通过',
  '0': '保存中',
  '1': '流程中',
  '2': '通过'
}

@observer
class Authority extends Component {
  columns = [
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
      title: '职务',
      dataIndex: 'role_name'
    },
    {
      title: '人员类型',
      dataIndex: 'user_type'
    },
    {
      title: '开通功能',
      dataIndex: 'access'
    },
    {
      title: '工作截止时间（外来人员）',
      dataIndex: 'deadline'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text) => (<span>{_status[text]}</span>)
    },
    {
      title: '操作',
      render: (text, record, index) => <a onClick={() => { this.goDetail(record) }}>查看进度</a>
    }
  ]
  render() {
    let { department, access, status, dataSource, time_begin, time_end, addParams } = store;
    return (
      <Fragment>
        <Card>
          <div>
            <span>日期：</span><RangePicker style={{ width: 250, marginRight: 10 }} defaultValue={[time_begin, time_end]} onChange={(d, t) => { store.time_begin = t[0]; store.time_end = t[1]; }} />
            <span>部门：</span>
            <Select defaultValue={department} onChange={(v) => { store.department = v }} style={{ width: 100, marginRight: 10 }}>
              <Option value={'全部'}>全部</Option></Select>
            <span>申请人：</span> <Input style={{ width: 120, marginRight: 10 }} onChange={(e) => { store.username = e.target.value }} placeholder='全部' />
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.fetchList}>查询</Button>
            <Button type='primary'onClick={()=>{this.export()}} >导出</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <span>状态：</span><Select defaultValue={status} style={{ width: 100, marginRight: 10 }}><Option value={3}>全部</Option></Select>
            <span>开通功能：</span><Select defaultValue={access} style={{ width: 100, marginRight: 10 }}><Option value={'全部'}>全部</Option></Select>
            <Button type='primary' onClick={() => { store.addParams.AddVisible = true }}>新增</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={this.columns} dataSource={dataSource} bordered rowKey='id' ></Table>
          </div>
        </Card>
        <Append props={addParams} />
      </Fragment>
    )
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = (e, page = 1, size = 10) => {
    let { department, time_begin, time_end, status, username, access } = store;
    request({
      url: '/api/v1/access/list',
      method: 'GET',
      data: {
        department,
        username,
        access,
        status,
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
  goDetail = (record) => {
    nextStore.dataSource.clear();
    nextStore.dataSource.push(record);
    let { history } = this.props;
    let id = record.id;
    history.push(`/entrance/progress/${id}`);
  }
  export = () => {
    let { department, time_begin, time_end, status, username, access } = store;
    exportFile({
      url: '/api/v1/access/export',
      data: {
        department,
        username,
        access,
        status,
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
      }
    })
  }
}

export default withRouter(Authority)