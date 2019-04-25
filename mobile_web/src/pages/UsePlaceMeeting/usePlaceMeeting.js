import React from 'react';
import store from './store';
import { observer } from 'mobx-react';
import request from '../../helpers/request';
import { Switch, Calendar, DatePicker, List, Picker, WhiteSpace, InputItem, Card, WingBlank, Radio, Flex, Button, TextareaItem } from 'antd-mobile';
import { changeConfirmLocale } from 'antd/lib/modal/locale';
import moment from 'moment';
import getQueryVarible from '../../helpers/get-query-variable';



// const act_types = [
//   {
//     label: '文体活动场地',
//     value: '文体活动场地',
//   },
//   {
//     label: '功能室场地',
//     value: '功能室场地',
//   },  
// ]; 
const act_types = [
  {
    label: '多功能演播室',
    value: '多功能演播室',
  },
  {
    label: '荷塘月色露台',
    value: '荷塘月色露台',
  },
  {
    label: '职工书屋',
    value: '职工书屋',
  },
]
@observer
class UsePlaceCom extends React.Component {
  componentDidMount() {
  }
  handleData = (e) => {
    console.log(store);
    let { reason, unit, space, time_begin, time_end } = store;
    time_begin = moment(time_begin).format('YYYY-MM-DD HH:mm');
    time_end = moment(time_end).format('YYYY-MM-DD HH:mm');
    space = space.toString();
    request({
      url: '/api/v1/multi/save',
      method: 'POST',
      data: {
        unit,
        space,
        time_begin,
        time_end,
        reason
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        alert('提交成功');
        store.tabSelect.selectedTab = 'redTab';
        this.getNeedList();
        this.fetchList(1);
      }
    })
  };
  getNeedList = () => {
    request({
      url: '/api/v1/flow/ready',
      method: 'GET',
      data: {
        wf_type: 'space_multi_t',
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.needList = res;

      }
    })
  }
  fetchList = (page) => {
    request({
      url: '/api/v1/flow/complete',
      method: 'GET',
      data: {
        wf_type: 'space_multi_t',
        page: page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.total = res.last_page
      }
    })
  }
  render() {
    return (
      <div>
        <List className="calendar-list" style={{ backgroundColor: 'white' }}>
          <InputItem
            placeholder="请输入"
            onChange={(e) => { store.unit = e }}
          >使用单位</InputItem>
          <DatePicker
            value={store.time_begin}
            onChange={date => store.time_begin = date}
          >
            <List.Item arrow="horizontal">开始时间</List.Item>
          </DatePicker>
          <DatePicker
            value={store.time_end}
            onChange={date => store.time_end = date}
          >
            <List.Item arrow="horizontal">结束时间</List.Item>
          </DatePicker>
          <Picker
            data={act_types}
            cols={1}
            className="forss"
            value={store.space}
            onChange={(e) => { store.space = e }}
            onOk={(e) => store.space = e}
          >
            <List.Item arrow="horizontal">多功能室名称</List.Item>
          </Picker>
          <List renderHeader={() => '申请使用事由'}>
            <TextareaItem
              placeholder="事由备注"
              rows={5}
              value={store.reason}
              onChange={e => { store.reason = e }}
            // onOk={e => {store.reason = e}}
            />
          </List>
          <WhiteSpace size="lg" />
        </List>
        <Button style={{ position: 'absolute', width: '100%', bottom: 0 }} type="primary" onClick={this.handleData}>提交</Button>
      </div>
    );
  }
}
export default UsePlaceCom;