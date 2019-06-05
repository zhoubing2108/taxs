import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, Icon, Spin, Row, Col } from 'antd'
import st from './login.css'
import request from '../../helpers/request';
import myrequest from '../../helpers/request_zhou';
import store from './store';
import globalStore from '../../globalStore';
import { observer } from 'mobx-react';
import C from 'crypto-js';
import { fail } from 'assert';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" spin />;

@observer
class Login extends Component {
  componentWillMount(){
    

  }
  componentDidMount() {
    document.title = '登陆';
    this.props.form.validateFields();
    this.getVerifyImage();
    
  }
  render() {
    let { globalStore, form } = this.props;
    let { getFieldDecorator, getFieldsError, isFieldTouched, getFieldError } = form;
    let { params, loading } = store;
    let { userRetErr, passwordRetErr,verifyRetErr } = params;
    let isLogin = localStorage.getItem('token');
    let userErr = isFieldTouched('account') && getFieldError('account') || userRetErr;
    let passwordErr = isFieldTouched('pwd') && getFieldError('pwd') || passwordRetErr;
    let verifyErr = isFieldTouched('verify') && getFieldError('verify') || verifyRetErr;
    let btnErr = this.hasErrors(getFieldsError()) || userErr || passwordErr || verifyErr;
    return (
      <div className={st.container}>
        {isLogin ? <Redirect to='/meetings' /> : null}
        <div className={st.form}>
          <Spin spinning={loading} indicator={antIcon} tip='登陆中...'>
            <Form>
              <FormItem
                validateStatus={userErr ? 'error' : ''}
                help={userErr}>
                {getFieldDecorator('account', {
                  rules: [{ required: true, message: '请输入用户名...' }],
                })(
                  <Input
                    autoComplete='off'
                    size='large'
                    onChange={() => { store.params.userRetErr = false; }}
                    addonBefore={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名" />
                )}
              </FormItem>
              <FormItem
                validateStatus={passwordErr ? 'error' : ''}
                help={passwordErr}>
                {getFieldDecorator('pwd', {
                  rules: [{ required: true, message: '请输入密码' }]
                })(
                  <Input
                    autoComplete='off'
                    size='large'
                    type='password'
                    onChange={() => { store.params.passwordRetErr = false; }}
                    addonBefore={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder='密码' />
                )}
              </FormItem>
              <FormItem
                validateStatus={verifyErr ? 'error' : ''}
                help={verifyErr}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    {getFieldDecorator('verify', {
                      rules: [{ required: true, message: '验证码不能为空！' }],
                    })(
                      <Input
                      autoComplete='off'
                      onChange={() => { store.params.verifyRetErr = false; }}
                      placeholder="验证码(不区分大小写)" />
                    )}
                  </Col>
                  <Col span={12} style={{float:'right'}}>
                  <div id='myimg'>
                  <img style={{width:'100%',height: 30,marginTop:-3}} alt="" src={store.baseImg} onClick={(e) => {this.getVerifyImage(e)}}/>
                  </div>
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Button
                  size='large'
                  htmlType="submit"
                  type={'primary'}
                  onClick={this.login}
                  disabled={btnErr}
                  className={st.loginBtn}>登录</Button>
              </FormItem>
            </Form>
          </Spin>
        </div>
      </div>
    )
  }
  mygetVerifyImage(){
    let xhr = new XMLHttpRequest();    
    xhr.open("get",'/api/v1/token/verify', true);
    xhr.responseType = "blob";
    xhr.onload = function() {
        if (this.status == 200) {
            var blob = this.response;
            var img = document.createElement("img");
            img.onload = function(e) {
              window.URL.revokeObjectURL(img.src); 
            };
            img.src = window.URL.createObjectURL(blob);
            // console.log(window.URL.createObjectURL(blob));
            store.baseImg = window.URL.createObjectURL(blob)
            // document.getElementById('myimg').html(img);
    } } 
    xhr.send();
  }
  getVerifyImage = (e) => {
    let xhr = new XMLHttpRequest();    
    xhr.open("get",'/api/v1/token/verify', true);
    xhr.responseType = "blob";
    xhr.onload = function() {
        if (this.status == 200) {
            let blob = this.response;
            let img = document.createElement("img");
            img.onload = function(e) {
              window.URL.revokeObjectURL(img.src); 
            };
            img.src = window.URL.createObjectURL(blob);
            store.baseImg = window.URL.createObjectURL(blob)
    } } 
    xhr.send();
  }
  login = () => {
    let { getFieldsValue } = this.props.form;
    let { globalStore, history } = this.props;
    let values = getFieldsValue();
    let password = values.pwd.toString();
    let account = values.account;
    let verify = values.verify;
    let Ccode = C.SHA1(password);
    request({
      method: 'GET',
      url: '/api/v1/token/admin',
      // data: values,
      data:{
        account,
        verify,
        pwd:Ccode
      },
      success: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        store.params.loginSuccess = true;
        globalStore.loginSuccess = true;
        history.history.push('/');
        this.getDepartment();
      },
      complete: () => {
        this.getVerifyImage();
        this.props.form.setFields({"verify":""});
      }
    })
  }
  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };
  getDepartment = () => {
    request({
      url: '/api/v1/departments',
      method: 'GET',
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        globalStore.departmentList = res;
      }
    })
  }
}

export default Form.create()(Login)