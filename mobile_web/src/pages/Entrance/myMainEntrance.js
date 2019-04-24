import React, { Component, Fragment } from 'react';
import { ListView, Pagination, Tabs, Card, Button, Modal } from 'antd-mobile';
import store from './store';
// 数据要对应
import { observer } from 'mobx-react';
import request from '../../helpers/request';
import getQueryVarible from '../../helpers/get-query-variable';

const prompt = Modal.prompt
const alert = Modal.alert;



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
  showAlert = (e) => {
    const alertInstance = alert('Delete', '是否取消申请', [
      { text: '取消', onPress: () => console.log('cancel', e), style: 'default' },
      { text: '确定', onPress: () => this.getCheck(e, 'cancel') },
    ]);
    setTimeout(() => {
      console.log('auto close');
    }, 500000);
  };

  componentDidMount() {
    this.fetchList(1);
    this.getNeedList();
  }

  render() {
    let { total, dataSource, needList, needTotal, current, needCurrent } = store;
    const HistoryList = () => (
      dataSource.map(e => (<div key={e.flow.id} style={{ fontSize: 16, padding: '10px', background: '#eefaff', border: '1px solid #bbe1f1' }}>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.create_time}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.members}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.access}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.deadline}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.user_type}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.process[0].admin.username}</span>
        <span style={{ marginRight: '10px', padding: '5px 0 ', }}>{_status[e.flow.status]}</span><br />
        {e.process.map((v, i) => (
          <span key={i} style={{ marginRight: '20px', padding: '5px 0 ', }}>
            {v.admin.username}:{v.btn == 'Back' ? <span style={{ color: 'red' }}>不通过</span> : <span style={{ color: 'green' }}>通过</span>}
          </span>))}
      </div>
      )
      )
    )
    const NeedList = () => (
      needList.map(e => (<div key={e.flow.id} style={{ fontSize: 16, padding: '10px', background: '#eefaff', border: '1px solid #bbe1f1' }}>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.create_time}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.members}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.access}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.deadline}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.user_type}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.process[0].admin.username}</span>
        <span style={{ marginRight: '10px', padding: '5px 0 ', }}>{_status[e.status]}</span><br />
        {e.process.map((v, i) => (
          <span key={i}>
            <span style={{ marginRight: '5px', padding: '5px 0 ', }}>{v.admin.username}:{v.btn == 'ok' ? <span style={{ color: 'green' }} style={{}}>通过</span> : <span style={{ color: 'red' }}>不通过</span>}</span>
          </span>))}
        {e.btn == 'cancel' ?
          <Button
            onClick={() => this.showAlert(e)} type='primary' size='small' style={{ display: 'inline-block', height: 24, lineHeight: '24px', margin: '5px 10px 0 0' }}>取消申请</Button>
          : null}
        {e.btn == 'check' ?
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
          : null}
      </div>
      )
      )
    )
    return (
      <Fragment>
        <div>
          <Tabs tabs={tabs} style={{ width: '100%' }} initialPage={0} animated={false} useOnPan={true}>
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
  getNeedList = () => {
    request({
      url: '/api/v1/flow/ready',
      method: 'GET',
      data: {
        wf_type: 'access_control_t',
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.needList = res;
        console.log(res.length);
      }
    })
  }

  fetchList = (page) => {
    request({
      url: '/api/v1/flow/complete',
      method: 'GET',
      data: {
        wf_type: 'access_control_t',
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
  getQueryVariable = (variable) => {
    let u_id = sessionStorage.getItem('u_id');
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
  }
  getCheck = (e, type) => {
    request({
      url: '/api/v1/flow/info',
      method: 'GET',
      data: {
        wf_fid: e.from_id,
        wf_type: 'access_control_t'
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.info = res.info;
        this.pass(e.from_id, type);
      },
    })
  }
  pass = (id, type) => {
    let { info, check_con } = store;
    let { flow_id, run_id, flow_process, run_process, nexprocess } = info;
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
        wf_fid: id,
        submit_to_save: type,
        wf_type: 'access_control_t'
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: () => {
        alert('操作成功');
        this.getNeedList();
        this.fetchList(1);
      }
    })
  }
}

export default MyEntrance