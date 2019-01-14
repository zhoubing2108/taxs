import React, { Component, Fragment } from 'react';
import { Table, Button, DatePicker, Select, Input, Card } from 'antd';
import store from './store';
import { observer } from 'mobx-react';
import request from '../../helpers/request';
import exportFile from '../../helpers/export-file';
import { withRouter } from 'react-router-dom';
import moment from 'moment'

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
    let { check_address, check_time_begin, check_time_end, check_dataSource, check_current, check_total, check_department } = store;
    let { globalStore } = this.props;
    let { departmentList, placeList } = globalStore;
    return (
      <Fragment>
        <Card>
          <div>
            <span>日期：</span><RangePicker style={{ width: 250, marginRight: 10 }} defaultValue={[check_time_begin, check_time_end]} onChange={(d, t) => { store.check_time_begin = t[0]; store.check_time_end = t[1]; }} />
            <span>部门：</span>
            <Select defaultValue={check_department} onChange={(v) => { store.check_department = v }} style={{ width: 150, marginRight: 10 }}>
              <Option value={'全部'}>全部</Option>
              {departmentList.map(e => <Option value={e.name}>{e.name}</Option>)}
            </Select>
            <span>姓名：</span> <Input style={{ width: 120, marginRight: 10 }} onChange={(e) => { store.username = e.target.value }} placeholder='全部' />
            <Button type='primary' style={{ marginRight: 10 }} onClick={() => { this.fetchList(1) }}>查询</Button>
            <Button type='primary' onClick={() => { this.export() }} >导出</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <span style={{ marginRight: 5 }}>
              签到地点:
            <Select defaultValue={check_address} onChange={(v) => { store.check_address = v }} style={{ width: 150, marginLeft: 5 }}>
                <Option value={'全部'}>全部</Option>
                {placeList.map(e => <Option value={e.name}>{e.name}</Option>)}
              </Select>
            </span>
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
    let { check_address, check_theme, check_time_begin, check_time_end, department, username, check_department } = store;
    let page = p;
    let time_begin = moment(check_time_begin).format('YYYY-MM-DD')
    let time_end = moment(check_time_end).format('YYYY-MM-DD')
    console.log()
    request({
      url: '/api/v1/meeting/sign/in/list',
      method: 'GET',
      data: {
        address: check_address,
        theme: check_theme,
        username,
        department: check_department,
        time_begin,
        time_end,
        page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.check_dataSource = res.data;
        store.check_current = res.current_page;
        store.check_total = res.total;
      }
    })
  }
  export = () => {
    let { check_address, check_theme, check_time_begin, check_time_end, department, username } = store;
    let time_begin = moment(check_time_begin).format('YYYY-MM-DD')
    let time_end = moment(check_time_end).format('YYYY-MM-DD')
    exportFile({
      url: '/api/v1/meeting/sign/in/export',
      data: {
        address: check_address,
        theme: check_theme,
        username,
        department,
        time_begin,
        time_end,
      }
    })
  }
}

export default withRouter(CheckIn)