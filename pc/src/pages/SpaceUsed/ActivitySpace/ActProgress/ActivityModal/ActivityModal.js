import React, { Component, Fragment } from 'react';
import { Modal, Radio, Input, Form } from 'antd';
import { observer } from 'mobx-react';
import store from '../store';
import request from '../../../../../helpers/request'
const { TextArea } = Input;
const RadioGroup = Radio.Group;

@observer
class Activity extends Component {

  render() {
    let { params, form } = this.props;
    let { visible, loading } = params;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    return (
      <Fragment>
        <Modal title='审批' visible={visible} onCancel={this.handleCancel} onOk={this.handleOk} okText='确定' cancelText='取消'>
          <Form>
            <div style={{ textAlign: 'center' }}>
              {
                getFieldDecorator('submit_to_save')(
                  <RadioGroup name='radiogroup'>
                    <Radio value='ok' style={{ marginRight: 15 }}>不通过</Radio>
                    <Radio value='back'>通过</Radio>
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
    let { info } = props;
    let { flow_id, run_id, flow_process, run_process, nexprocess, submit_to_save } = info;
    let values = this.props.form.getFieldsValue();
    let { check_con } = values;
    request({
      url: '/api/v1/flow/check/pass',
      method: 'POST',
      data: {
        check_con,
        flow_id,
        run_id,
        flow_process,
        run_process,
        npid: nexprocess.id,
        submit_to_save,
        wf_fid,
        wf_type: 'space_recreational_t'
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: () => {
        store.params.visible = false;
        this.fetchList()
      },
      complete: (res) => {
        console.log(res);
      }
    })
  }
  fetchList = () => {
    let { props, wf_fid } = this.props;
    var pro = [];
    request({
      url: '/api/v1/flow/info',
      method: 'GET',
      data: {
        wf_type: 'space_recreational_t',
        wf_fid
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.data = res;
        store.info.log = res.info.log;
        store.info.preprocess = res.info.preprocess;
        store.info.proDataSource.clear();
        let step = Object.values(store.info.preprocess);
        store.info.log.forEach((e, index) => {
          pro.push(Object.assign({}, e, { 'step': step[index] }))
        });
        pro.shift();
        store.info.proDataSource = pro;
      },
      complete: () => {
      }
    })
  }
}

export default Form.create()(Activity)