import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker, Select, Radio, Checkbox, InputNumber } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../config/common-form';
import request from '../../../helpers/request';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const selectProduct = ['公务接待', '会议', '培训', '党建活动', '离退休活动', '学会活动'];
const selectArea = ['金瑞酒店', '机关食堂'];
const { RangePicker } = DatePicker;

@observer
class Add extends Component {
  render() {
    let { props, form } = this.props;
    let { AddVisible, user_type } = props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    return (
      <Modal visible={AddVisible}
        onCancel={() => { store.addParams.AddVisible = false }}
        onOk={() => { this.add() }}
        width='600px'
        title="围餐预定"
      >
        <Form>
          <FormItem {...commonFormProps} label='来访单位'>
            {
              getFieldDecorator('unit')(
                <Input placeholder='请输入来访单位' style={{ width: 200, marginRight: 10 }} />)
            }
            {
              getFieldDecorator('accompany_count')(
                <span>陪同人数：<InputNumber style={{ width: 100 }} placeholder='人数' /></span>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='公函字号'>
            {
              getFieldDecorator('letter_size')(
                <Input placeholder='请输入公函字号' />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='公函标题'>
            {
              getFieldDecorator('letter_title')(
                <Input placeholder='请输入公函标题' />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='领队人'>
            {
              getFieldDecorator('leader')(
                <Input style={{ width: 100, marginRight: 10 }} placeholder='姓名' />)
            }
            <span>职务：</span>
            {
              getFieldDecorator('post')(
                <Input style={{ width: 100, marginRight: 10 }} placeholder='请输入' />)
            }
            <span>级别：</span>
            {
              getFieldDecorator('grade')(
                <Input style={{ width: 105 }} placeholder='请输入' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='厅级人数'>
            {
              getFieldDecorator('departmental')(
                <InputNumber style={{ width: 60, marginRight: 10 }} placeholder='人数' />)
            }
            <span>处级人数：</span>
            {
              getFieldDecorator('section')(
                <InputNumber style={{ width: 60, marginRight: 10 }} placeholder='人数' />)
            }
            <span>处级以下人数：</span>
            {
              getFieldDecorator('under_section')(
                <InputNumber style={{ width: 100 }} placeholder='人数' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='会议人数'>
            {
              getFieldDecorator('meeting_count')(
                <InputNumber style={{ width: 60, marginRight: 10 }} placeholder='人数' />
              )
            }
            <span>陪同人员名单：</span>
            {
              getFieldDecorator('accompany')(
                <Input style={{ width: 245 }} placeholder='名单' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='接待对象'>
            <span>单位,姓名,职务----按以下格式输入（中国移动,张三,正式员工）<br />注意：使用英文逗号！！多条数据换行填写</span>
            {
              getFieldDecorator('users')(
                <TextArea placeholder='中国移动,张三,正式员工' />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='接待明细'>
            <span>时间,项目内容,地点,费用----按以下格式输入（2018-12-01,内部员工培训,会议室,200） 注意：使用英文逗号！！多条数据换行填写</span>
            {
              getFieldDecorator('detail')(
                <TextArea placeholder='2018-12-01,内部员工培训,会议室,200' />
              )
            }
          </FormItem>
          {/* <FormItem {...commonFormProps} label='男'>
            {
              getFieldDecorator('male')(
                <InputNumber style={{ width: 60, marginRight: 10 }} placeholder='人数' />)
            }
            <span>女：</span>
            {
              getFieldDecorator('female')(
                <InputNumber style={{ width: 60, marginRight: 10 }} placeholder='人数' />)
            }
            <span>拟住酒店：</span>
            {
              getFieldDecorator('hotel')(
                <Input style={{ width: 175 }} placeholder='酒店名称' />)
            }
          </FormItem> */}
          {/* <FormItem {...commonFormProps} label='使用会场'>
            {
              getFieldDecorator('meeting_place')(
                <Input style={{ width: 130, marginRight: 10 }} placeholder='会场名称' />)
            }
            <span>会议时间：</span>
            {
              getFieldDecorator('meeting_date')(
                <DatePicker format='YYYY-MM-DD HH:mm:ss' showTime placeholder='请选择日期时间' />)
            }
          </FormItem> */}

          {/* <FormItem {...commonFormProps} label='公务活动项目'>
            {
              getFieldDecorator('project')(
                <Input />
              )
            }
          </FormItem> */}
          {/* <FormItem {...commonFormProps} label='订餐信息'>
            <span>就餐日期,餐次,用餐人数,就餐地点,费用----(注意：逗号必须使用用英文逗号,多条数据换行填写)--例(2018-01-01,早餐,12,食堂,250) </span>
            {
              getFieldDecorator('meals')(
                <TextArea placeholder='2018-01-01,早餐,12,食堂,250' rows={3} />
              )
            }
          </FormItem> */}

        </Form>
      </Modal>
    )
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { unit, post, grade, leader, departmental, section, under_section, meeting_count, letter_size, letter_title, accompany, accompany_count, users, detail } = values;
    let apply_date = moment().format('YYYY-MM-DD');
    users = users.replace(/[\r\n]/g, 'A');
    detail = detail.replace(/[\r\n]/g, 'A');
    // meeting_date = meeting_date.format('YYYY-MM-DD HH:mm:ss');
    // let time_begin = date_time[0].format('YYYY-MM-DD');
    // let time_end = date_time[1].format('YYYY-MM-DD');
    request({
      url: '/api/v1/meeting/recept/save',
      method: 'POST',
      data: {
        unit,
        post,
        grade,
        leader,
        departmental,
        section,
        under_section,
        meeting_count,
        letter_size,
        letter_title,
        accompany,
        accompany_count,
        users,
        detail
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
    let { department, time_begin, time_end, status, username } = store;
    request({
      url: '/api/v1/meeting/recept/list',
      method: 'GET',
      data: {
        department,
        username,
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
        store.total = res.total;
        store.current = res.current;
      }
    })
  }
}

export default Form.create()(Add)