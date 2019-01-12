import { observable } from 'mobx';

class Store {
  @observable params = {
    visible: false,
    loading: false
  }
  @observable data = {};
  @observable info = {
    preprocess: {},
    log: [],
    proDataSource: [],
    meals: []
  };
  @observable dataSource = [];
}

export default new Store()