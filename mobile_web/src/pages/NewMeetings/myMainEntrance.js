import React, { Component, Fragment } from 'react';
import { Pagination, Tabs, Button, Modal } from 'antd-mobile';
import store from './store';
import request from '../../helpers/request';
import { observer } from 'mobx-react';

const _status = {
  '-1': '不通过',
  '0': '流程中',
  '1': '审批中',
  '2': '通过'
}

@observer
class MyEntrance extends Component {
  componentDidMount() {
    this.fetchList(1);
  }


  render() {
    let { total, dataSource, current, } = store;
    const MeetingList = () => (
      dataSource.map(e => (<div key={e.flow.id} style={{ fontSize: 16, padding: '10px', background: '#eefaff', border: '1px solid #bbe1f1' }}>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>会议时间：{e.meeting_date}</span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>签到时间：{e.time_begin}-{e.time_end}</span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>会议时间：{e.meeting_begin}-{e.time_end}</span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>签到地点：{e.address} </span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>会议主题：{e.theme} </span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>主办部门：{e.host} </span>
      </div>
      )
      )
    )
    return (
      <Fragment>
        <div>
          <div style={{ height: '100%', backgroundColor: '#fff' }}>
            <MeetingList />
            <Pagination total={total} current={current} onChange={(e, i) => { let page = e; this.fetchList(page) }} />
          </div>
        </div>
      </Fragment>
    )
  }

  fetchList = (page) => {
    request({
      url: '/api/v1/meeting/list',
      method: 'GET',
      data: {
        address: '全部',
        theme: '',
        host: '',
        department: '全部',
        page: page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.total = res.last_page;
      }
    })
  }

}

export default MyEntrance