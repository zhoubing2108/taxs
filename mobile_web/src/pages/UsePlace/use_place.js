import React from 'react';
import store from './store';
import { observer } from 'mobx-react';
import request from '../../helpers/request';
import { DatePicker, List, Picker, WhiteSpace, InputItem, Checkbox, Flex, Button, TextareaItem } from 'antd-mobile';
import moment from 'moment';

const FlexItem = Flex.Item;
const AgreeItem = Checkbox.AgreeItem;
const placeItem = [
  '1号气排球场',
  '2号气排球场',
  '1号羽毛球场',
  '2号羽毛球场',
  '1号网球场',
  '2号网球场',
  '1号乒乓球场',
  '2号乒乓球场',
  '1号健身室',
  '2号健身室',
  '1号棋牌室',
  '2号棋牌室',
  '英式台球',
  '美式台球',
  '健身舞室',
  '篮球场',
]

const act_types = [
  {
    label: '1号气排球场',
    value: '1号气排球场',
  },
  {
    label: '2号气排球场',
    value: '2号气排球场',
  }, {
    label: '1号羽毛球场',
    value: '1号羽毛球场',
  },
  {
    label: '2号羽毛球场',
    value: '2号羽毛球场',
  },
  {
    label: '1号网球场',
    value: '1号网球场',
  },
  {
    label: '2号网球场',
    value: '2号网球场',
  },
  {
    label: '1号乒乓球场',
    value: '1号乒乓球场',
  },
  {
    label: '2号乒乓球场',
    value: '2号乒乓球场',
  },
  {
    label: '1号健身室',
    value: '1号健身室',
  },
  {
    label: '2号健身室',
    value: '2号健身室',
  },
  {
    label: '1号棋牌室',
    value: '1号棋牌室',
  },
  {
    label: '2号棋牌室',
    value: '2号棋牌室',
  },
  {
    label: '英式台球',
    value: '英式台球',
  },
  {
    label: '美式台球',
    value: '美式台球',
  },
  {
    label: '健身舞室',
    value: '健身舞室',
  },
  {
    label: '篮球',
    value: '篮球',
  }
];
@observer
class UsePlaceCom extends React.Component {
  handleData = (e) => {
    let { unit, time_begin, user_count, time_end } = store;
    time_begin = moment(time_begin).format('YYYY-MM-DD HH:mm');
    time_end = moment(time_end).format('YYYY-MM-DD HH:mm');
    user_count = parseInt(user_count);
    let obj = document.getElementsByName("test");
    let check_val = [];
    for (let k in obj) {
      if (obj[k].checked) {
        check_val.push(obj[k].labels[0].innerText);
      }
    }
    let space = check_val.toString();
    request({
      url: '/api/v1/recreational/save',
      method: 'POST',
      data: {
        unit,
        space,
        time_begin,
        time_end,
        user_count
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
        wf_type: 'space_recreational_t',
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
        wf_type: 'space_recreational_t',
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
  onClick = () => {
    store.prespace_type = act_types;
    store.cols = 1;
  };
  onPickerChange = (val) => {
    store.cols = 1;
    let d = store.prespace_type;
    store.asyncValue = val;
    if (val[0] === '功能室场地') {
      d.forEach((i) => {
        if (i.value === '功能室场地') {
          store.cols = 2;
          if (!i.children) {
            i.children = [{
              value: '功能室场地-会议室',
              label: '会议室',
            }, {
              value: '功能室场地-办公室',
              label: '办公室',
            }];
          }
        }
      });
    } else {
      store.cols = 1;
    }
    store.prespace_type = d;
    store.asyncValue = val;
    //上面完成判断后直接拿到onPickerChange触发的值并更新能展示在页面的值asyncValue;
    //d被上面的if修饰过，与用于展示的asyncValue不同,d是包含children，asyncValues是选好的精确值
  };


  render() {
    return (
      <div>
        <List className="calendar-list" style={{ backgroundColor: 'white' }}>
          <InputItem
            placeholder="请输入"
            onChange={(e) => { store.unit = e }}
          >使用单位:</InputItem>
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
          <InputItem
            placeholder="请输入人数"
            onChange={(e) => { store.user_count = e }}
          >人数:</InputItem>
          <Flex wrap="wrap" style={{ padding: '15px', fontSize: 14, backgroundColor: 'white' }} >
            <FlexItem>
              场地选择：
                </FlexItem>
            {
              placeItem.map((v, i) => {
                if (i < 2) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem style={{ fontSize: '10px' }} name='test' value={v} onChange={e => console.log('checkbox', e)}>{v}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
            {
              placeItem.map((v, i) => {
                if (i > 1 && i < 3) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem style={{ fontSize: '10px' }} name='test' onChange={e => console.log('checkbox', e)}>{v}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <Flex style={{ padding: '15px', fontSize: 14, backgroundColor: 'white' }}>
            {
              placeItem.map((v, i) => {
                if (i > 2 && i < 7) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test' onChange={e => console.log('checkbox', e)}>{v}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <Flex style={{ padding: '15px', fontSize: 14, backgroundColor: 'white' }}>
            {
              placeItem.map((v, i) => {
                if (i > 6 && i < 11) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test' onChange={e => console.log('checkbox', e)}>{v}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <Flex style={{ padding: '15px', fontSize: 14, backgroundColor: 'white' }}>
            {
              placeItem.map((v, i) => {
                if (i > 10 && i < 15) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test' onChange={e => console.log('checkbox', e)}>{v}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <Flex style={{ padding: '15px', fontSize: 14, backgroundColor: 'white' }}>
            {
              placeItem.map((v, i) => {
                if (i > 14) {
                  return (
                    <FlexItem key={i}>
                      <AgreeItem name='test' onChange={e => console.log('checkbox', e)}>{v}</AgreeItem>
                    </FlexItem>)
                }
              }
              )
            }
          </Flex>
          <List>
            <TextareaItem
              title='申请事由：'
              placeholder="请输入原因"
              rows={5}
              value={store.reason}
              onChange={e => { store.reason = e }}
            />
          </List>
        </List>
        <Button style={{ position: 'absolute', width: '100%', bottom: 0 }} type="primary" onClick={this.handleData}>提交</Button>
      </div>
    );
  }
}
export default UsePlaceCom;