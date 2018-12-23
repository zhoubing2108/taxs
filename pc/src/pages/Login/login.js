import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, Icon, Spin } from 'antd'
import st from './login.css'
import request from '../../helpers/request';
import store from './store';
import { observer } from 'mobx-react';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" spin />;

@observer
class Login extends Component {
  componentDidMount() {
    document.title = '登陆';
    this.props.form.validateFields();
  }
  render() {
    let { globalStore, form } = this.props;
    let { getFieldDecorator, getFieldsError, isFieldTouched, getFieldError } = form;
    let { params, loading } = store;
    let { userRetErr, passwordRetErr } = params;
    let isLogin = localStorage.getItem('token');
    let userErr = isFieldTouched('account') && getFieldError('account') || userRetErr;
    let passwordErr = isFieldTouched('pwd') && getFieldError('pwd') || passwordRetErr;
    let btnErr = this.hasErrors(getFieldsError()) || userErr || passwordErr;
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
  login = () => {
    let { getFieldsValue } = this.props.form;
    let { globalStore, history } = this.props;
    let values = getFieldsValue();
    request({
      method: 'GET',
      url: '/api/v1/token/admin',
      data: values,
      success: (res) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        store.params.loginSuccess = true;
        globalStore.loginSuccess = true;
        history.history.push('/')
      },
      complete: () => {
      }
    })
  }
  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };
}

export default Form.create()(Login)