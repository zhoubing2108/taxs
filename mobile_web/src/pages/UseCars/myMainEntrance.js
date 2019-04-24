import React, { Component, Fragment } from 'react';
import { ListView, Pagination, Tabs, List, Button, TextareaItem, Modal, Picker, InputItem } from 'antd-mobile';
import store from './store';
// 数据要对应
import request from '../../helpers/request';
import { observer } from 'mobx-react';
import getQueryVarible from '../../helpers/get-query-variable';

const operation = Modal.operation;
const prompt = Modal.prompt;
const alert = Modal.alert;
const showAlert = (id) => {
  const alertInstance = alert('Delete', '是否取消申请', [
    { text: '取消', },
    { text: '确定', onPress: () => cancel(id) },
  ]);
  setTimeout(() => {
    alertInstance.close();
  }, 500000);
};

const cancel = (e) => {
  request({
    url: '/api/v1/flow/check/pass',
    method: 'POSt',
    data: {
      wf_fid: e.from_id,
      check_con: store.check_con,
      flow_id: '',
      run_id: e.id,
      flow_process: '',
      run_process: '',
      npid: '',
      submit_to_save: 'cancel',
      wf_type: e.from_table
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
const car_types = [
  {
    label: '公车',
    value: 1,
  },

  {
    label: '租车',
    value: 2,
  },
];
const car_list = [
  { label: '粤J65036-核载人数7', value: '粤J65036-核载人数7' },
  { label: '粤J49635-核载人数5', value: '粤J49635-核载人数5' },
  { label: '粤J44406-核载人数23', value: '粤J44406-核载人数23' },
  { label: '粤J17088-核载人数5', value: '粤J17088-核载人数5' },
  { label: '粤J53728-核载人数7', value: '粤J53728-核载人数7' },
  { label: '粤J82033-核载人数5', value: '粤J82033-核载人数5' },
  { label: '粤J64973-核载人数7', value: '粤J64973-核载人数7' },
  { label: '粤J50562-核载人数7', value: '粤J50562-核载人数7' },
  { label: '粤J63543-核载人数5', value: '粤J63543-核载人数5' },
  { label: '粤J70855-核载人数7', value: '粤J70855-核载人数7' },
  { label: '粤JGS607-核载人数5', value: '粤JGS607-核载人数5' },
  { label: '粤JGS617-核载人数5', value: '粤JGS617-核载人数5' },
  { label: '粤JD7863-核载人数5', value: '粤JD7863-核载人数5' },
  { label: '粤JD7868-核载人数5', value: '粤JD7868-核载人数5' },
  { label: '粤J73739-核载人数5', value: '粤J73739-核载人数5' },
  { label: '粤J68291-核载人数5', value: '粤J68291-核载人数5' },
  { label: '粤J72309-核载人数5', value: '粤J72309-核载人数5' },
  { label: '粤J72335-核载人数5', value: '粤J72335-核载人数5' },
  { label: '粤J72355-核载人数5', value: '粤J72355-核载人数5' },
  { label: '粤J23681-核载人数5', value: '粤J23681-核载人数5' },
  { label: '粤J73052-核载人数9', value: '粤J73052-核载人数9' },
  { label: '粤J64282-核载人数10', value: '粤J64282-核载人数10' },
  { label: '粤J49565-核载人数10', value: '粤J49565-核载人数10' },
];

@observer
class MyEntrance extends Component {
  componentDidMount() {
    this.getNeedList();
    this.fetchList();
  }
  render() {
    let realrole = sessionStorage.getItem('role');
    let { total, dataSource, needList, current, myVisiable, driver, car_info, car_type } = store;
    dataSource = Array.from(dataSource);
    needList = Array.from(needList);
    let carList = Array.from(car_list);
    let carTypes = Array.from(car_types);
    const HistoryList = () => (
      dataSource.map(e => (<div key={e.flow.id} style={{ fontSize: 16, padding: '10px', background: '#eefaff', border: '1px solid #bbe1f1' }}>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.create_time}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.username}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.department}</span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.apply_date}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.phone}</span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>出行人员：{e.flow.members}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>人数：{e.flow.count}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>目的地：{e.flow.address}</span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>出行原因：{e.flow.reason}</span><br />
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
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.username}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.department}</span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.apply_date}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.flow.phone}</span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>出行人员：{e.flow.members}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>人数：{e.flow.count}</span>
        <span style={{ marginRight: '10px', padding: '5px 0', }}>目的地：{e.flow.address}</span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>出行原因：{e.flow.reason}</span><br />
        <span style={{ marginRight: '10px', padding: '5px 0', }}>{e.process[0].admin.username}</span>
        <span style={{ marginRight: '10px', padding: '5px 0 ', }}>{_status[e.flow.status]}</span><br />
        {e.process.map((v, i) => (
          <span key={i}>
            <span style={{ marginRight: '5px', padding: '5px 0 ', }}>{v.admin.username}:{v.btn == 'ok' ? <span style={{ color: 'green' }} style={{}}>通过</span> : <span style={{ color: 'red' }}>不通过</span>}</span>
          </span>))}
        {e.btn == 'cancel' ? <Button onClick={() => showAlert(e)} type='primary' size='small' style={{ display: 'inline-block', height: 24, lineHeight: '24px', margin: '5px 10px 0 0' }}>取消申请</Button> : null}
        {
          e.btn == 'check' ?
            (
              e.process.length == 4 ?
                <span>
                  <Button type='primary' size='small' style={{ display: 'inline-block', height: 24, lineHeight: '24px', margin: '5px 10px 0 0' }}
                    onClick={() => { store.arrangeList = e; store.myVisiable = true }}
                  >安排车辆</Button>

                </span>
                :
                (
                  e.process.length == 3 ?
                    <Button onClick={() => operation([
                      { text: '安排定向化保证车辆', onPress: () => { store.check_con = '安排定向化保证车辆'; this.getCheck(e, 'ok') } },
                      { text: '租赁社会化车辆', onPress: () => { store.check_con = '租赁社会化车辆'; this.getCheck(e, 'ok') } },
                      { text: '不符合申请条件', onPress: () => { store.check_con = '不符合申请条件'; cancel(e) } },
                    ])}
                      type='primary'
                      size='small'
                      style={{ display: 'inline-block', height: 24, lineHeight: '24px', marginRight: '5px', marginTop: '5px' }} >
                      审核
                    </Button> :
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
                )
            ) :
            null
        }
      </div>
      )
      )
    )
    return (
      <Fragment>
        <div>
          <Tabs tabs={tabs} style={{ width: '100%' }} initialPage={0} animated={false} useOnPan={false}>
            <div style={{ height: '100%', backgroundColor: '#fff' }}>
              <NeedList />
              <Modal
                visible={myVisiable}
                transparent
                maskClosable={false}
                title="您的审核意见"
                footer={[{ text: '取消', onPress: () => { store.myVisiable = false } },
                {
                  text: '提交', onPress: () => {
                    this.getCheck(store.arrangeList, 'ok')
                  }
                }
                ]}
              >
                <div style={{ height: 200, overflow: 'scroll' }}>
                  <Picker
                    data={carTypes}
                    cols={1}
                    value={car_type}
                    onChange={(value) => { store.car_type = value }}
                    onPickerChange={(value) => { store.car_type = value }}
                  >
                    <List.Item arrow="horizontal">类型：</List.Item>
                  </Picker>
                  <Picker
                    data={carList}
                    cols={1}
                    value={car_info}
                    onChange={(value) => { store.car_info = value }}
                    onPickerChange={(value) => { store.car_type = value }}
                  >
                    <List.Item arrow="horizontal">车辆：</List.Item>
                  </Picker>
                  <List renderHeader={() => '请在下面输入司机和手机'}></List>
                  <InputItem placeholder="小张13412345678" onChange={(value) => store.driver = value} ></InputItem>
                </div>
              </Modal>
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
  getCheck = (e, type) => {
    request({
      url: '/api/v1/flow/info',
      method: 'GET',
      data: {
        wf_fid: e.from_id,
        wf_type: 'car_t'
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.info = res.info;
        this.pass(e.from_id, type, e.process.length);
      },
    })
  }
  pass = (id, sub_type, step) => {
    let { info, check_con, car_info, car_type, driver } = store;
    let { flow_id, run_id, flow_process, run_process, nexprocess, } = info;
    car_info = car_info.toString();
    car_type = car_type.toString();
    request({
      url: '/api/v1/flow/check/pass',
      method: 'POST',
      data: {
        flow_id,
        run_id,
        flow_process,
        run_process,
        npid: nexprocess.id,
        wf_fid: id,
        check_con,
        submit_to_save: sub_type,
        wf_type: 'car_t',
        car_info,
        driver,
        type: car_type
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: () => {
        store.myvisiable = false;
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
        wf_type: 'car_t',
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
        wf_type: 'car_t',
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