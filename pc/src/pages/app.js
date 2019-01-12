import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import HeaderInclude from '../components/header';
import SiderMenu from '../components/sider';
import { Route, Switch, Redirect } from 'react-router-dom';
import st from './index.css'
const { Header, Content, Sider, Footer } = Layout;

class App extends Component {
  render() {
    let { globalStore, history } = this.props;
    let { loginSuccess } = globalStore
    let pathName = this.props.history.location.pathname;
    let atLogin = pathName === '/login'
    let unLogin = pathName === '/login' || (pathName !== '/login' && localStorage.getItem('token'));
    return unLogin ? (
      <Layout>
        <Header className={st.header}>
          <HeaderInclude history={history} />
        </Header>
        <Layout>
          {
            !atLogin ? (
              <Sider width={200} style={{ background: '#fff' }}>
                <Switch>
                  <Route path='/userAuthority/' render={() => <WrapperComponent Comp={import('../components/userSider')} />} />
                  <Route path='/good/' render={() => <WrapperComponent Comp={import('../components/goodSider')} />} />
                  <Route path='/' render={() => <WrapperComponent Comp={import('../components/sider')} />} />
                </Switch>
              </Sider>)
              : null
          }
          {/* //   <SiderMenu /> */}
          <Layout style={{ background: '#eee', padding: '0 24px 24px' }}>
            {/* {
              !atLogin ? (<span>
                您现在的位置：
            <Breadcrumb style={{ margin: '16px 0', display: 'inline' }}>
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>List</Breadcrumb.Item>
                  <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
              </span>) : null} */}
            <Content style={{ padding: '10px 0', margin: 0, minHeight: 800 }}>
              <div>
                <Switch>
                  <Route path='/meetings' render={() => <WrapperComponent Comp={import('./Meetings/meeting')} globalStore={globalStore} name='newMeeting' />} />
                  <Route path='/checkIn' render={() => <WrapperComponent Comp={import('./Meetings/checkIn')} globalStore={globalStore} name='CheckIn' />} />
                  <Route path='/good/type/' render={() => <WrapperComponent Comp={import('./usingGood/goodTypes/goodType')} globalStore={globalStore} name='goodstype' />} />
                  <Route path='/good/repair/' render={() => <WrapperComponent Comp={import('./usingGood/repair/Repaired')} globalStore={globalStore} name='repair' />} />
                  <Route path='/good/repairProgress/:id' render={() => <WrapperComponent Comp={import('./usingGood/repair/Progress/Progress')} globalStore={globalStore} name='repairPg' />} />
                  <Route path='/good/borrow/' render={() => <WrapperComponent Comp={import('./usingGood/borrow/borrow')} globalStore={globalStore} name='borrow' />} />
                  <Route path='/good/recipients/' render={() => <WrapperComponent Comp={import('./usingGood/recipients/recipients')} globalStore={globalStore} name='recipients' />} />
                  <Route path='/good/warehousing/' render={() => <WrapperComponent Comp={import('./usingGood/Warehousing/warehousing')} globalStore={globalStore} name='warehousing' />} />
                  <Route path='/good/basic/default/' render={() => <WrapperComponent Comp={import('./usingGood/BasicMsg/default')} globalStore={globalStore} name='defalut' />} />
                  <Route path='/good/basic/new/' render={() => <WrapperComponent Comp={import('./usingGood/BasicMsg/Basic')} globalStore={globalStore} name='basic' />} />
                  <Route path='/good/basic/modify/' render={() => <WrapperComponent Comp={import('./usingGood/BasicMsg/modify')} globalStore={globalStore} name='modify' />} />
                  <Route path='/entrance/authority' render={(history) => <WrapperComponent Comp={import('./Entrance/Entrance')} history={history} globalStore={globalStore} name='Entrance' dtitle='门禁权限' />} />
                  <Route path='/entrance/progress/:id/' render={() => <WrapperComponent Comp={import('./Entrance/Progress/Progress')} globalStore={globalStore} name='EntranceProgress' />} />
                  <Route path='/space/activity' render={() => <WrapperComponent Comp={import('./SpaceUsed/ActivitySpace/ActivitieSpace')} globalStore={globalStore} name='ActicitySpace' />} />
                  <Route path='/space/actProgress/:id/' render={() => <WrapperComponent Comp={import('./SpaceUsed/ActivitySpace/ActProgress/Progress')} globalStore={globalStore} name='ActProgress' />} />
                  <Route path='/space/fnRoom' render={() => <WrapperComponent Comp={import('./SpaceUsed/FunctionRoom/FunctionRoom')} globalStore={globalStore} name='FnRoom' />} />
                  <Route path='/space/fnProgress/:id/' render={() => <WrapperComponent Comp={import('./SpaceUsed/FunctionRoom/fnRoomPg/Progress')} globalStore={globalStore} name='FnProgress' />} />
                  <Route path='/education/meetingplace' render={() => <WrapperComponent Comp={import('./Education/Meetingplace')} globalStore={globalStore} name='Meetingplace' />} />
                  <Route path='/education/progress/:id/' render={() => <WrapperComponent Comp={import('./Education/Progress/Progress')} globalStore={globalStore} name='Meetingplace' />} />
                  <Route path='/hotelBooking/' render={() => <WrapperComponent Comp={import('./officialReceptions/Diningaround')} globalStore={globalStore} name='DiningAround' />} />
                  <Route path='/diningProgress/:id/' render={() => <WrapperComponent Comp={import('./officialReceptions/Progress/Progress')} globalStore={globalStore} name='DiningProgress' />} />
                  <Route path='/meetingReception/' render={() => <WrapperComponent Comp={import('./MeetingReceptions/meetingReceptions')} globalStore={globalStore} name='MeetingReception' />} />
                  <Route path='/buffetReception/' render={() => <WrapperComponent Comp={import('./officialReceptions/buffet/buffet')} globalStore={globalStore} name='BuffetReception' />} />
                  <Route path='/buffetProgress/:id/' render={() => <WrapperComponent Comp={import('./officialReceptions/buffet/Progress/Progress')} globalStore={globalStore} name='BuffetProgress' />} />
                  <Route path='/meetingProgress/:id/' render={() => <WrapperComponent Comp={import('./MeetingReceptions/Progress/Progress')} globalStore={globalStore} name='MeetingReceptionProgress' />} />
                  <Route path='/useCar/' render={() => <WrapperComponent Comp={import('./useCar/useCar')} globalStore={globalStore} name='useCar' />} />
                  <Route path='/carProgress/:id/' render={() => <WrapperComponent Comp={import('./useCar/Progress/Progress')} globalStore={globalStore} name='useCarProgress' />} />
                  <Route path='/userAuthority/user' render={() => <WrapperComponent Comp={import('./UserAuthority/UserSetting/userSetting')} globalStore={globalStore} name='userSetting' />} />
                  <Route path='/userAuthority/psw' render={() => <WrapperComponent Comp={import('./UserAuthority/pswSetting/pswSetting')} globalStore={globalStore} name='pswSetting' />} />
                  <Route path='/login' render={(history) => <WrapperComponent history={history} globalStore={globalStore} Comp={import('./Login/login')} name='login' />} />
                  <Route path='/' render={() => <WrapperComponent Comp={import('./Meetings/meeting')} globalStore={globalStore} />} />
                </Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    ) : (
        <Redirect to='/login' />
      )
  }
}

class WrapperComponent extends React.Component {
  state = {
    Comp: null
  }
  componentDidMount() {
    this.updateComp(this.props);
  }
  render() {
    let Comp = this.state.Comp;
    let { globalStore, match, history } = this.props;
    return Comp ? <Comp match={match} globalStore={globalStore} history={history} /> : Comp;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.Comp !== this.props.Comp) {
      this.updateComp(nextProps);
    }
  }
  updateComp = (props) => {
    props.Comp.then(C => {
      this.setState({
        Comp: C.default
      })
    });
  }
}

export default App