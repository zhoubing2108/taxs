import {observable} from 'mobx';
class Store {
  @observable dataSource = [];
  @observable params = {
    visible:false,
    data:[],
  }
  @observable department = '全部'
  @observable post = '';
  @observable username = '';
  @observable phone = '';
  @observable total = 0;
  @observable current = 1;
  @observable check_role = [];
  @observable role_id;
  @observable departmentList = [];
  @observable role= '';
}

export default new Store()