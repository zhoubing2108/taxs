import { observable } from 'mobx'
class Store {
  @observable params = {
    loginSuccess: false,
    userRetErr: false,
    passwordRetErr: false,
    verifyRetErr:false,
  };
  @observable loading = false;
  @ observable baseImg = '';
}

export default new Store();