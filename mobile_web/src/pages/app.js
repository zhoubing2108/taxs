import React, { Component } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { ActivityIndicator, Toast } from 'antd-mobile';
import './index.css';
import request from '../helpers/request';
import getQueryVarible from '../helpers/get-query-variable';

class App extends Component {
  state = {
    animating: true,
  }
  componentDidMount() {
    if (!sessionStorage.getItem('token')) {
      this.getUser();
    }
  }
  getUser = () => {
    let code = getQueryVarible('code');
    request({
      url: '/api/v1/token/user',
      data: {
        code
      },
      method: 'GET',
      success: (res) => {
        this.setState({
          animating: false
        })
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('u_id', res.u_id);
        sessionStorage.setItem('username', res.username);
        sessionStorage.setItem('account', res.account);
        sessionStorage.setItem('role', res.role);
        Toast.success('登陆成功', 1);
      }
    })
  };
  render() {
    return (
      <div>
        <div className="toast-example">
          <ActivityIndicator
            toast
            text="登陆中..."
            animating={this.state.animating}
          />
          <Switch>
            <Route path='/attendance' render={() => <WrapperComponent Comp={import('./Attendance/attendance')} name='attendance' />} />
            <Route path='/createMeeting' render={() => <WrapperComponent Comp={import('./NewMeetings/bottomtab')} name='createMeeting' />} />
            <Route path='/repair' render={() => <WrapperComponent Comp={import('./Repair/bottomtab')} name='repair' />} />
            <Route path='/borrowmaterial' render={() => <WrapperComponent Comp={import('./BorrowMaterial/bottomtab')} name='borrowmaterial' />} />
            <Route path='/getmaterial' render={() => <WrapperComponent Comp={import('./GetMaterial/bottomtab')} name='getmaterial' />} />
            <Route path='/usecars' render={() => <WrapperComponent Comp={import('./UseCars/bottomtab')} name='usecars' />} />
            <Route path='/meetingbooking' render={() => <WrapperComponent Comp={import('./MeetingBooking/bottomtab')} name='meetingbooking' />} />
            <Route path='/hotelbooking' render={() => <WrapperComponent Comp={import('./HotelBooking/bottomtab')} name='hotelbooking' />} />
            <Route path='/buffet' render={() => <WrapperComponent Comp={import('./Buffet/bottomtab')} name='buffet' />} />
            <Route path='/useplacemeeting' render={() => <WrapperComponent Comp={import('./UsePlaceMeeting/bottomtab')} name='useplacemeeting' />} />
            <Route path='/useplace' render={() => <WrapperComponent Comp={import('./UsePlace/bottomtab')} name='useplace' />} />
            <Route path='/reception' render={() => <WrapperComponent Comp={import('./MeetingReception/bottomtab')} name='reception' />} />
            <Route path='/entrance' render={() => <WrapperComponent Comp={import('./Entrance/Entrance')} name='entrance' />} />
            <Route path='/' render={() => <WrapperComponent Comp={import('./defaultPage/index')} name='default' />} />
          </Switch>
        </div>
      </div>
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