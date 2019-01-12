import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker, Select, Radio, Checkbox, Row, Col } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../config/common-form';
import request from '../../../helpers/request';

const FormItem = Form.Item;
const Option = Select.Option;
const format = 'HH:mm';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

@observer
class Append extends Component {
  render() {
    let { props, form } = this.props;
    let { AddVisible, user_type } = props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    let { checkInputVal, members } = store;
    let values = this.props.form.getFieldsValue();
    members.slice();
    let disabled_k = store.disabled_k;
    let disabled_d = store.disabled_d;
    return (
      <Modal visible={AddVisible}
        onCancel={() => { store.addParams.AddVisible = false }}
        onOk={() => { this.add() }}
        width='600px'
        title='门禁权限开通申请'
        okText='创建'
      >
        <Form>
          <FormItem {...commonFormProps} label='人员类型'>
            {
              getFieldDecorator('user_type', { initialValue: user_type })(
                <RadioGroup>
                  <RadioButton value="干部职工">干部职工</RadioButton>
                  <RadioButton value="借调人员">借调人员</RadioButton>
                  <RadioButton value="其他人员">其他人员</RadioButton>
                </RadioGroup>)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='人员名称'>
            {
              getFieldDecorator('members')(
                <Select placeholder='请选择人员------输入可查询' mode='tags' onSearch={this.selectMember} >
                  {members.map(e => <Option key={e.id} value={e.username + '-' + e.post}>{e.username}-{e.post ? e.post : '普通员工'}  </Option>)}
                </Select>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='开通功能'>
            {
              getFieldDecorator('access')(
                <CheckboxGroup name="checkboxgroup">
                  <Checkbox value={1} onChange={(e) => { if (e.target.checked) { store.disabled_k = true } else { store.disabled_k = false } }}>
                    科室门牌号{disabled_k ?
                      (
                        <Input style={{ width: 50 }} size='small' placeholder='门牌' onChange={(e) => { store.checkInputVal_k = e.target.value + '号科室' }} />
                      ) : ''
                    }
                  </Checkbox>
                  <Checkbox value={2} onChange={(e) => { if (e.target.checked) { store.disabled_d = true } else { store.disabled_d = false } }}>
                    档案室门牌（5、6楼）{disabled_d ?
                      (
                        <Input style={{ width: 50 }} size='small' placeholder='门牌' onChange={(e) => { store.checkInputVal_d = e.target.value + '档案室(5、6楼)' }} />
                      ) : ''
                    }</Checkbox>
                  <Checkbox value="科室资料室">科室资料室</Checkbox>
                  <Checkbox value="会议室">会议室</Checkbox>
                  <Checkbox value="地下车库">地下车库</Checkbox>
                  <Checkbox value="电梯及步梯">电梯及步梯</Checkbox>
                  <Checkbox value="餐厅">餐厅</Checkbox>
                </CheckboxGroup>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='工作截止日期'>
            {
              getFieldDecorator('deadline')(<DatePicker placeholder='借调人员必填' />)
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  selectMember = (key) => {
    request({
      url: '/api/v1/admins/access',
      method: 'GET',
      data: {
        key
      },
      beforeSend: (xml) => { xml.setRequestHeader('token', localStorage.getItem('token')) },
      success: (res) => {
        store.members = res
      }
    })
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { deadline, user_type, access, members } = values;
    let { checkInputVal_k, checkInputVal_d } = store;
    checkInputVal_k = checkInputVal_k ? checkInputVal_k : '科室门牌号'
    checkInputVal_d = checkInputVal_d ? checkInputVal_d : '档案资料室'
    members = members.toString()
    access = access.join(',');
    access = access.replace(1, checkInputVal_k);
    access = access.replace(2, checkInputVal_d);
    deadline = deadline ? deadline.format('YYYY-MM-DD') : ''
    request({
      url: '/api/v1/access/save',
      method: 'POST',
      data: {
        deadline,
        access,
        members,
        user_type
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.addParams.AddVisible = false;
        this.fetchList(1);
        this.props.form.resetFields()
      }
    })
  }
  fetchList = (page) => {
    let { department, time_begin, time_end, status, username, access } = store;
    request({
      url: '/api/v1/access/list',
      method: 'GET',
      data: {
        department,
        username,
        access,
        status,
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
        page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.current = res.current;
        store.total = res.total;
      }
    })
  }
}

export default Form.create()(Append)