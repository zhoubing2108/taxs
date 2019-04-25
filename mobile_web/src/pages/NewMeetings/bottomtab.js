import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { TabBar } from 'antd-mobile';
import MyEntrance from './myMainEntrance';
import { observer } from 'mobx-react';
import st from './meeting.css';
import CreateMeeting from './createMeeting';
import store from './store';
import request from '../../helpers/request'

const tabs = [
  { title: '申请' },
  { title: '我的' },
];



@observer
class NewMeeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'blueTab',
      hidden: false,
      fullScreen: true,
    };
  }
  componentDidMount() {
    document.title = '新增会议'
  }

  fetchList = (page) => {
    request({
      url: '/api/v1/meeting/list',
      method: 'GET',
      data: {
        address:'全部',
        department:'全部',
        theme:'全部',
        page: page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.total = res.last_page;
      }
    })
  }
  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden,
            });
          }}
        >
        </a>
        <a style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              fullScreen: !this.state.fullScreen,
            });
          }}
        >
        </a>
      </div>
    );
  }

  render() {
    return (
      <div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="申请"
            key="apply"
            icon={<div className={st.unSelectedIcon} />}
            selectedIcon={<div className={st.selectedIcon} />}
            selected={store.tabSelect.selectedTab === 'blueTab'}
            onPress={() => { store.tabSelect.selectedTab = 'blueTab'; }}
            data-seed="logId"
          >
            <CreateMeeting />
          </TabBar.Item>
          <TabBar.Item
            icon={<div className={st.mineSelectedIcon} />}
            selectedIcon={<div className={st.unMineSelectedIcon} />}
            title="历史"
            key="mine"
            selected={store.tabSelect.selectedTab === 'redTab'}
            onPress={() => {
              store.tabSelect.selectedTab = 'redTab';
              this.fetchList(1);
            }}
            data-seed="logId1"
          >
            <MyEntrance />
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

export default withRouter(NewMeeting);