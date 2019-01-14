import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
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
class BasicType extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };
  componentDidMount() {
    this.getUnit();
    this.getTypeList();
    document.title = '基本资料';
  }

  add = () => {
    let values = this.props.form.getFieldsValue();
    let { c_id, code, name, unit_id, pack, count, format, use_type, min, max } = values;
    let alert = store.alert;
    let imgs = store.imgs.toString();
    request({
      url: '/api/v1/sku/save',
      method: 'POST',
      data: {
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
      success: () => {
        message.success('添加成功');
        this.props.form.resetFields();
        this.setState({ fileList: [] });
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
    this.setState({ fileList })
  };
  handleCancel = () => this.setState({ previewVisible: false });
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  render() {
    let { form } = this.props;
    let { getFieldDecorator } = form;
    let { unitList, addParams, typeList } = store;
    const { previewImage, previewVisible, fileList } = this.state;
    return (
      <Fragment>
        <Layout style={{ background: '#fff' }}>
          <Sider theme='light' >
            <BasicSider />
          </Sider>
          <Content style={{ height: 800, marginLeft: 100 }}>
            <Card title={<span>基本资料</span>} bordered={false} extra={<div><Button size='small' style={{ marginRight: 10 }} type='primary'><Link to='/good/basic/new/'>新建</Link></Button><Button size='small'>导入</Button></div>}>
              <div style={{ textAlign: 'center' }}>
                <Form>
                  <FormItem>
                    <span>类别：</span>
                    {getFieldDecorator('c_id')(
                      <Select style={{ width: '90%' }} placeholder='请选择用品类别' disabled >
                        {
                          typeList ? typeList.map(e => <Option value={e.id} key={e.id}>{e.name}</Option>) :
                            <Option value='打印耗材'>打印耗材</Option>
                        }
                      </Select>
                    )}

                  </FormItem>
                  <FormItem>
                    <span>编号：</span>
                    {getFieldDecorator('code')(
                      <Input style={{ width: '90%' }} placeholder='请输入编号' disabled />
                    )}
                  </FormItem>
                  <FormItem>
                    <span>用品规格：</span>
                    {getFieldDecorator('format')(
                      <Input style={{ width: '90%' }} placeholder='请输入用品规格' disabled />
                    )}
                  </FormItem>
                  <FormItem>
                    <span>用品名称：</span>
                    {getFieldDecorator('name')(
                      <Input style={{ width: '90%' }} placeholder='请输入用品名称' disabled />
                    )}
                  </FormItem>
                  <FormItem>
                    <span>领用方式：</span>
                    {
                      getFieldDecorator('use_type')(
                        <Select style={{ width: '90%' }} placeholder='请选择领用方式' disabled>
                          <Option value='借用'>借用</Option>
                          <Option value='领用'>领用</Option>
                        </Select>
                      )
                    }
                  </FormItem>
                  <FormItem>
                    <span>计量单位：</span>
                    {getFieldDecorator('unit_id')(
                      <Select style={{ width: '20%', marginRight: 10 }} placeholder='请选择计量单位' disabled >
                        {
                          unitList ? unitList.map(e => <Option value={e.id} key={e.id}>{e.name}</Option>) :
                            <Option value={1}>支</Option>
                        }
                      </Select>
                    )}
                    <a onClick={() => { store.addParams.AddVisible = true; return false }} style={{ marginRight: 8 }}>计量单位设置</a>
                    <span>进货包装：</span>
                    {getFieldDecorator('pack')(
                      <Input style={{ width: '20%', marginRight: 8 }} placeholder='请输入包装格式' disabled />
                    )}
                    <span>拆箱比：</span>
                    {getFieldDecorator('count')(
                      <InputNumber min={0} style={{ width: '20%', }} placeholder='请输入拆箱比' disabled />
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
                        onRemove={() => { store.imgs.clear(); this.setState({ fileList: [] }) }}
                      >
                        <Button disabled><Icon type="upload" />Upload</Button>
                      </Upload>
                      <Checkbox disabled style={{ marginLeft: 5 }} defaultChecked onChange={(e) => { if (e.target.checked) { store.alert = 1 } else { store.alert = 2 } }} >启用库存警示功能</Checkbox>
                    </div>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </FormItem>
                  <FormItem>
                    <span>最低警示数量：</span>
                    {getFieldDecorator('min')(
                      <InputNumber min={0} style={{ width: '85%' }} disabled placeholder='请输入最低警示数量' />
                    )}
                  </FormItem>
                  <FormItem>
                    <span>最高警示数量：</span>
                    {getFieldDecorator('max')(
                      <InputNumber min={0} style={{ width: '85%' }} disabled placeholder='请输入最高警示数量' />
                    )}
                  </FormItem>
                  {/* <FormItem>
                    <Button type='primary' style={{ marginRight: 10 }} disabled onClick={this.add}>确定</Button>
                    <Button onClick={() => { }}>返回</Button>
                  </FormItem> */}
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
const defaultPage = Form.create()(BasicType)
export default withRouter(defaultPage)