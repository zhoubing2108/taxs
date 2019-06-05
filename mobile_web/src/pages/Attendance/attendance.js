import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import store from './store';
import moment from 'moment';
import style from './attendance.css';
import request from '../../helpers/request';
import { Switch, Calendar, DatePicker, List, Picker, WhiteSpace, InputItem, Card, WingBlank, Radio, Flex, Button, TextareaItem } from 'antd-mobile';

@observer
class Attendance extends Component {
  componentDidMount() {
    document.title = '会议签到';
    this.getRoomList();
  }
  getRoomList = () => {
    request({
      url: '/api/v1/meeting/rooms',
      method: 'GET',
      success: (res) => {
        store.roomList = res.map(e => {
          return {
            value: e.name,
            label: e.name + ',' + e.function + ',' + e.count,
            card: e.card
          }
        });
      },
    })
  }
  getList = () => {
    let { theme, address, time_begin, time_end } = store;
    time_begin = moment(time_begin).format('YYYY-MM-DD');
    time_end = moment(time_end).format('YYYY-MM-DD');
    request({
      url: '/api/v1/meeting/sign/in/list/wx',
      method: 'GET',
      data: {
        // theme:'全部',
        // address,
        meeting_date: time_begin,
        size: 10,
        page: 1,
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        console.log(res);
        store.dataSource = res.data;
        store.total = res.last_page;
      }
    })

  }
  render() {
    let { roomList } = store;
    roomList = Array.from(roomList);
    return (
      <div>
        <List className="calendar-list" style={{ backgroundColor: 'white' }}>

          {/* <InputItem
            placeholder="请输入"
            onChange={(e) => { store.theme = e }}
          >主题</InputItem> */}
          {/* <InputItem
            placeholder="请输入"
            onChange={(e) => { store.address = e }}
          >地点</InputItem> */}
          {/* <Picker
            data={roomList}
            cols={1}
            className="forss"
            value={store.address}
            onChange={(e) => { store.address = e }}
            onOk={(e) => { store.address = e; roomList.forEach((t) => { if (t.value == e[0]) console.log(t.card) }) }}
          >
            <List.Item arrow="horizontal">会议地点</List.Item>
          </Picker> */}

          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />
          <DatePicker
            value={store.time_begin}
            mode='date'
            onChange={date => store.time_begin = date}
          >
            <List.Item arrow="horizontal">开始时间</List.Item>
          </DatePicker>
          {/* <DatePicker
            value={store.time_end}
            mode='date'
            onChange={date => store.time_end = date}
          >
            <List.Item arrow="horizontal">结束时间</List.Item>
          </DatePicker> */}
          <WhiteSpace size="lg" />
          <Button style={{ width: '100%' }} type="primary" onClick={this.getList}>查询</Button>
          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />
          
          {store.dataSource == ''?<div style={{textAlign:'center'}}>暂时没有你的个人历史签到信息！</div>:
          <div>
            <span>
              <table style={{ alignItems: 'center', padding: '10px', width: '100%' }}>
                <tbody>
                  <tr >
                    <td style={{ textAlign: 'center', width: '20%' }}>日期</td>
                    <td style={{ textAlign: 'center', width: '20%' }}>会议主题</td>
                    <td style={{ textAlign: 'center', width: '20%' }}>签到时间</td>
                    <td style={{ textAlign: 'center', width: '20%' }}>会议开始</td>
                    <td style={{ textAlign: 'center', width: '20%' }}>会议开始</td>
                  </tr>
                  {store.dataSource.map((key, index) => {
                    return (
                      <tr >
                        <td style={{ textAlign: 'center', width: '20%' }}>{key.meeting_date}</td>
                        <td style={{ textAlign: 'center', width: '20%' }}>{key.theme}</td>
                        <td style={{ textAlign: 'center', width: '20%' }}>{key.time_begin}</td>
                        <td style={{ textAlign: 'center', width: '20%' }}>{key.time_end}</td>
                        <td style={{ textAlign: 'center', width: '20%' }}>{key.meeting_begin}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </span>
          </div>}
        </List>
      </div>
    )
  }
}
export default Attendance;