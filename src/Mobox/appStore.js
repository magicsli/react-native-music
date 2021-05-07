import {observable, action} from 'mobx';
class appStore {
  @observable counter = 0;
  @action addCounter(value) {
    console.log(value);
    this.counter += value;
  }
}
export default new appStore();
