import {observable} from 'mobx'

class Store {
  @observable loginSuccess = false;
  @observable departmentList = [];
  @observable placeList =[];
}
export default new Store()