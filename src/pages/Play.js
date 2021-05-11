import React, {useState, useEffect} from 'react';
import {Text, View, Image, ImageBackground, StyleSheet} from 'react-native';
import {getMusicUrl, getMusicUrlDetail} from '@/api';
import RotateInView from '@/components/RotateInView';
var Sound = require('react-native-sound');
import {observer, inject} from 'mobx-react';

let music; // 本页面唯一的播放器对象（不能交给hook控制，在退出useEffect时时无法调取当前hook值？？？）

function Play(props) {
  const playMusic = props.store?.getPlayMusic;
  const ID = props?.route?.params?.id || playMusic?.id;

  return (
    <ImageBackground blurRadius={36} style={styles.root} source={{uri: playMusic?.al?.picUrl}}>
      <View style={styles.main}>
        <View onTouchEnd={() => props.store.checkPlay()} style={{position: 'relative'}}>
          <Image source={require('@/assets/img/probe.png')} style={styles.probe}></Image>
          {/* 由于mobx迷之响应， 如果直接读取_playing 无法更新组件， 所以手动记录播放状态， 此为下策 */}
          <RotateInView isPlay={!!props.store.playMusicStatus.open} style={styles.recordBox}>
            <ImageBackground style={styles.record} source={require('@/assets/img/record.png')}>
              <Image source={{uri: playMusic?.al?.picUrl}} style={styles.cover}></Image>
            </ImageBackground>
          </RotateInView>
        </View>
      </View>
    </ImageBackground>
  );
}
export default inject('store')(observer(Play));
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
