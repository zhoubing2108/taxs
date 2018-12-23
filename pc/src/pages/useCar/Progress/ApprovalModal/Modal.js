import React, { Component, Fragment } from 'react';
import { Modal, Radio, Input, Form, Select } from 'antd';
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
    let { visible, loading } = params;
    let role = localStorage.getItem('role');
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <Fragment>
        <Modal title='审批' visible={visible} onCancel={this.handleCancel} onOk={this.handleOk} okText='确定' cancelText='取消'>
          {role != 37 && role != 34 ? <Form>
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
          </Form> : null}
          {role == 34 ?
            <Form>
              <div style={{ textAlign: 'center' }}>
                {
                  getFieldDecorator('arrange')(
                    <RadioGroup name='arrange'>
                      <Radio style={radioStyle} value='安排定向化保证车辆'>安排定向化保证车辆</Radio>
                      <Radio style={radioStyle} value='租赁社会化车辆'>租赁社会化车辆</Radio>
                      <Radio style={radioStyle} value={3}>不符合申请条件</Radio>
                    </RadioGroup>
                  )
                }</div>
            </Form>
            : null
          }
          {role == 37 ?
            <Form>
              <div style={{ textAlign: 'center' }}>
                {
                  getFieldDecorator('word1')(
                    <RadioGroup name='arCar'>
                      <Radio value='公车'>公车</Radio>
                      <Radio value='租车'>租车</Radio>
                    </RadioGroup>
                  )
                }
                    <div style={{ marginTop: 10 }}>
                      <span>车辆:
                {
                  getFieldDecorator('word2')(
                    <Select style={{ width: 200 }}>
                          <Option value={'粤J00000' + '限载5人'}>粤J00000 限载5人</Option>
                        </Select>
                  )
                }
                </span>
              </div>
                    <div style={{ marginTop: 10 }}>
                      <span>司机:
                {
                  getFieldDecorator('word3')(
                    <Select style={{ width: 200 }}>
                          <Option value={'小杨13712123333'}>小杨13712123333</Option>
                        </Select>
                  )
                }
                </span>
              </div>
              </div>
            </Form>
            : null
          }

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
    let { flow_id, run_id, flow_process, run_process, nexprocess } = info;
    let values = this.props.form.getFieldsValue();
    let { check_con, submit_to_save, arrange, word1, word2, word3 } = values;
    let role = localStorage.getItem('role');
    if (arrange == 3) {
      submit_to_save = 'back';
      check_con = '不符合申请条件';
      console.log(submit_to_save);
    } else if (arrange) {
      submit_to_save = 'ok'
      check_con = arrange;
      console.log(submit_to_save);
    }
    if (role == 37) {
      check_con = word1 + word2 + word3;
      submit_to_save = 'ok'
    }
    console.log(check_con)
    // request({
    //   url: '/api/v1/flow/check/pass',
    //   method: 'POST',
    //   data: {
    //     check_con,
    //     flow_id,
    //     run_id,
    //     flow_process,
    //     run_process,
    //     npid: nexprocess.id,
    //     wf_fid,
    //     submit_to_save,
    //     wf_type: 'car_t'
    //   },
    //   beforeSend: (xml) => {
    //     xml.setRequestHeader('token', localStorage.getItem('token'))
    //   },
    //   success: () => {
    //     store.params.visible = false
    //   },
    //   complete: (res) => {
    //     console.log(res);
    //   }
    // })
  }
}

export default Form.create()(Approval)