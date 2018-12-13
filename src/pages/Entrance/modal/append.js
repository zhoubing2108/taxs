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
    return (
      <Modal visible={AddVisible}
        onCancel={() => { store.addParams.AddVisible = false }}
        onOk={() => { this.add() }}
        width='600px'
        title='门禁权限开通申请'
        okText='创建'
      >
        <Form>
          {/* <FormItem {...commonFormProps} label='日期'>
            {
              getFieldDecorator('create_date')(<DatePicker />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='申请人'>
            {
              getFieldDecorator('username')(<DatePicker />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='职务'>
            {
              getFieldDecorator('duty')(<DatePicker />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='申请部门'>
            {
              getFieldDecorator('department')(<DatePicker />)
            }
          </FormItem> */}
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
          <FormItem {...commonFormProps} label='开通功能'>
            {
              getFieldDecorator('access')(<CheckboxGroup name="checkboxgroup">
                <Checkbox value="科室门牌号">科室门牌号</Checkbox>
                <Checkbox value="资料室">资料室</Checkbox>
                <Checkbox value="会议室">会议室</Checkbox>
                <Checkbox value="档案室门牌（5、6楼）">档案室门牌（5、6楼）</Checkbox>
                <Checkbox value="地下车库">地下车库</Checkbox>
                <Checkbox value="电梯及步梯">电梯及步梯</Checkbox>
                <Checkbox value="餐厅">餐厅</Checkbox>
              </CheckboxGroup>)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='工作截止日期'>
            {
              getFieldDecorator('deadline')(<DatePicker />)
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { deadline, user_type, access } = values;
    access = access.join(',');
    deadline = deadline.format('YYYY-MM-DD');
    request({
      url: '/api/v1/access/save',
      method: 'POST',
      data: {
        deadline,
        access,
        user_type
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.addParams.AddVisible = false;
      }
    })
  }
}

export default Form.create()(Append)