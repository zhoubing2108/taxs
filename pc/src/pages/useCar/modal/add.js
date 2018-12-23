import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker, Select, Radio, Checkbox, InputNumber } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../config/common-form';
import request from '../../../helpers/request';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const _reason_1 = [
  '机密级以上公文或涉密载体的传送或领取',
  '上级部门限定时间的紧急公文的传送或领取'
]
const _reason_2 = [
  '区域内突发事件，到现场了解事件进展情况参与事件处理',
  '处理我局范围内(江门地区）突发事件',
  '参加市委、市政府组织的紧急公务活动',
  '其余紧急公务、突发事件等应急工作',
]
const _reason_3 = [
  '税务征收管理',
  '税务稽查',
  '税收执法检查',
  '监察',
]
const _reason_4 = [
  '接待上级或兄弟市、区相关部门副处级以上领及随行人员',
  '按规定携带机密级以上涉密载体因公出行',
  '出行人数超过3人的',
]
const _reason_5 = [
  '接待上级或兄弟市、区相关部门副处级以上领及随行人员',
  '出行人数超过3人的',
]
@observer
class Add extends Component {
  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      marginBottom: 10,
      marginRight:5
    };
    let { props, form } = this.props;
    let { AddVisible, user_type } = props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    return (
      <Modal visible={AddVisible}
        onCancel={() => { store.addParams.AddVisible = false }}
        onOk={() => { this.add() }}
        width='600px'
        title='用车申请'
      >
        <Form>
          <FormItem {...commonFormProps} label='用车时间'>
            {getFieldDecorator('apply_date')(
              <DatePicker placeholder='请选择时间' showTime format='YYYY-MM-DD HH:mm' style={{ width: 180, marginRight: 10 }} />
            )}
            <span>联系电话:<Input placeholder='请输入联系电话' style={{ width: 160 }} /></span>
          </FormItem>
          <FormItem {...commonFormProps} label='目的地'>
            {getFieldDecorator('address')(
              <Input placeholder='请输入目的地' style={{ width: 300, marginRight: 10 }} />
            )}
            <span>人数: {getFieldDecorator('count')(
              <InputNumber min={0} style={{ width: 65 }} />
            )}</span>
          </FormItem>
          <FormItem {...commonFormProps} label='出行人员'>
            {getFieldDecorator('members')(
              <Input placeholder='请输入出行人员' />
            )}
          </FormItem>
          <FormItem {...commonFormProps} label='用车原因'>
            {getFieldDecorator('type')(
              <RadioGroup>
                <Radio style={radioStyle} value={1}>
                机要通信用车 
                {this.props.form.getFieldsValue().type === 1 ? <Select style={{ width:300 }} onChange={this.onSelectChange} placeholder='请选择'>
                  {_reason_1.map(e => <Option key={e} value={e}>{e}</Option>)}
                </Select> : null }
                </Radio>
                <Radio style={radioStyle} value={2}>
                应急用车
               {this.props.form.getFieldsValue().type === 2 ? <Select style={{ width: 330 }} onChange={this.onSelectChange}placeholder='请选择'>
                  {_reason_2.map(e => <Option key={e} value={e}>{e}</Option>)}
                </Select>: null}
                </Radio>
                <Radio style={radioStyle} value={3}>
                执法执勤用车
               {this.props.form.getFieldsValue().type === 3 ? <Select style={{ width: 300 }} onChange={this.onSelectChange}placeholder='请选择'>
                    {_reason_3.map(e => <Option key={e} value={e}>{e}</Option>)}
                  </Select>: null}
                  </Radio>
                <Radio style={radioStyle} value={4}>
                公务用车
             {this.props.form.getFieldsValue().type === 4 ? <Select style={{ width: 330 }} onChange={this.onSelectChange}placeholder='请选择'>
                      {_reason_4.map(e => <Option key={e} value={e}>{e}</Option>)}
                    </Select> : null}
                </Radio>
                <Radio style={radioStyle} value={5}>
               租赁社会化车辆
             {this.props.form.getFieldsValue().type === 5 ? <Select style={{ width: 288 }} onChange={this.onSelectChange} placeholder='请选择'>
                      {_reason_5.map(e => <Option key={e} value={e}>{e}</Option>)}
                    </Select> : null}
                </Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
  onSelectChange=(e)=>{
    store.selectedReason = e;
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { apply_date, members, count, address } = values;
    let {selectedReason} = store;
    request({
      url: '/api/v1/car/save',
      method: 'POST',
      data: {
        apply_date:apply_date.format('YYYY-MM-DD HH:mm'),
         members,
          count, 
          address,
          reason:selectedReason
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.addParams.AddVisible = false;
        this.fetchList(1);
      }
    })
  }
  fetchList = (page) => {
    let { time_begin, time_end, reason, status, department, username } = store;
    request({
      url: '/api/v1/car/list',
      method: 'GET',
      data: {
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
        reason,
        username,
        status,
        department,
        page,
        size: 10,
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.total = res.total;
        store.current = res.current_page;
      }
    })
  }
}

export default Form.create()(Add)