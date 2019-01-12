import React, {Component, Fragment } from 'react';
import {Modal, Input, Form} from 'antd';
import commonFormProps from '../../../../config/common-form';
import {observer} from 'mobx-react';
import store from '../store';
import request from '../../../../helpers/request';

@observer
class Add extends Component {
  add = ()=>{
    let values = this.props.form.getFieldsValue();
    let {name} = values;
    request({
      url:'/api/v1/unit/save',
      method:'POST',
      data:{
        name
      },
      beforeSend:(xml)=>{
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success:()=>{
        this.getUnit();
        this.props.form.resetFields();
        store.addParams.AddVisible = false;
      }
    })
  }
  getUnit = () => {
    request({
      url: '/api/v1/unit/list',
      method: 'GET',
      success: (res) => {
        store.unitList = res;
      }
    })
  }
  render(){
    let { props,form } = this.props;
    let { AddVisible} = props;
    let { getFieldDecorator } = form;
    return(
      <Modal visible={AddVisible} title='计量单位添加' onCancel={()=>{store.addParams.AddVisible = false}} onOk={this.add}>
        <Form>
          <Form.Item label='计量单位' {...commonFormProps}>
          {getFieldDecorator('name')(
            <Input placeholder='请输入计量单位' />
          )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
export default Form.create()(Add);