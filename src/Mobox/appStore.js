import {observable, action, computed, makeObservable} from 'mobx';
import {getMusicUrl, getMusicUrlDetail} from '@/api';
var Sound = require('react-native-sound');
class appStore {
  constructor() {
    makeObservable(this);
  }

  @observable playMusic = null; // 歌曲信息
  @observable playMusicRound = null; // 播放round实例

  @observable playMusicStatus = {
    // 播放状态
    loading: false, // 是否处于加载中
    open: false, // 是否处于播放中
  };

  @observable songList = []; // 歌曲信息
  @observable playIndex = 0; // 播放round实例

  /**
   * 更新当前播放音乐/播放器实例
   * @param {object} value 当前需要播放的歌曲详情信息
   */
  @action pushPlayMusic(value) {
    console.log(value, 'pushMusic');

    this.playMusicRound?.release();
    this.playMusicRound = new Sound(
      value?.url,
      Sound.MAIN_BUNDLE,
      action('initPlay', error => {
        if (error) {
          Alert.alert('播放失败。。。');
        }

        this.playMusicRound.play(success => {
          if (success) {
            // 播放结束
            console.log('successfully finished playing');

            // 开始下一曲
            this.nextPlay();
          } else {
            // 播放错误， 意外终止
            console.log('playback failed due to audio decoding errors');
          }
        });
      }),
    );
  }

  /**
   * 切换播放状态
   */
  @action checkPlay() {
    if (this._playing) {
      this.stopPlay();
    } else {
      this.openPlay();
    }
  }

  /**
   * 暂停播放
   */
  @action stopPlay() {
    this.playMusicRound?.pause();
    // this.changeStatus({open: false});
  }

  /**
   * 继续播放
   */
  @action openPlay() {
    this.playMusicRound?.play();
    // this.changeStatus({open: true});
  }

  /**
   * 更新播放状态信息
   */
  @action changeStatus(status = {}) {
    this.playMusicStatus = {...this.playMusicStatus, ...status};
  }

  // 通过Id获取歌曲信息并播放
  @action pushMusicById(id = '') {
    if (!id) return;
    this.changeStatus({loading: true});

    const detailSync = getMusicUrlDetail({ids: id});

    const palyInfoSync = getMusicUrl({id});

    return Promise.all([detailSync, palyInfoSync])
      .then(
        action('fetchSuccess', res => {
          let detail = res[0]?.songs?.[0] || {};
          let playInfo = res[1]?.data[0] || {};
          // 执行播放
          this.pushPlayMusic(playInfo);

          // 更新歌曲信息
          this.playMusic = Object.assign(detail, playInfo);
        }),
      )
      .finally(
        action('fetchFinally', res => {
          this.changeStatus({loading: false});
        }),
      );
  }

  /**
   * 重置播放的歌单列表 (并选中播放第一首)
   * @param {Array} list 歌曲ID
   */
  @action resetSongList(list = []) {
    if (JSON.stringify(this.songList) === JSON.stringify(list)) return;
    this.songList = list;
    this.playIndex = 0;

    // 重置当前播放歌曲
    // this.pushMusicById(list[this.playIndex]?.id);
  }

  /**
   * 切换播放列表中的播放顺序
   * @param {Array} list 歌曲ID
   */
  @action palyMusicById(id) {
    const index = this.songList.findIndex(item => item.id === id);
    if (index === -1) {
      // 一般不会进入此判断， 如果歌曲不在歌单之内， 则将歌曲添加至当前索引位置
      this.songList.splice(this.playIndex, 1, id, this.songList[this.playIndex]?.id);
    } else {
      this.playIndex = index;
    }

    // 重置当前播放歌曲
    this.pushMusicById(this.songList[this.playIndex]?.id);
  }

  /**
   * 下一曲
   */
  @action nextPlay() {
    console.log('this.songList', this);
    // 如果是最后一曲， 则跳转回第一曲
    if (this.playIndex >= this.songList?.length) {
      this.playIndex = 0;
    } else {
      this.playIndex += 1;
    }

    // 重置当前播放歌曲
    this.pushMusicById(this.songList[this.playIndex]?.id);
  }

  /**
   * 上一曲
   */
  @action prevPlay() {
    // 如果是最后一曲， 则跳转回第一曲
    if (this.playIndex <= 0) {
      this.playIndex = 0;
    } else {
      this.playIndex -= 1;
    }

    // 重置当前播放歌曲
    this.pushMusicById(this.songList[this.playIndex]?.id);
  }

  /**
   * 删除播放队列中的某一项
   */
  @action deteleSongItemById(id = '') {
    const index = this.songList.findIndex(item => item.id === id);
    if (index === -1) {
      // 一般不会进入此判断， 如果歌曲不在歌单之内，则删除失败
      Alert('此歌曲不在播放列表中');
    } else {
      // 如果删除的是当前正在播放的歌曲， 则自动进行下一首
      // this.nextPlay()
      this.songList.splice(index, 1);
      // this.songList = [...this.songList];
      this.pushMusicById(this.songList[this.playIndex]);
    }
  }

  @computed get getPlayMusic() {
    return this.playMusic;
  }

  // 播放状态
  @computed get _playing() {
    return this.playMusicRound?.isPlaying();
  }

  // 歌曲加载状态
  @computed get _loaded() {
    return this.playMusicRound?.isLoaded();
  }
}
export default new appStore();
