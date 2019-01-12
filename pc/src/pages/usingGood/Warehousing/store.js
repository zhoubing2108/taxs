import {observable} from 'mobx';

class Store {
  @observable NavList = [];
  @observable dataSource=[];
  @observable category= '';
  @observable order_number = '';
  @observable category_id = '';
  @observable total = 10;
  @observable current = 1;
  @observable addParams = {
    AddVisible: false,
  }
  @observable skuList = [];
  @observable m_pack = '';
  @observable m_pack_count = '';
  @observable m_unit = '';
}

export default new Store();