import React, { Component, Fragment } from 'react';
import { Table, DatePicker, Button, Input, Select, Card, message } from 'antd';
import store from './store';
import Append from './append/append';
import Modify from './modify/modify';
import { observer } from 'mobx-react';
import request from '../../helpers/request';
import exportFile from '../../helpers/export-file';
import moment from 'moment';

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
      title: '主办部门',
      dataIndex: 'host'
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
    let { addParams, modifyParams, address, time_begin, time_end, dataSource, editItem, total, current, department, alertDepartment } = store;
    dataSource = dataSource.slice();
    let { globalStore } = this.props;
    let { departmentList, placeList } = globalStore;
    // console.log('alert',alertDepartment);

    return (
      <Fragment>
        <Card>
          <span style={{ marginRight: 5 }}>
            日期:<RangePicker style={{ width: 240, marginLeft: 5 }} defaultValue={[time_begin, time_end]} onChange={(d, t) => { store.time_begin = t[0]; store.time_end = t[1]; }} />
          </span>
          <span>部门：</span>
          <Select defaultValue={department} onChange={(v) => { store.department = v }} style={{ width: 120, marginRight: 10 }}>
            <Option value={'全部'}>全部</Option>
            {departmentList.map(e => <Option value={e.name}>{e.name}</Option>)}
          </Select>
          <span style={{ marginRight: 5 }}>
            签到地点:
            <Select defaultValue={address} onChange={(v) => { store.address = v }} style={{ width: 150, marginLeft: 5 }}>
              <Option value={'全部'}>全部</Option>
              {placeList.map(e => <Option value={e.name}>{e.name}</Option>)}
            </Select>
          </span>
          <span>
            会议主题: <Input style={{ width: 120, marginLeft: 5 }} placeholder='全部' onChange={(e) => { store.theme = e.target.value }} />
          </span>
          <Button type='primary' style={{ marginLeft: 10 }} onClick={() => { this.fetchList(1) }}>查询</Button>
          <Button type='primary' style={{ float: 'right', marginLeft: 5 }} onClick={() => { this.export() }} >导出</Button>
          <Button type='primary' style={{ float: 'right', marginLeft: 5 }} onClick={() => { store.addParams.AddVisible = true }} > 新增</Button>
          <div style={{ marginTop: 15 }}>
            <Table columns={this.columns} dataSource={dataSource} rowKey='id' bordered pagination={{ current: current, onChange: (e) => { this.fetchList(e) }, total: total, }}></Table>
          </div>
        </Card>
        <Append props={addParams} departmentList={alertDepartment} />
        <Modify props={modifyParams} editItem={editItem} departmentList={alertDepartment} />
      </Fragment>
    )
  }
  componentDidMount() {
    document.title = '会议签到';
    this.fetchList(1);
    this.getMeetingRoom();
    this.getDepartment();
  }
  getMeetingRoom = () => {
    request({
      url: '/api/v1/meeting/rooms',
      method: 'GET',
      success: (res) => {
        store.meetingRooms = res;
      }
    })
  }
  getDepartment = () => {
    request({
      url: '/api/v1/department/list',
      method: 'GET',
      success: (res) => {
        store.alertDepartment = res;
      }
    })
  }
  fetchList = (page) => {
    let { address, theme, time_begin, time_end, host,department } = store;
    host = department;
    //部门用host来传，不用department
    request({
      url: '/api/v1/meeting/list',
      method: 'GET',
      data: {
        address,
        theme,
        host,
        time_begin: moment(time_begin).format('YYYY-MM-DD'),
        time_end: moment(time_end).format('YYYY-MM-DD'),
        page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.current = res.current_page;
        store.total = res.total;
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
        message.success('删除成功');
        this.fetchList(1);
      }
    })
  }
  export = () => {
    let { address, theme, time_begin, time_end } = store;
    exportFile({
      url: '/api/v1/meeting/export',
      data: {
        address,
        theme,
        time_begin: moment(time_begin).format('YYYY-MM-DD'),
        time_end: moment(time_end).format('YYYY-MM-DD'),
        token:localStorage.getItem('token')
      }
    })
    
  }
}

export default Meeting