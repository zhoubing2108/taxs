import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { ListView, Pagination, Tabs, Card } from 'antd-mobile';
import store from './store';
import request from '../../helpers/request';
import {observer} from 'mobx-react';

const tabs = [
  { title: '申请列表' },
  { title: '审批记录' },
];
const _status = {
  '-1': '不通过',
  '0': '保存中',
  '1': '审批中',
  '2': '通过'
}

var data = [
  {
    id: 1,
    create_time: "2018-12-03 10:26:55",
    username: "朱明良",
    department: "办公室",
    role_name: "管理员",
    user_type: "干部职工",
    access: "资料室,会议室",
    deadline: "2018-12-30 00:00:00",
    status: 0,
    admin_id: 1
  },
  {
    id: 2,
    create_time: "2018-12-15 10:26:55",
    username: "rush",
    department: "办公室",
    role_name: "管理员",
    user_type: "干部职工",
    access: "资料室,会议室",
    deadline: "2018-12-30 00:00:00",
    status: 0,
    admin_id: 2
  },
  {
    id: 3,
    create_time: "2018-12-17 10:26:55",
    username: "天华",
    department: "办公室",
    role_name: "管理员",
    user_type: "干部职工",
    access: "资料室,会议室",
    deadline: "2018-12-30 00:00:00",
    status: 0,
    admin_id: 4
  },
];
const NUM_ROWS = 1;
let pageIndex = 0;

function genData(pIndex = 0) {
  const dataBlob = {};
  for (let i = 0; i < NUM_ROWS; i++) {
    const ii = (pIndex * NUM_ROWS) + i;
    dataBlob[`${ii}`] = `row - ${ii}`;
  }
  return dataBlob;
}

@observer
class MyEntrance extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      isLoading: true,
    };
  }


  componentDidMount() {
    setTimeout(() => {
      this.rData = genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 600);
    this.fetchList();
  }

  fetchList = (page, size = 10) => {
    let { time_begin, time_end, status, username, access, department } = store.listParams;
    console.log(time_begin, time_end);
    page = page?page:1
    request({
      url: '/api/v1/access/list',
      method: 'GET',
      data: {
        time_begin:time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
        status,
        username,
        access,
        department,
        page: page ,
        size
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', 'bf2719753b77e79b15da510b59a4f25c')
      },
      success: (res) => {
        data = res.data;
        store.total = res.total
      }
    })

  }

  onEndReached = (event) => {
    // if (this.state.isLoading && !this.state.hasMore) {
    //   return;
    // }
    // console.log('reach end', event);
    // this.setState({ isLoading: true });
    // setTimeout(() => {
    //   this.rData = { ...this.rData, ...genData(++pageIndex) };
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(this.rData),
    //     isLoading: false,
    //   });
    // }, 1000);
  }

  render() {
    let {total} = store;
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      return (
        <div key={rowID} style={{ padding: '0 15px' }}>
          <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
            <div style={{ fontWeight: 'bold', fontSize:16 }}>
              <span>{obj.create_time}  </span>
              <span>{obj.username}  </span>
              <span>{obj.department}  </span>
              <span>{obj.role_name}  </span>
              <span>{obj.access}  </span><br />
              <span>{obj.deadline}  </span>
              <span><a href="" onClick={(e) => e.preventDefault()}>{_status[obj.status]}</a>  </span>
            </div>
          </div>
        </div>
      );
    };
    return (
      <Fragment>
        <div style={{ marginTop: 5 }}>
          <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false}>
            <div style={{ height: '100%', backgroundColor: '#fff' }}>
              <ListView
                ref={el => { this.lv = el; }}
                dataSource={this.state.dataSource}
                renderFooter={() => (<div >
                  {/* {this.state.isLoading ? 'Loading...' : 'Loaded'} */}
                  <Pagination total={total} current={1} onChange={(e,i) => {let page = e;this.fetchList(page)}} />
                </div>)}
                renderRow={row}
                renderSeparator={separator}
                className="am-list"
                useBodyScroll
              />
            </div>
            <div style={{ height: '100%', backgroundColor: '#fff' }}>
            </div>
          </Tabs>
        </div>
      </Fragment>
    )
  }
}

export default MyEntrance