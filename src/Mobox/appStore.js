import {observable, action, computed, makeObservable} from 'mobx';
var Sound = require('react-native-sound');
class appStore {
  constructor() {
    makeObservable(this);
  }

  @observable playMusic = null; // 歌曲信息
  @observable playMusicRound = null; // 播放round实例

  /**
   * 更新当前播放音乐/播放器实例
   * @param {object} value 当前需要播放的歌曲详情信息
   */
  @action pushPlayMusic(value) {
    // console.log(value, 'pushMusic');
    return () => {
      this.playMusicRound?.release();
      this.playMusicRound = new Sound(value?.url, Sound.MAIN_BUNDLE, error => {
        if (error) {
          Alert.alert('播放失败。。。');
        }
        this.playMusic = {...this.playMusic, ...value};
        this.playMusicRound.play(success => {
          if (success) {
            // 播放结束
            console.log('successfully finished playing');
          } else {
            // 播放错误， 意外终止
            console.log('playback failed due to audio decoding errors');
          }
        });
      });
    };
  }

  /**
   * 补充歌曲信息（除播放源之外的信息{歌曲名， 歌曲介绍。。。}）
   * @param {object} value 当前需要播放的歌曲详情信息
   */
  @action replenishMusic(value) {
    // console.log(value)
    if (value) {
      this.playMusic = {...this.playMusic, ...value};
    }
  }

  @computed get getPlayMusic() {
    return this.playMusic;
  }
}
export default new appStore();
