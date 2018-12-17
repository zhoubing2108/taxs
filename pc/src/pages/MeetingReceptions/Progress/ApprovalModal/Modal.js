import React, { Component, Fragment } from 'react';
import { Modal, Radio, Input, Form } from 'antd';
import { observer } from 'mobx-react';
import store from '../store';
import request from '../../../../helpers/request'

const { TextArea } = Input;
const RadioGroup = Radio.Group;

@observer
class Approval extends Component {

  render() {
    let { params, form } = this.props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    let { visible, loading } = params
    return (
      <Fragment>
        <Modal title='审批' visible={visible} onCancel={this.handleCancel} onOk={this.handleOk} okText='确定' cancelText='取消'>
          <Form>
            <div style={{ textAlign: 'center' }}>
              {
                getFieldDecorator('submit_to_save')(
                  <RadioGroup name='submit_to_save'>
                    <Radio value='back' style={{ marginRight: 15 }}>不通过</Radio>
                    <Radio value='ok'>通过</Radio>
                  </RadioGroup>
                )
              }

            </div>
            <div style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              <span style={{ lineHeight: 7 }} >审批意见：</span>
              {
                getFieldDecorator('check_con')(<TextArea rows={4} style={{ width: '60%', marginTop: 15 }} ></TextArea>)
              }

            </div>
          </Form>
        </Modal>
      </Fragment>
    )
  }



  handleCancel = () => {
    store.params.visible = false
  }

  handleOk = () => {
    let { props, wf_fid } = this.props;
    let {info} = props;
    let {flow_id, run_id,flow_process,run_process, nexprocess } = info;
    let values = this.props.form.getFieldsValue();
    let { check_con, submit_to_save} = values;
    request({
      url:'/api/v1/flow/check/pass',
      method:'POST',
      data:{
        check_con,
        flow_id,
        run_id,
        flow_process,
        run_process,
        npid: nexprocess.id,
        wf_fid,
        submit_to_save,
        wf_type:'meeting_recept_t'
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: () => {
        store.params.visible = false        
      },
      complete: (res)=> {
        console.log(res);
      }
    })
  }
}

export default Form.create()(Approval)