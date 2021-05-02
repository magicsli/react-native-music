import React, {useState, useEffect} from 'react';
import {Text, View, Image, ImageBackground, StyleSheet} from 'react-native';
import {getMusicUrl, getMusicUrlDetail} from '@/api';
import RotateInView from '@/components/RotateInView';
var Sound = require('react-native-sound');


let music; // 本页面唯一的播放器对象（不能交给hook控制，在退出useEffect时时无法调取当前hook值？？？）

export default function Play(props) {
  console.log(props);
  const ID = props?.route?.params?.id || 1484837259; 
  const [playNow, setPlayNow] = useState(null);
  const [detail, setDetail] = useState(null);
  const [play, setPlay] = useState(false);

  const getDetail = () => {
    getMusicUrlDetail({ids: ID}).then(res => {
      console.log(res.songs?.[0]);
      setDetail(res.songs?.[0]);
    });
  };

  const getUrl = () => {
    getMusicUrl({id: ID}).then(res => {
      playNow?.release();
       music = new Sound(res?.data[0].url, Sound.MAIN_BUNDLE, error => {
        if (error) {
          Alert.alert('播放失败。。。');
        }
        setPlay(true);

        music.play(success => {
          setPlay(false);
          if (success) {
            // 播放结束
            console.log('successfully finished playing');
          } else {
            // 播放错误， 意外终止
            console.log('playback failed due to audio decoding errors');
          }
        });
      });
 
      setPlayNow(music);
    });
  };

  useEffect(() => {
    getDetail();
    getUrl();

    return () => {
      console.log("释放音频资源")
      // 停止播放
      music?.stop(() => {
        music.release();
      });
      
    }
  }, []);
  return (
    <ImageBackground blurRadius={16} style={styles.root} source={{uri: detail?.al?.picUrl}}>
      <View style={styles.main}>
        <View style={{position: 'relative'}}>
          <Image source={require('@/assets/img/probe.png')} style={styles.probe}></Image>
          <RotateInView isPlay={play} style={styles.recordBox}>
            <ImageBackground style={styles.record} source={require('@/assets/img/record.png')}>
              <Image source={{uri: detail?.al?.picUrl}} style={styles.cover}></Image>
            </ImageBackground>
          </RotateInView>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    shadowOpacity: 3,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordBox: {
    width: 280,
    height: 280,
  },
  record: {
    position: 'relative',
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  probe: {
    position: 'absolute',
    top: -100,
    right: 55,
    width: 106,
    height: 170,
    zIndex: 1,
  },
  cover: {
    width: 180,
    height: 180,
    borderRadius: 90,
    zIndex: -1,
  },
});
