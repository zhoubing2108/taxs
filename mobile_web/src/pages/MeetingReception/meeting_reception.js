import React from 'react';
import { observer } from 'mobx-react';
import store from './store';
import request from '../../helpers/request';
import { DatePicker, List, Picker, InputItem, Flex, Button, TextareaItem } from 'antd-mobile';
import moment from 'moment';

const products = [
  {
    label: '公务接待',
    value: '公务接待',
  },
  {
    label: '会议',
    value: '会议',
  },
  {
    label: '培训',
    value: '培训',
  },
  {
    label: '党建活动',
    value: '党建活动',
  },
  {
    label: '离退休活动',
    value: '离退休活动',
  },
  {
    label: '学会活动',
    value: '学会活动',
  }
];
const places = [
  {
    label: '金瑞酒店',
    value: '金瑞酒店',
  },
  {
    label: '机关食堂',
    value: '机关食堂',
  },
];
const meeting_counts = [
  {
    label: '0',
    value: '0',
  },
  {
    label: '1',
    value: '1',
  },
  {
    label: '2',
    value: '2',
  },
  {
    label: '3',
    value: '3',
  },
  {
    label: '4',
    value: '4',
  },
  {
    label: '5',
    value: '5',
  },
  {
    label: '6',
    value: '6',
  },
  {
    label: '7',
    value: '7',
  },
  {
    label: '8',
    value: '8',
  },
  {
    label: '9',
    value: '9',
  },
  {
    label: '10',
    value: '10',
  }
];
const meal_types = [
  {
    label: '工作餐',
    value: '工作餐',
  },
  {
    label: '会议餐',
    value: '会议餐',
  },
  {
    label: '培训餐',
    value: '培训餐',
  }
];


@observer
class Order extends React.Component {
  handleData = (e) => {
    let { accompany_count, detail, users, letter_size, letter_title, meeting_begin, unit, leader, post, grade, departmental, section, under_section, meeting_place, meeting_date, meeting_count, accompany, meals } = store;
    departmental = departmental.toString();
    section = section.toString();
    under_section = under_section.toString();
    meeting_count = meeting_count.toString();
    accompany_count = accompany_count.toString();
    meeting_begin = meeting_begin ? moment(meeting_begin).format('YYYY-DD-MM') : ''
    users = users.replace(/[\r\n]/g, 'A');
    detail = detail.replace(/[\r\n]/g, 'A');
    request({
      url: '/api/v1/meeting/recept/save',
      method: 'POST',
      data: {
        unit,
        meeting_begin,
        leader,
        post,
        grade,
        departmental,
        section,
        under_section,
        meeting_place,
        meeting_date,
        meeting_count,
        accompany,
        users,
        detail,
        letter_title,
        letter_size,
        accompany_count
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))

      },
      success: (res) => {
        alert('提交成功')
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
        wf_type: 'meeting_recept_t',
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
        wf_type: 'meeting_recept_t',
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
        <List>
          <Flex style={{ padding: '15px' }}>
            <Flex.Item>
              <InputItem
                placeholder="来访单位"
                onChange={(e) => { store.unit = e }}
              >来访单位</InputItem>
            </Flex.Item>
            <Flex.Item>
              <Picker
                data={meeting_counts}
                cols={1}
                className="forss"
                value={store.accompany_count}
                onChange={(e) => { store.accompany_count = e }}
              >
                <List.Item arrow="horizontal">陪餐人数：</List.Item>
              </Picker>
            </Flex.Item>
          </Flex>
          <InputItem
            placeholder="请输入"
            onChange={(e) => { store.letter_size = e }}
          >公函字号：</InputItem>
          <InputItem
            placeholder="请输入"
            onChange={(e) => { store.letter_title = e }}
          >公函标题：</InputItem>
          <InputItem
            placeholder="请输入"
            onChange={(e) => { store.leader = e }}
          >领队人</InputItem>
          <Flex style={{ padding: '15px' }}>
            <Flex.Item>
              <InputItem
                placeholder="请输入"
                onChange={(e) => { store.post = e }}
              >职务</InputItem>
            </Flex.Item>
            <Flex.Item>
              <InputItem
                placeholder="请输入"
                onChange={(e) => { store.grade = e }}
              >级别</InputItem>
            </Flex.Item>
          </Flex>
          <Flex style={{ padding: '15px' }}>
            <Flex.Item>
              <Picker
                data={meeting_counts}
                cols={1}
                className="forss"
                value={store.departmental}
                onChange={(e) => { store.departmental = e }}
              >
                <List.Item arrow="horizontal">厅级人数：</List.Item>
              </Picker>
            </Flex.Item>
            <Flex.Item>
              <Picker
                data={meeting_counts}
                cols={1}
                className="forss"
                value={store.section}
                onChange={(e) => { store.section = e }}
              >
                <List.Item arrow="horizontal">处级人数：</List.Item>
              </Picker>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <Picker
                data={meeting_counts}
                cols={1}
                className="forss"
                value={store.under_section}
                onChange={(e) => { store.under_section = e }}
              >
                <List.Item arrow="horizontal">处级以下人数：</List.Item>
              </Picker>
            </Flex.Item>
          </Flex>
          <DatePicker
            mode="date"
            title="请选择日期"
            value={store.meeting_begin}
            onChange={(e) => { store.meeting_begin = e }}
            onOk={(e) => { console.log(e) }}
          >
            <List.Item arrow="horizontal">会议时间:</List.Item>
          </DatePicker>
          <Picker
            data={meeting_counts}
            cols={1}
            className="forss"
            value={store.meeting_count}
            onChange={(e) => { store.meeting_count = e }}
          >
            <List.Item arrow="horizontal">会议人数：</List.Item>
          </Picker>
          <InputItem
            placeholder="请输入"
            onChange={(e) => { store.accompany = e }}
          >陪同人名单：</InputItem>
          <List renderHeader={() => '接待对象：姓名,单位,职务(例:张三,中国移动,正式员工)多条数据换行填写'}>
            <TextareaItem
              placeholder="张三,中国移动,正式员工"
              rows={5}
              value={store.users}
              onChange={e => { store.users = e }}
            />
          </List>
          <List renderHeader={() => '接待明细：时间,项目内容,地点,费用(例:2018-12-01,内部员工培训,会议室,200)多条数据换行填写'}>
            <TextareaItem
              placeholder="2018-12-01,内部员工培训,会议室,200"
              rows={5}
              value={store.detail}
              onChange={e => { store.detail = e }}
            />
          </List>
        </List>
        <Button type="primary" style={{ position: 'absolute', width: '100%', bottom: 0 }} onClick={this.handleData}>提交</Button>
      </div>
    )

  }
}
export default Order