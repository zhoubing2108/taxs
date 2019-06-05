import React from 'react';
import store from './store';
import { observer } from 'mobx-react';
import request from '../../helpers/request';
import { DatePicker, List, Picker, WhiteSpace, InputItem, Checkbox, Flex, Button, TextareaItem } from 'antd-mobile';
import moment from 'moment';

const FlexItem = Flex.Item;
const AgreeItem = Checkbox.AgreeItem;

@observer
class CreateMeeting extends React.Component {
  render() {
    let { hostList, roomList } = store;
    hostList = Array.from(hostList);
    roomList = Array.from(roomList);
    return (
      <div>
        <List className="calendar-list" style={{ backgroundColor: 'white' }}>
          <DatePicker
            mode='date'
            value={store.meeting_date}
            onChange={date => store.meeting_date = date}
          >
            <List.Item arrow="horizontal">开始时间</List.Item>
          </DatePicker>
          <DatePicker
            value={store.time_begin}
            onChange={date => store.time_begin = date}
          >
            <List.Item arrow="horizontal">签到开始时间</List.Item>
          </DatePicker>
          <DatePicker
            value={store.time_end}
            onChange={date => store.time_end = date}
          >
            <List.Item arrow="horizontal">签到结束时间</List.Item>
          </DatePicker>
          <DatePicker
            value={store.meeting_begin}
            onChange={date => store.meeting_begin = date}
          >
            <List.Item arrow="horizontal">会议开始时间</List.Item>
          </DatePicker>
          <DatePicker
            value={store.meeting_end}
            onChange={date => store.meeting_end = date}
          >
            <List.Item arrow="horizontal">会议结束时间</List.Item>
          </DatePicker>
          <Picker
            data={hostList}
            cols={1}
            className="forss"
            value={store.host}
            onChange={(e) => { store.host = e }}
            onOk={(e) => store.host = e}
          >
            <List.Item arrow="horizontal">主办部门</List.Item>
          </Picker>
          <Picker
            data={roomList}
            cols={1}
            className="forss"
            value={store.address}
            onChange={(e) => { store.address = e }}
            onOk={(e) => { store.address = e; roomList.forEach((t) => { if (t.value == e[0]) console.log(t.card) }) }}
          >
            <List.Item arrow="horizontal">会议地点</List.Item>
          </Picker>
          <InputItem
            placeholder="请输入"
            onChange={(e) => { store.theme = e }}
          >会议主题:</InputItem>
          <List>
            <TextareaItem
              title='内容概要：'
              placeholder="请输入"
              rows={1}
              value={store.outline}
              onChange={e => { store.outline = e }}
            />
          </List>
          <List>
            <TextareaItem
              title='备注：'
              placeholder="请输入"
              rows={5}
              value={store.remark}
              onChange={e => { store.remark = e }}
            />
          </List>
          <Flex wrap="wrap" style={{ padding: '5px', fontSize: 14, backgroundColor: 'white' }} >
            <FlexItem style={{ marginLeft: 12, marginRight: -12, fontSize: 16 }}>
              推送部门：
            </FlexItem>
            {/* <span>推送部门</span> */}
            {
              hostList.map((v, i) => {
                if (i < 3) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test'>{v.value}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <Flex style={{ padding: '5px', fontSize: 14, backgroundColor: 'white' }}>
            {
              hostList.map((v, i) => {
                if (i > 2 && i < 7) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test'>{v.value}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <Flex style={{ padding: '5px', fontSize: 14, backgroundColor: 'white' }}>
            {
              hostList.map((v, i) => {
                if (i > 6 && i < 11) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test'>{v.value}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <Flex style={{ padding: '5px', fontSize: 14, backgroundColor: 'white' }}>
            {
              hostList.map((v, i) => {
                if (i > 10 && i < 15) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test'>{v.value}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <Flex style={{ padding: '5px', fontSize: 14, backgroundColor: 'white' }}>
            {
              hostList.map((v, i) => {
                if (i > 14 && i < 19) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test'>{v.value}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <Flex style={{ padding: '5px', fontSize: 14, backgroundColor: 'white' }}>
            {
              hostList.map((v, i) => {
                if (i > 18 && i < 23) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test'>{v.value}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <Flex style={{ padding: '5px', fontSize: 14, backgroundColor: 'white' }}>
            {
              hostList.map((v, i) => {
                if (i > 22 && i < 27) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test'>{v.value}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <Flex style={{ padding: '5px', marginBottom: '50px', fontSize: 14, backgroundColor: 'white' }}>
            {
              hostList.map((v, i) => {
                if (i > 26) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test'>{v.value}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
        </List>
        <Button style={{ position: 'absolute', width: '100%', bottom: 0 }} type="primary" onClick={this.handleData}>提交</Button>
      </div>
    );
  }
  componentDidMount() {
    this.getHostList();
    this.getRoomList();
  }
  getHostList = () => {
    request({
      url: '/api/v1/department/list',
      method: 'GET',
      success: (res) => {
        store.hostList = res.map(e => {
          return {
            value: e.name,
            label: e.name,
          }
        });
      },
    })
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
  fetchList = (page) => {
    request({
      url: '/api/v1/meeting/list',
      method: 'GET',
      data: {
        address: '全部',
        theme: '全部',
        department: '全部',
        page: page,
        size: 10,
        time_begin:'2010-01-02',
        time_end:moment(new Date()).format('YYYY-MM-DD'),
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
  handleData = () => {
    let { time_begin, time_end, host, meeting_date, meeting_begin, meeting_end, remark, outline, theme,address } = store;
    let checkObj = document.getElementsByName('test');
    let pushVal = [];
    host = host.toString();
    checkObj.forEach(e => {
      if (e.checked) { pushVal.push(e.labels[0].innerText) }
    })
    pushVal = pushVal.toString();
    time_begin = moment(time_begin).format('YYYY-MM-DD HH:mm')
    time_end = moment(time_end).format('YYYY-MM-DD HH:mm')
    meeting_begin = moment(meeting_begin).format('YYYY-MM-DD HH:mm')
    meeting_end = moment(meeting_end).format('YYYY-MM-DD HH:mm')
    meeting_date = moment(meeting_date).format('YYYY-MM-DD')
    address = address[0]
    console.log(pushVal, time_begin, time_end, host, meeting_date, meeting_begin, meeting_end, remark, outline, theme)
    request({
      url: '/api/v1/meeting/save',
      method: 'POST',
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      data: {
        time_begin,
        time_end,
        host,
        meeting_date,
        meeting_begin,
        meeting_end,
        remark,
        outline,
        theme,
        push: pushVal,
        address
      },
      success: (res) => {
        alert('提交成功');
        store.tabSelect.selectedTab = 'redTab';
        this.fetchList(1)
      }
    })
  }
}
export default CreateMeeting;