import { observable } from 'mobx';
import moment from 'moment';


class Store {
  @observable username = '';
  @observable department = '全部';
  @observable category = '';
  @observable sku = '';
  @observable status = 3;
  @observable time_begin = moment().startOf('month');
  @observable time_end = moment();
  @observable dataSource = [];
  @observable addParams = {
    AddVisible: false,
  }
  @observable details = {
    visible: false,
  }
  @observable detailsArr = [];
  @observable total = 10;
  @observable current = 1;
  @observable skuList = [];
  @observable useList = [];
}

export default new Store()