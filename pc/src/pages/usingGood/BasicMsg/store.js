import { observable } from 'mobx';

class Store {
  @observable siderList = [];
  @observable unitList = [];
  @observable NavList = [];
  @observable fileList = [];
  @observable previewVisible = false;
  @observable previewImage = '';
  @observable addParams = {
    AddVisible: false,
  }
  @observable typeList =[];
  @observable alert = 1;
  @observable imgs=[];
  @observable defaultData = [];
}

export default new Store();