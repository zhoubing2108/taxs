import React, { Component, Fragment } from 'react';
import { Table, Button, DatePicker, Select, Input, Card } from 'antd';
import store from './store';
import { observer } from 'mobx-react';
import request from '../../helpers/request';
import exportFile from '../../helpers/export-file';
import {withRouter} from 'react-router-dom';
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
    let { check_address, check_time_begin, check_time_end, check_dataSource,check_current,check_total } = store;
    return (
      <Fragment>
        <Card>
          <div>
            <span>日期：</span><RangePicker style={{ width: 250, marginRight: 10 }} defaultValue={[check_time_begin, check_time_end]} onChange={(d, t) => { store.check_time_begin = t[0]; store.check_time_end = t[1]; }} />
            <span>部门：</span><Input style={{ width: 120, marginRight: 10 }} placeholder='全部' onChange={(e) => { store.check_deparment = e.target.value }} placeholder='全部' />
            <span>姓名：</span> <Input style={{ width: 120, marginRight: 10 }} onChange={(e) => { store.username = e.target.value }} placeholder='全部' />
            <Button type='primary' style={{ marginRight: 10 }} onClick={() => {this.fetchList(1)} }>查询</Button>
            <Button type='primary' onClick={()=>{this.export()}} >导出</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <span>签到地点：</span><Select defaultValue={check_address} style={{ width: 100, marginRight: 10 }}>
              <Option value="全部">全部</Option>
            </Select>
            <span>会议主题：</span><Input style={{ width: 120, marginRight: 10 }} onChange={(e) => { store.check_theme = e.target.value }} placeholder='全部' />
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={this.columns} dataSource={check_dataSource} rowKey='id' bordered pagination={{ current: check_current, onChange: (e) => { this.fetchList(e) }, total: check_total, }} ></Table>
          </div>
        </Card>
      </Fragment>
    )
  }
  componentDidMount() {
    this.fetchList(1);
    document.title = '会议签到';
  }

  fetchList = (p) => {
    let { check_address, check_theme, check_time_begin, check_time_end, department, username } = store;
    let page = p;
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
        size:10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.check_dataSource = res.data;
        store.check_current = res.current_page;
        store.check_total=res.total;
      }
    })
  }
  export = () => {
    let { check_address, check_theme, check_time_begin, check_time_end, department, username } = store;
    exportFile({
      url: '/api/v1/meeting/sign/in/export',
      data: {
        address: check_address,
        theme: check_theme,
        username,
        department,
        time_begin: check_time_begin.format('YYYY-MM-DD'),
        time_end: check_time_end.format('YYYY-MM-DD'),
      }
    })
  }
}

export default withRouter(CheckIn)