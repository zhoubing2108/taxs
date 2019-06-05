import React, { Component } from 'react';
import { Modal, Form, Button, Input, DatePicker, Select, Checkbox, } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../config/common-form';
import request from '../../../helpers/request';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const TextArea = Input.TextArea;

@observer
class Add extends Component {
  render() {
    let { props, form,departmentList } = this.props;
    let { AddVisible, user_type } = props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    return (
      <Modal visible={AddVisible}
        onCancel={() => { store.addParams.AddVisible = false }}
        onOk={() => { this.add() }}
        width='600px'
        title='会场预定'
      >
        <Form>
          <FormItem {...commonFormProps} label='申请单位'>
            {/* {
              getFieldDecorator('unit')(
                <Input placeholder='请输入申请单位' />)
            } */}
            {
              getFieldDecorator('unit')(
                <Select placeholder='请选择申请单位'>
                  {departmentList.map(e=><Option value={e.name} key={e.id}>{e.name}</Option>)}
                </Select>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='场地名称'>
            {
              getFieldDecorator('place')(
                <Select placeholder='请选择场地'>
                  <Option key='1' value='202会议室'>202会议室</Option>
                  <Option key='2' value='203会议室'>203会议室</Option>
                  <Option key='3' value='多功能会议室' >多功能会议室</Option>
                  <Option key='4' value='一楼报告厅'>一楼报告厅</Option>
                  <Option key='5' value='二楼报告厅'>二楼报告厅</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='场地用途'>
            {
              getFieldDecorator('purpose')(
                <Select placeholder='请选择用途'>
                  <Option key='1' value='会议'>会议</Option>
                  <Option key='2' value='培训'>培训</Option>
                  <Option key='3' value='集中办公' >集中办公</Option>
                  <Option key='4' value='其他' >其他</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='开始使用时间'>
            {
              getFieldDecorator('time_begin')(
                <DatePicker showTime format='YYYY-MM-DD HH:mm' placeholder='请选择日期时间' />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='结束使用时间'>
            {
              getFieldDecorator('time_end')(
                <DatePicker format='YYYY-MM-DD HH:mm' placeholder='请选择日期时间' showTime />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='使用事由'>
            {
              getFieldDecorator('reason')(<Input placeholder='请输入事由' />)
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { unit, reason, purpose, place, time_begin, time_end } = values;
    request({
      url: '/api/v1/meeting/place/save',
      method: 'POST',
      data: {
        unit,
        reason,
        purpose,
        place,
        time_begin:time_begin.format('YYYY-MM-DD HH:mm'),
        time_end: time_end.format('YYYY-MM-DD HH:mm')
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
    let { time_begin, time_end, status, department, username } = store;
    request({
      url: '/api/v1/meeting/place/list',
      method: 'GET',
      data: {
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
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
        store.current = res.current;
      }
    })
  }
}

export default Form.create()(Add)