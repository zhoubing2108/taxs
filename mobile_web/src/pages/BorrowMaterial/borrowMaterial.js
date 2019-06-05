import React, { Component, Fragment } from 'react';
import { List, Flex, InputItem, Picker, DatePicker, WhiteSpace, Button } from 'antd-mobile';
import style from './borrowmaterial.css'
import store from './store';
import { observer } from 'mobx-react';
import moment from 'moment';
import request from '../../helpers/request';

@observer
class BorrowMaterial extends Component {
  componentDidMount() {
    this.getAllMaterial()
  }
  render() {
    let { materialType, time_begin, time_end, materialMessages, myskuList } = store
    return (
      <div>
        <List className="calendar-list" style={{ backgroundColor: 'white' }}>
          <Flex style={{ padding: '15px' }}>
            <Flex.Item>
              <Picker
                data={myskuList}
                cols={1}
                className="forss"
                value={materialType}
                onChange={(e) => { this.handleTable(e); store.materialType = e }}
                onOk={(e) => { store.materialType = e }}
              >
                <List.Item arrow="horizontal">物品:</List.Item>
              </Picker>
            </Flex.Item>
            <Flex.Item>
              <InputItem
                placeholder="请输入"
                onChange={(e) => { store.count = e }}
                >数量：</InputItem>
            </Flex.Item>
          </Flex>
          <DatePicker
            mode="date"
            value={time_begin}
            onChange={date => store.time_begin = date}
            >
            <List.Item arrow="horizontal">借用时间</List.Item>
          </DatePicker>
          <DatePicker
            mode="date"
            value={time_end}
            onChange={date => store.time_end = date}
            >
            <List.Item arrow="horizontal">归还时间</List.Item>
          </DatePicker>
          <WhiteSpace size="lg" />
          <div>
            <span style={{ float: 'left', paddingLeft: '16px', fontSize: 16 }}>物品信息：</span>
            <span>
              <table className={style.mytable}>
                <tbody>
                  {materialMessages.map((key, index) => {
                    return (
                      <Fragment>
                        <tr>
                          <td style={{ textAlign: 'center', border: '1px solid #ccc', width: '25%' }}>{key.describefir}</td>
                          <td style={{ textAlign: 'center', border: '1px solid #ccc', width: '25%' }}>{key.describesec}</td>
                          <td style={{ textAlign: 'center', border: '1px solid #ccc', width: '25%' }}>{key.describethi}</td>
                          <td style={{ textAlign: 'center', border: '1px solid #ccc', width: '25%' }}>{key.describefou}</td>
                        </tr>
                        <tr >
                          <td style={{ textAlign: 'center', border: '1px solid #ccc', width: '25%' }}>{key.valuefir}</td>
                          <td style={{ textAlign: 'center', border: '1px solid #ccc', width: '25%' }}>{key.valuesec}</td>
                          <td style={{ textAlign: 'center', border: '1px solid #ccc', width: '25%' }}>{key.valuethi}</td>
                          <td style={{ textAlign: 'center', border: '1px solid #ccc', width: '25%' }}>{key.valuefou}</td>
                        </tr>
                      </Fragment>
                    )
                  })
                  }
                </tbody>
              </table>
            </span>
          </div>
        </List>
        <Button style={{ position: 'absolute', width: '100%', bottom: 0 }} type="primary" onClick={this.handleData}>提交</Button>
      </div>
    )
  }
  handleTable = (e) => {
    let currentTable = store.myskuTable.filter((i) => { return i.id == e[0] })
    store.materialMessages = currentTable
  }
  handleData = (e) => {
    let { count, sku_id, time_begin, time_end, materialType } = store;
    time_begin = moment(time_begin).format('YYYY-MM-DD');
    time_end = moment(time_end).format('YYYY-MM-DD');
    let sku_count = parseInt(count);
    sku_id = materialType.toString();
    request({
      url: '/api/v1/collar/use/save',
      method: 'POST',
      data: {
        time_begin,
        time_end,
        sku_count,
        sku_id,
        type: 1,
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        alert('提交成功');
        store.tabSelect.selectedTab = 'redTab';
        this.getNeedList();
        this.fetchList(1);
      }
    })
  };
  getNeedList = () => {
    request({
      url: '/api/v1/flow/ready',
      method: 'GET',
      data: {
        wf_type: 'borrow_t',
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
        wf_type: 'borrow_t',
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
  getAllMaterial = () => {
    request({
      url: '/api/v1/sku/list/use',
      method: 'GET',
      success: (res) => {
        let useList = res.filter((i) => { return i.use_type == '借用' })
        let myAllList = useList.map((e) => {
          return {
            label: e.name,
            value: e.id,
          }
        }
        );
        store.myskuList = myAllList;
        let myAllTable = useList.map((e) => {
          return {
            id: e.id,
            describefir: '物品名称',
            valuefir: e.name,
            describesec: '类别描述',
            valuesec: e.category,
            describethi: '规格型号',
            valuethi: e.format,
            describefou: '库存',
            valuefou: e.stock,
          }
        });
        store.myskuTable = myAllTable;
      }
    })
  }
}
export default BorrowMaterial;