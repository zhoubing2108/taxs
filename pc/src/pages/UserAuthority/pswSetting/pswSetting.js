import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'antd';
import request from '../../../helpers/request';

class PswSetting extends Component {
  componentDidMount() {
    // alert(window.location)
    // alert(this.getQueryVariable('code'))
    // this.test()
    // this.test(code);
    // this.fetchList();
  }
  // test = ()=>{
  //   let code = this.getQueryVariable('code');
  //   request({
  //     url:'/api/v1/token/user',
  //     method:'GET',
  //     data:{
  //       code
  //     },
  //     success:(res)=>{
  //       alert(res.u_id);
  //       alert(res.username);
  //       alert(res.account);
  //       alert(res.role);
  //       alert(res.token);
  //     },
  //   })
  // }
  getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
  }
  render() {
    return (
      <Fragment>
        <Card>
          <div>PswSetting</div>
        </Card>
      </Fragment>
    )
  }
}

export default withRouter(PswSetting);