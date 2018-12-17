import React, { Component, Fragment } from 'react';
import { Table, Input, Select, DatePicker, Button, Card } from 'antd';
import store from './store';
import nextStore from './Progress/store';
import request from '../../helpers/request';
import {observer} from 'mobx-react';
import Add from './modal/add'; 
import { withRouter } from "react-router-dom";
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
class Diningaround extends Component {
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
      title: '联系人电话',
      dataIndex: 'phone'
    },
    {
      title: '人数',
      dataIndex: 'member'
    },
    {
      title: '桌数',
      dataIndex: 'table_number'
    },
    {
      title: '项目',
      dataIndex: 'product'
    },
    {
      title: '业务内容',
      dataIndex: 'content'
    },
    {
      title: '餐类',
      dataIndex: 'meal_type'
    },
    {
      title: '就餐地点',
      dataIndex: 'meal_space'
    },
    {
      title: '就餐日期',
      dataIndex: 'meal_date'
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
    let { department, username, time_begin, time_end, status, meal, meal_type, dataSource, addParams } = store;
    return (
      <Fragment>
        <Card>
          <div>
            <span>日期：</span><RangePicker style={{ width: 250, marginRight: 10 }} defaultValue={[time_begin, time_end]} onChange={(d, t) => { store.time_begin = t[0]; store.time_end = t[1]; }} />
            <span>部门：</span>
            <Select defaultValue={department} onChange={(v) => { store.department = v }} style={{ width: 100, marginRight: 10 }}>
              <Option value="all">全部</Option>
            </Select>
            <span>申请人：</span> <Input style={{ width: 120, marginRight: 10 }} onChange={(e) => { store.username = e.target.value }} placeholder='全部' />
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.fetchList}>查询</Button>
            <Button type='primary' onClick={this.export} >导出</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <span>状态：</span><Select defaultValue={status} style={{ width: 100, marginRight: 10 }} onChange={(v) => { store.status = v }}><Option value={3}>全部</Option></Select>
            <Button type='primary' onClick={() => {store.addParams.AddVisible = true }} >新增</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={this.columns} dataSource={dataSource} bordered rowKey='id' ></Table>
          </div>
        </Card>
        <Add props={addParams}/>
      </Fragment>
    )
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = (e, page = 1, size = 10) => {
    let { department, username, time_begin, time_end, status, meal, meal_type} = store;
    request({
      url: '/api/v1/official/list',
      method: 'GET',
      data: {
        department,
        username,
        status,
        meal,
        meal_type,
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
    history.push(`/reception/diningProgress/${id}`);
  }
  export = () => {
    let { department, time_begin, time_end, status, username, meal_type } = store;
    exportFile({
      url: '/api/v1/official/export',
      data: {
        department,
        username,
        status,
        meal_type,
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
      }
    })
  }
}

export default withRouter(Diningaround)