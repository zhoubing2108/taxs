import { observable } from 'mobx';

class Store {
  @observable addParams = {
    AddVisible: false,
  }
  @observable ModifyParams = {
    ModifyVisible: false,
  }
  @observable editItem={}
  @observable dataSource = [];
  @observable category = '';
  @observable order_number = '';
  @observable category_id = '';
  @observable page = 1;
  @observable total = 0;
  @observable current = 1;
}

export default new Store()