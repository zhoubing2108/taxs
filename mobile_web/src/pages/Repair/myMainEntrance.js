import React, { Component, Fragment } from 'react';
import { ListView, List, Pagination, Tabs, Card, Button, Modal, TextareaItem } from 'antd-mobile';
import { Upload, } from 'antd';
import store from './store';

import request from '../../helpers/request';
import { observer } from 'mobx-react';
import getQueryVarible from '../../helpers/get-query-variable';
const operation = Modal.operation;
const prompt = Modal.prompt;
const alert = Modal.alert;
const showAlert = (id) => {
  const alertInstance = alert('Delete', '是否取消申请', [
    { text: 'Cancel', onPress: () => console.log('cancel', id), style: 'default' },
    { text: 'OK', onPress: () => cancel(id) },
  ]);
  setTimeout(() => {
    console.log('auto close');
    alertInstance.close();
  }, 500000);
};
const cancel = (e) => {
  request({
    url: '/api/v1/flow/check/pass',
    method: 'POSt',
    data: {
      wf_fid: e.from_id,
      check_con: '',
      flow_id: '',
      run_id: e.id,
      flow_process: '',
      run_process: '',
      npid: '',
      submit_to_save: 'cancel',
      wf_type: e.from_table,
    },
    beforeSend: (xml) => {
      xml.setRequestHeader('token', sessionStorage.getItem('token'));
    },
    success: (res) => {
      alert('操作成功')
    }
  })
}

const tabs = [
  { title: '待办' },
  { title: '历史记录' },
];
const _status = {
  '-1': '不通过',
  '0': '流程中',
  '1': '审批中',
  '2': '通过'
}


@observer
class MyEntrance extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };


  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    let { total, dataSource, needList, current, machineVisible, myvisiable } = store;
    dataSource = Array.from(dataSource);
    needList = Array.from(needList);
    const HistoryList = () => (
      dataSource.map(e => (<div key={e.flow.id} style={{ fontSize: 16, padding: '10px', background: '#eefaff', border: '1px solid #bbe1f1' }}>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.create_time}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.username}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.department}</span><br />

        <span style={{ marginRight: '10px', padding: '5px 0', }}>物品名称：{e.flow.name}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>具体位置：{e.flow.address}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>详情：{e.flow.remark}</span><br />
        {/* <span style={{ marginRight: '10px', padding: '5px 0', }}><span><a onClick={this.checkImgFirst}>查看图片</a></span></span><br /> */}
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.process[0].admin.username}</span>
        <span style={{ marginRight: '10px', padding: '5px 0 ', }}>{_status[e.flow.status]}</span><br />
        {e.process.map((v, i) => (
          <span key={i} style={{ marginRight: '20px', padding: '5px 0 ', }}>
            {v.admin.username}:{v.btn == 'Back' ? <span style={{ color: 'red' }}>不通过</span> : <span style={{ color: 'green' }}>通过</span>}
          </span>))}
        {/* <span style={{ marginRight: '10px', padding: '5px 0', }}><span><a onClick={this.ckeckImgSecond}>查看图片</a></span></span><br /> */}
      </div>
      )
      )
    )
    const NeedList = () => (
      needList.map(e => {
        return (
          <div key={e.flow.id} style={{ fontSize: 16, padding: '10px', background: '#eefaff', border: '1px solid #bbe1f1' }}>
            <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.create_time}</span>
            <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.username}</span>
            <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.department}</span><br />
            <span style={{ marginRight: '10px', padding: '5px 0', }}>物品名称：{e.flow.name}</span>
            <span style={{ marginRight: '10px', padding: '5px 0', }}>具体位置：{e.flow.address}</span>
            <span style={{ marginRight: '10px', padding: '5px 0', }}>详情：{e.flow.remark}</span><br />
            <span style={{ marginRight: '10px', padding: '5px 0', }}><image src={e.flow.url} /></span><br />
            <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.process[0].admin.username}</span>
            <span style={{ marginRight: '10px', padding: '5px 0 ', }}>{_status[e.flow.status]}</span><br />
            {e.process.map((v, i) => (
              <span key={i}>
                <span style={{ marginRight: '5px', padding: '5px 0 ', }}>{v.admin.username}:{v.btn == 'ok' ? <span style={{ color: 'green' }} style={{}}>通过</span> : <span style={{ color: 'red' }}>不通过</span>}</span>
              </span>))}
            {e.btn == 'cancel' ?
              <Button onClick={() => showAlert(e)}
                type='primary' size='small'
                style={{ display: 'inline-block', height: 24, lineHeight: '24px', margin: '5px 10px 0 0' }}>
                取消申请</Button>
              : null}
            {e.btn == 'check' ?
              (
                e.process.length == 3 && e.from_table == 'repair_other_t' ?
                  <span style={{ margin: '5px 10px 0 0' }}>
                    <Button onClick={() => operation([
                      { text: '水电维修', onPress: () => { store.check_con = '已分配'; store.repair_type = 'a'; this.getCheck(e, 'ok') } },
                      { text: '电器维修', onPress: () => { store.check_con = '已分配'; store.repair_type = 'b'; this.getCheck(e, 'ok') } },
                      { text: '家具维修', onPress: () => { store.check_con = '已分配'; store.repair_type = 'c'; this.getCheck(e, 'ok') } },
                      { text: '门窗维修', onPress: () => { store.check_con = '已分配'; store.repair_type = 'd'; this.getCheck(e, 'ok') } },
                      { text: '电子维修', onPress: () => { store.check_con = '已分配'; store.repair_type = 'e'; this.getCheck(e, 'ok') } },
                    ])}
                      type='primary'
                      size='small'
                      style={{ display: 'inline-block', height: 24, lineHeight: '24px', marginRight: '5px', marginTop: '5px' }} >
                      分配
                    </Button>
                  </span>
                  :
                  (
                    e.process.length == 4 && e.from_table == 'repair_other_t' ?
                      <span style={{ margin: '5px 10px 0 0' }}>
                        <Button onClick={() => { store.modalData = e.flow; store.approvalList = e; store.myvisiable = true }}
                          type='primary'
                          size='small'
                          style={{ display: 'inline-block', height: 24, lineHeight: '24px', marginRight: '5px', marginTop: '5px' }} >
                          跟进
                        </Button>
                        <Modal
                          visible={myvisiable}
                          transparent
                          maskClosable={false}
                          title="您的审核意见"
                          footer={[{ text: '取消', onPress: () => { store.myvisiable = false } },
                          { text: '提交', onPress: () => { this.getCheck(e, 'ok') } }]}
                        >
                          <div style={{ height: 200, overflow: 'scroll' }}>
                            <span>物品名称：{store.modalData.name} </span><br />
                            <span>具体位置：{store.modalData.address} </span><br />
                            <List>
                              <TextareaItem
                                placeholder="请输入反馈情况"
                                rows={3}
                                onChange={e => { store.feedback = e }}
                              />
                            </List>
                            <Upload
                              action="/api/v1/image/upload"
                              listType="text"
                              fileList={fileList}
                              onPreview={this.handlePreview}
                              onChange={this.handleChange}
                            >
                              <Button type='primary' size='small'>上传图片</Button>
                            </Upload>
                          </div>
                        </Modal>
                      </span>
                      :
                      (
                        e.from_table == 'repair_other_t' ?
                          <span style={{ margin: '5px 10px 0 0' }}>
                            <Button onClick={() => prompt('通过', '请输入意见', [
                              { text: '取消' },
                              { text: '提交', onPress: value => { store.check_con = value; this.getCheck(e, 'ok') } },
                            ], 'default', '通过')} type='primary' size='small' style={{ display: 'inline-block', height: 24, lineHeight: '24px', marginRight: '5px' }} >通过</Button>
                            <Button onClick={() => prompt('不通过', '请输入意见', [
                              { text: '取消' },
                              { text: '提交', onPress: value => { store.check_con = value; this.getCheck(e, 'back') } },
                            ], 'default', '通过')} type='primary' size='small' style={{ display: 'inline-block', height: 24, lineHeight: '24px', margin: '5px 10px 0 0' }} >不通过</Button>
                          </span>
                          :
                          null
                      )
                  )
              )
              : null}
            {
              e.btn == 'check' ?
                (
                  e.from_table == 'repair_machine_t' && e.process.length == 3 ?
                    <Fragment>

                      <span style={{ margin: '5px 10px 0 0' }}>
                        <Button onClick={() => {
                          store.machineVisible = true
                          store.modalData = e.flow;
                          store.approvalList = e;
                        }}
                          type='primary'
                          size='small'
                          style={{ display: 'inline-block', height: 24, lineHeight: '24px', marginRight: '5px', marginTop: '5px' }} >
                          跟进
                        </Button>
                      </span>
                      <Modal
                        visible={machineVisible}
                        transparent
                        maskClosable={false}
                        title="您的审核意见"
                        footer={[{ text: '取消', onPress: () => store.machineVisible = false },
                        { text: '提交', onPress: () => { this.getCheck(e, 'ok') } }]}
                      >
                        <div style={{ height: 200, overflow: 'scroll' }}>
                          <span>物品名称：{store.modalData.name} </span><br />
                          <span>具体位置：{store.modalData.address} </span><br />
                          <List>
                            <TextareaItem
                              placeholder="请输入反馈情况"
                              rows={3}
                              onChange={e => { store.feedback = e }}
                            />
                          </List>
                          <Upload
                            action="/api/v1/image/upload"
                            listType="text"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                          >
                            <Button type='primary' size='small'>上传图片</Button>
                          </Upload>
                        </div>
                      </Modal>
                    </Fragment>
                    :
                    (
                      e.from_table == 'repair_machine_t' ?
                        <span style={{ margin: '5px 10px 0 0' }}>
                          <Button onClick={() => prompt('请输入意见', '通过',[
                            { text: '取消' },
                            { text: '提交', onPress: value => { store.check_con = value; this.getCheck(e, 'ok') } },
                          ], 'default', '通过')} type='primary' size='small' style={{ display: 'inline-block', height: 24, lineHeight: '24px', marginRight: '5px' }} >通过</Button>
                          <Button onClick={() => prompt('请输入意见', '不通过',[
                            { text: '取消' },
                            { text: '提交', onPress: value => { store.check_con = value; this.getCheck(e, 'back') } },
                          ], 'default', '不通过')} type='primary' size='small' style={{ display: 'inline-block', height: 24, lineHeight: '24px', margin: '5px 10px 0 0' }} >不通过</Button>
                        </span>
                        :
                        null
                    )
                )
                : null
            }
          </div>
        )
      }
      )
    )
    return (
      <Fragment>
        <div>
          <Tabs tabs={tabs} style={{ width: '100%' }} initialPage={0} animated={false} useOnPan={false}>
            <div style={{ height: '100%', backgroundColor: '#fff' }}>
              <NeedList />
            </div>
            <div style={{ height: '100%', backgroundColor: '#fff' }}>
              <HistoryList />
              <Pagination total={total} current={current} onChange={(e, i) => { let page = e; this.fetchList(page) }} />
            </div>
          </Tabs>
        </div>

      </Fragment>
    )
  }
  componentDidMount() {
    this.getNeedList();
    this.fetchList(1);
  }
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = ({ fileList }) => { console.log(fileList); this.setState({ fileList }) }
  getCheck = (e, type) => {
    request({
      url: '/api/v1/flow/info',
      method: 'GET',
      data: {
        wf_fid: e.from_id,
        wf_type: e.from_table,
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.info = res.info;
        this.pass(e.process.length, res.repair, e.from_table, e.from_id, type);
      },
    })
  }
  pass = (step, repair, wf_type, id, type) => {
    store.imgs.clear();
    let { fileList } = this.state;
    fileList.forEach((e) => {
      store.imgs.push(e.response.id)
    });
    let imgs = store.imgs.toString();
    let { info, check_con, feedback, repair_type } = store;
    if (step == 2) { repair_type = 'e' };
    let { flow_id, run_id, flow_process, run_process, nexprocess, } = info;
    request({
      url: '/api/v1/flow/check/pass/repair',
      method: 'POST',
      data: {
        flow_id,
        run_id,
        flow_process,
        run_process,
        npid: nexprocess.id,
        wf_fid: id,
        check_con,
        submit_to_save: type,
        wf_type: wf_type,
        repair: repair,
        type: repair_type,
        feedback,
        imgs,
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: () => {
        store.myvisiable = false;
        store.myVisiableStep = false;
        alert('操作成功');
        this.getNeedList();
        this.fetchList(1);
      }
    })
  }
  getNeedList = () => {
    request({
      url: '/api/v1/flow/ready',
      method: 'GET',
      data: {
        wf_type: 'repair_t',
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.needList = res;
      }
    })
  }

  fetchList = (page) => {
    request({
      url: '/api/v1/flow/complete',
      method: 'GET',
      data: {
        wf_type: 'repair_t',
        page: page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.total = res.last_page
      }
    })
  }
}

export default MyEntrance