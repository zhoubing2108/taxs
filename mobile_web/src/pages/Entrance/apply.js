import React, { Component, Fragment } from 'react';
import { Tabs, WhiteSpace, InputItem, Flex, Radio, List, Checkbox, DatePicker, Button, WingBlank } from 'antd-mobile';
import request from '../../helpers/request';
import st from './entrance.css';
import store from './store';
import { createForm } from 'rc-form';
import { observer } from 'mobx-react';
import moment from 'moment';
const user_type = ['干部职工', '借调人员', '其他人员'];
const access = ['', '地下车库', '电梯及步梯', '资料室', '会议室', '餐厅', '档案资料室', '科室门牌号']
const FlexItem = Flex.Item;
const AgreeItem = Checkbox.AgreeItem;
@observer
class Apply extends Component {
  onRadioChange = (i) => {
    store.RadioValue = i;
  }
  render() {
    return (
      <Fragment>
        <WhiteSpace />
        <Flex style={{ padding: '15px', fontSize: 14, backgroundColor: 'white' }}>
          <FlexItem>
            人员类型：
                </FlexItem>
          {user_type.map(i => (
            <FlexItem key={i}>
              <Radio className='my-radio' key={i} checked={store.RadioValue === i} onChange={() => this.onRadioChange(i)} >
                {i}
              </Radio>
            </FlexItem>
          ))}
        </Flex>
        <WhiteSpace />
        <Flex wrap="wrap" style={{ padding: '15px', fontSize: 14, backgroundColor: 'white' }} >
          <FlexItem>
            开通功能：
                </FlexItem>
          {
            access.map((v, i) => {
              if (i > 0 && i < 3) {
                return (
                  <FlexItem key={i}>
                    <AgreeItem style={{ fontSize: '10px' }} name='test' value={v} >{v}</AgreeItem>
                  </FlexItem>)
              }
            }
            )
          }
          {
            access.map((v, i) => {
              if (i > 2 && i < 3) {
                return (
                  <FlexItem key={i}>
                    <AgreeItem style={{ fontSize: '10px' }} name='test' >{v}</AgreeItem>
                  </FlexItem>)
              }
            }
            )
          }
        </Flex>
        <Flex style={{ padding: '15px', fontSize: 14, backgroundColor: 'white' }}>
          {
            access.map((v, i) => {
              if (i > 2 && i < 6) {
                return (
                  <FlexItem key={i}>
                    <AgreeItem name='test' >{v}</AgreeItem>
                  </FlexItem>)
              }
            }
            )
          }
        </Flex>
        <Flex style={{ padding: '15px', fontSize: 14, backgroundColor: 'white' }}>
          {
            access.map((v, i) => {
              if (i > 5) {
                return (
                  <FlexItem key={i}>
                    <AgreeItem name='test' >{v}<input name={`text-${i}`} style={{ marginLeft: 10, width: 60, border: ' 1px solid  #c8cccf', borderRadius: '4px', }} /> </AgreeItem>
                  </FlexItem>)
              }
            }
            )
          }
        </Flex>
        <WhiteSpace />
        <DatePicker
          mode="date"
          title="请选择日期"
          value={store.deadline}
          onChange={(e) => { store.deadline = e }}
        >
          <List.Item arrow="horizontal">工作截止时间(借调人员):</List.Item>
        </DatePicker>
        <Button style={{ position: 'absolute', width: '100%', bottom: 0 }} type='primary' onClick={this.submit} >提交</Button>
      </Fragment>
    )
  }

  submit = () => {
    let { getFieldsValue } = this.props.form;
    let { deadline, RadioValue } = store;
    deadline = moment(deadline).format('YYYY-MM-DD');
    let obj = document.getElementsByName("test");
    let ele_keshi = document.getElementsByName("text-6");
    let ele_ziliao = document.getElementsByName("text-7");
    let check_val = [];
    for (let k in obj) {
      if (obj[k].checked) {
        if (k == 6) {
          let value_z = '科室资料室' + ele_ziliao[0].value;
          check_val.push(value_z)
        } else if (k == 5) {
          let value_k = '科室' + ele_keshi[0].value;
          check_val.push(value_k);
        } else {
          check_val.push(obj[k].labels[0].innerText);
        }
      }
    }
    let access = check_val.toString();
    if (RadioValue == '借调人员' && deadline == '') {
      alert('请选择日期');
      return false;
    }
    request({
      url: '/api/v1/access/save',
      method: 'POST',
      data: {
        deadline,
        user_type: RadioValue,
        access
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
  }
  getNeedList = () => {
    request({
      url: '/api/v1/flow/ready',
      method: 'GET',
      data: {
        wf_type: 'access_control_t',
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
        wf_type: 'access_control_t',
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
}
const ApplyCom = createForm()(Apply);
export default ApplyCom