import {observable} from 'mobx'

class Store {
  @observable loginSuccess = false;
}
export default new Store()