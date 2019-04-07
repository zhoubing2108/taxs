import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker, Select, Radio, Checkbox, Row, Col, Upload, Icon } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../../config/common-form';
import request from '../../../../helpers/request';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;

@observer
class Append extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
  }

  render() {
    let { props, form } = this.props;
    let { AddVisible, user_type } = props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    let { fileList } = this.state;
    return (
      <Modal visible={AddVisible}
        onCancel={() => { store.addParams.AddVisible = false }}
        onOk={() => { this.add() }}
        width='600px'
        title='报修申请'
        okText='创建'
      >
        <Form>
          <FormItem label='电子设备' {...commonFormProps}>
            {getFieldDecorator('type')(
              <RadioGroup>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </RadioGroup>)}
          </FormItem>
          <FormItem label='物品名称' {...commonFormProps}>
            {getFieldDecorator('name')(
              <Input placeholder='请输入物品名称' />
            )}
          </FormItem>
          <FormItem label='具体门牌位置' {...commonFormProps}>
            {
              getFieldDecorator('address')(
                <Input placeholder='请输入具体位置' />
              )
            }
          </FormItem>
          <FormItem label='详细描述' {...commonFormProps}>
            {
              getFieldDecorator('remark')(
                <TextArea rows={2} />
              )
            }
          </FormItem>
          <FormItem label='上传图片' {...commonFormProps}>
            <Upload
              action='/api/v1/image/upload'
              listType='picture'
              fileList={fileList}
              onChange={this.handleChange}
              onPreview={this.handlePreview}
              onError={(e) => console.log(e)}
            >
              <Button><Icon type="upload" />Upload</Button>
            </Upload>
          </FormItem>
        </Form>
      </Modal>
    )
  }

  add = () => {
    store.imgs.clear();
    let { fileList } = this.state;
    fileList.forEach(e => {
      store.imgs.push(e.response.id)
    });
    let imgs = store.imgs.toString();
    let values = this.props.form.getFieldsValue();
    let { type, name, address, remark } = values;
    request({
      url: '/api/v1/repair/save',
      method: 'POST',
      data: {
        type,
        name,
        address,
        remark,
        imgs
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.addParams.AddVisible = false;
        this.fetchList(1);
        this.props.form.resetFields();
        store.imgs.clear();
        this.setState({
          fileList:[]
        })
      }
    })
  }
  fetchList = (page) => {
    let { department, time_begin, time_end, status, username } = store;
    let t_begin = moment(time_begin).format('YYYY-MM-DD')
    let t_end = moment(time_end).format('YYYY-MM-DD');
    request({
      url: '/api/v1/repair/list',
      method: 'GET',
      data: {
        department,
        username,
        status,
        time_begin: t_begin,
        time_end: t_end,
        page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.current = res.current_page;
        store.total = res.total;
      }
    })
  }

}

export default Form.create()(Append)