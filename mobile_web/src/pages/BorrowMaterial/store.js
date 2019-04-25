import { observable } from 'mobx';
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
import moment from 'moment';

class Store {
    @observable tabSelect = {
        selectedTab: 'blueTab'
    };
    @observable myskuList = [{ label: '暂无', value: '洗手液' }, { label: '暂无', value: '洗手液' }]
    @observable mytestskuList = [];
    @observable sku_id = '';
    @observable count = '';
    @observable time_begin = now;
    @observable time_end = now;
    @observable materialType = [];
    @observable materialMessages = [
        {
            valuefir: '空',
            describefir: '物品名称',

            valuesec: '空',
            describesec: '类别描述',

            valuethi: '空',
            describethi: '规格型号',

            valuefou: '空',
            describefou: '库存',
        }
    ];
    @observable myskuTable = [];
    @observable RadioValue = 0;
    @observable deadline = new Date(Date.now());
    @observable userList = [];
    @observable total = 5;
    @observable needTotal = 5;
    @observable dataSource = []
    @observable needList = [];
    @observable current = 1;
    @observable needCurrent = 1;
    @observable check_con = '';
    @observable info = {};

}
export default new Store();