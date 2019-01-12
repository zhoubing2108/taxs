import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Card, Input, Button, Upload, Select, Form, Divider, Icon, Modal, Checkbox, InputNumber, message } from 'antd';
import BasicSider from './sider';
import commonFormProps from '../../../config/common-form';
import request from '../../../helpers/request';
import { observer } from 'mobx-react';
import store from './store';
import Add from './modal/add';

const FormItem = Form.Item;
const { Content, Sider } = Layout;
const Option = Select.Option;


@observer
class ModifyType extends Component {
  // state = {
  //   previewVisible: false,
  //   previewImage: '',
  //   fileList: [],
  // };
  componentDidMount() {
    this.getUnit();
    this.getTypeList();
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { c_id, code, name, unit_id, pack, count, format, use_type, min, max } = values;
    let id = store.defaultData.id;
    let alert = store.alert;
    let imgs = store.imgs.toString();
    request({
      url: '/api/v1/sku/update',
      method: 'POST',
      data: {
        id,
        c_id,
        code,
        name,
        unit_id,
        pack,
        count,
        format,
        use_type,
        alert,
        min,
        max,
        imgs,
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        message.success('修改');
        this.props.form.resetFields();
        // this.setState({ fileList: [] });
        store.imgs.clear();
        this.getNav();
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
  getTypeList = () => {
    request({
      url: '/api/v1/category/list',
      method: 'GET',
      success: (res) => {
        store.typeList = res.data;
      }
    })
  }
  getNav = () => {
    request({
      url: '/api/v1/sku/nav',
      method: 'GET',
      success: (res) => {
        store.NavList = res;
      }
    })
  }
  handleChange = ({ fileList }) => {                                  //处理照片
    store.fileList = fileList;
    console.log(store.fileList);
  };
  handleCancel = () => {
    store.previewVisible = false
  };
  handlePreview = (file) => {
    console.log(file);
    // store.previewImage = file.url;
    // store.previewVisible = true;
  }
  render() {
    let { form, history } = this.props;
    let { getFieldDecorator } = form;
    let { unitList, addParams, typeList, defaultData, fileList } = store;
    let { alert, c_id, code, count, format, max, min, name, pack, unit_id, use_type, imgs } = defaultData;
    alert === 1;
    return (
      <Fragment>
        <Layout style={{ background: '#fff' }}>
          <Sider theme='light' >
            <BasicSider />
          </Sider>
          <Content style={{ height: 800, marginLeft: 100 }}>
            <Card title={<span>基本资料</span>} bordered={false} extra={<Button size='small'>导入</Button>}>
              <div style={{ textAlign: 'center' }}>
                <Form>
                  <FormItem>
                    <span>类别：</span>
                    {getFieldDecorator('c_id', {
                      initialValue: c_id
                    })(
                      <Select style={{ width: '96%' }} placeholder='请选择用品类别' >
                        {
                          typeList ? typeList.map(e => <Option value={e.id} key={e.id}>{e.name}</Option>) :
                            <Option value='打印耗材'>打印耗材</Option>
                        }
                      </Select>
                    )}

                  </FormItem>
                  <FormItem>
                    <span>编号：</span>
                    {getFieldDecorator('code', {
                      initialValue: code
                    })(
                      <Input style={{ width: '96%' }} placeholder='请输入编号' />
                    )}
                  </FormItem>
                  <FormItem>
                    <span>用品规格：</span>
                    {getFieldDecorator('format', {
                      initialValue: format
                    })(
                      <Input style={{ width: '94%' }} placeholder='请输入用品规格' />
                    )}
                  </FormItem>
                  <FormItem>
                    <span>用品名称：</span>
                    {getFieldDecorator('name',
                      {
                        initialValue: name
                      })(
                        <Input style={{ width: '94%' }} placeholder='请输入用品名称' />
                      )}
                  </FormItem>
                  <FormItem>
                    <span>领用方式：</span>
                    {
                      getFieldDecorator('use_type',
                        {
                          initialValue: use_type
                        })(
                          <Select style={{ width: '94%' }} placeholder='请选择领用方式'>
                            <Option value='借用'>借用</Option>
                            <Option value='领用'>领用</Option>
                          </Select>
                        )
                    }
                  </FormItem>
                  <FormItem>
                    <span>计量单位：</span>
                    {getFieldDecorator('unit_id',
                      {
                        initialValue: unit_id
                      })(
                        <Select style={{ width: '20%', marginRight: 10 }} placeholder='请选择计量单位' >
                          {
                            unitList ? unitList.map(e => <Option value={e.id} key={e.id}>{e.name}</Option>) :
                              <Option value={1}>支</Option>
                          }
                        </Select>
                      )}
                    <a onClick={() => { store.addParams.AddVisible = true; return false }} style={{ marginRight: 8 }}>计量单位设置</a>
                    <span>进货包装：</span>
                    {getFieldDecorator('pack',
                      {
                        initialValue: pack
                      })(
                        <Input style={{ width: '27%', marginRight: 8 }} placeholder='请输入包装格式' />
                      )}
                    <span>拆箱比：</span>
                    {getFieldDecorator('count', {
                      initialValue: count
                    })(
                      <InputNumber min={0} style={{ width: '28%', }} placeholder='请输入拆箱比' />
                    )}
                  </FormItem>
                  <FormItem>
                    <div style={{ float: 'left', marginLeft: 8, marginBottom: -30 }}>
                      <span>上传图片：</span>
                      <Upload
                        action="/api/v1/image/upload"
                        listType="picture"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                        onSuccess={(e) => { store.imgs.push(e.id) }}
                        onRemove={() => { store.imgs.clear(); store.fileList.clear() }}
                      >
                        <Button><Icon type="upload" />Upload</Button>
                      </Upload>
                      <Checkbox style={{ marginLeft: 5 }} checked={alert} onChange={(e) => { e.target.checked ? store.alert = 1 : store.alert = 2  }} >启用库存警示功能</Checkbox>
                    </div>
                    <Modal visible={store.previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={store.previewImage} />
                    </Modal>
                  </FormItem>
                  <FormItem>
                    <span>最低警示数量：</span>
                    {getFieldDecorator('min', {
                      initialValue: min
                    })(
                      <InputNumber min={0} style={{ width: '92%' }} placeholder='请输入最低警示数量' />
                    )}
                  </FormItem>
                  <FormItem>
                    <span>最高警示数量：</span>
                    {getFieldDecorator('max',
                      {
                        initialValue: max
                      })(
                        <InputNumber min={0} style={{ width: '92%' }} placeholder='请输入最高警示数量' />
                      )}
                  </FormItem>
                  <FormItem>
                    <Button type='primary' style={{ marginRight: 10 }} onClick={this.add}>修改</Button>
                    <Button onClick={() => {
                      history.push('/good/basic/default')
                    }}>取消</Button>
                  </FormItem>
                </Form>
              </div>
            </Card>
          </Content>
        </Layout>
        <Add props={addParams} />
      </Fragment>
    )
  }
}
const ModifyPage = Form.create()(ModifyType);
export default withRouter(ModifyPage);