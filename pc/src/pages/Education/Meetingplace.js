import React, { Component, Fragment } from 'react';
import { Table, Input, Select, DatePicker, Button, Card } from 'antd';
import store from './store';
import request from '../../helpers/request';
import { observer } from 'mobx-react';
import Add from './modal/add';
import {withRouter} from 'react-router-dom';
import nextStore from './Progress/store';
import exportFile from '../../helpers/export-file'

const { RangePicker } = DatePicker;
const Option = Select.Option;
const _status = {
  '-1': '不通过',
  '0': '保存中',
  '1': '流程中',
  '2': '通过'
}


@observer
class MeetingPlace extends Component {
  columns = [
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
      render: (text, record, columns) => <a onClick={() => { this.goDetail(record) }}>查看进度</a>
    }
  ]
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
            <Button type='primary' onClick={this.export} >导出</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <span>状态：</span><Select defaultValue={status} style={{ width: 100, marginRight: 10 }} onChange={(v) => { store.status = v }} ><Option value={3}>全部</Option></Select>
            <Button type='primary' onClick={() => {store.addParams.AddVisible = true}}>新增</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={this.columns} dataSource={dataSource} rowKey='id' bordered ></Table>
          </div>
        </Card>
        <Add props={addParams} />
      </Fragment>
    )
  }
  componentDidMount() {
    this.fetchList();
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
  goDetail = (record) => {
    nextStore.dataSource.clear();
    nextStore.dataSource.push(record);
    let { history } = this.props;
    let id = record.id;
    history.push(`/education/progress/${id}`);
  }
  export = () => {
    let { time_begin, time_end, status, department, username } = store;
    exportFile({
      url: '/api/v1/meeting/place/export',
      data: {
        department,
        username,
        status,
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
      }
    })
  }
}

export default withRouter(MeetingPlace)