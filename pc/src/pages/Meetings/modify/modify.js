import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker, Select } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../config/common-form'
import request from '../../../helpers/request';

const FormItem = Form.Item;
const format = 'YYYY-MM-DD HH:mm';
@observer
class Modify extends Component {
  render() {
    let { props, form, editItem, departmentList } = this.props;
    let { ModifyVisible } = props;
    // let ModifyVisible = store.addParams.AddVisible;
    let { meetingRooms } = store;
    meetingRooms.slice();
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    let { address, meeting_date, host, time_begin, time_end, meeting_begin, meeting_end, theme, outline, remark, push } = editItem;
    push ? push = push.split(',') : push = [];
    return (
      <Modal visible={ModifyVisible}
        onCancel={() => { store.modifyParams.ModifyVisible = false }}
        width='600px'
        title='修改会议'
        okText='保存'
        onOk={() => { this.edit() }}
      >
        <Form>
          <FormItem {...commonFormProps} label='日期'>
            {
              getFieldDecorator('meeting_date', {
                initialValue: moment(meeting_date)
              })(<DatePicker />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='主办部门'>
            {
              getFieldDecorator('host', {
                initialValue: host
              })(
                <Select placeholder='请选择主办部门'>
                  {departmentList.map(e => <Option value={e.name} key={e.id}>{e.name}</Option>)}
                </Select>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='签到地点'>
            {
              getFieldDecorator('address',{
                initialValue: address
              })(<Select placeholder='请选择签到地点' onChange={e => { this.findCard(e); }}>
                
                {meetingRooms.map(e => <Option key={e.id} value={e.name}>{e.name + ' ' + e.count + ' 功能：' + e.function}</Option>)}
              </Select>)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='签到开始时间'>
            {
              getFieldDecorator('time_begin', {
                initialValue: moment(time_begin)
              })(<DatePicker showTime format='YYYY-MM-DD HH:mm' placeholder='请选择日期和时间' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='签到截止时间'>
            {
              getFieldDecorator('time_end', {
                initialValue: moment(time_end)
              })(<DatePicker showTime format='YYYY-MM-DD HH:mm' placeholder='请选择日期和时间' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='会议开始时间'>
            {
              getFieldDecorator('meeting_begin', {
                initialValue: moment(meeting_begin)
              })(<DatePicker showTime format='YYYY-MM-DD HH:mm' placeholder='请选择日期和时间' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='会议结束时间'>
            {
              getFieldDecorator('meeting_end', {
                initialValue: moment(meeting_end)
              })(<DatePicker showTime format='YYYY-MM-DD HH:mm' placeholder='请选择日期和时间' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='会议主题'>
            {
              getFieldDecorator('theme', {
                initialValue: theme
              })(<Input placeholder='请输入会议主题' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='内容概要'>
            {
              getFieldDecorator('outline', {
                initialValue: outline
              })(<Input placeholder='请输入内容概要' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='备注'>
            {
              getFieldDecorator('remark', {
                initialValue: remark
              })(<Input />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='推送部门'>
            {
              getFieldDecorator('push', {
                initialValue: push
              })(
                <Select placeholder='请选择推送部门' mode='multiple'>
                  {departmentList.map(e => <Option value={e.name} key={e.id}>{e.name}</Option>)}
                </Select>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  findCard = (name) => {
    let { meetingRooms } = store;
    meetingRooms.slice();
    store.selectedRoom = meetingRooms.find((value) => { return value.name === name });
  }
  edit = () => {
    let values = this.props.form.getFieldsValue();
    let editItem = this.props.editItem;
    let { id } = editItem;
    let { selectedRoom } = store;
    let { card } = selectedRoom;
    let { meeting_date, address, time_begin, time_end, meeting_begin, theme, outline, remark, push, host,meeting_end } = values;
    push = push.toString();
    request({
      url: '/api/v1/meeting/update',
      method: 'POST',
      data: {
        id,
        outline,
        remark,
        host,
        push,
        address,
        theme,
        card,
        meeting_begin: meeting_begin.format(format),
        meeting_end: meeting_end.format(format),
        meeting_date: meeting_date.format('YYYY-MM-DD'),
        time_begin: time_begin.format(format),
        time_end: time_end.format(format)
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: () => {
        store.modifyParams.ModifyVisible = false;
        this.fetchList(1);
      }
    })
  }
  fetchList = (page) => {
    let { address, theme, time_begin, time_end,host,department } = store;
    host = department;
    request({
      url: '/api/v1/meeting/list',
      method: 'GET',
      data: {
        host,
        address,
        theme,
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

export default Form.create()(Modify)