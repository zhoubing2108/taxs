import { observable } from 'mobx';
import moment from 'moment';


class Store {
  @observable username = '全部';
  @observable department = '全部';
  @observable category = '全部';
  @observable sku = '全部';
  @observable status = 3;
  @observable reason = '全部';
  @observable time_begin = moment().startOf('month');
  @observable time_end = moment();
  @observable dataSource = [];
  @observable addParams = {
    AddVisible: false,
  }
  @observable total = 10;
  @observable current = 1;
  @observable skuList = [];
}

export default new Store()