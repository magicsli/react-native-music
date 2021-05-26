import React, {useState, useEffect} from 'react';
import {secondToMinute, minuteToSecond} from '@/utils';
import {Text, View, Image, ImageBackground, StyleSheet} from 'react-native';
import {getMusicUrl, getMusicUrlDetail} from '@/api';
import RotateInView from '@/components/RotateInView';
import {Slider, Icon} from 'react-native-elements';
var Sound = require('react-native-sound');
import {observer, inject} from 'mobx-react';

function Play(props) {
  const {playMusic, playMusicStatus, playMusicRound, setPlayTime} = props.store;
  const ID = props?.route?.params?.id || playMusic?.id;

  const MusicLength = secondToMinute(playMusicStatus?.duration);
  const value = secondToMinute(playMusicStatus?.time);
  // const MusicLength = 4;

  useEffect(() => {
    console.log(playMusicStatus);
    console.log(secondToMinute(playMusicStatus.duration), 1000);
    console.log(playMusicRound);
  }, []);

  const handleSetTime = value => {
    // console.log(playMusicRound)
    // console.log(minuteToSecond(value))
    props.store.setPlayTime(minuteToSecond(value));
    // playMusicRound?.setCurrentTime(minuteToSecond(value))
  };
  const _playing = playMusicStatus.open;
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
        <View style={styles.controler}>
          <View style={styles.sliderLine}>
            <Text style={styles.sliderLabel}>{value.toFixed(2)}</Text>
            <Slider
              allowTouchTrack={true}
              thumbStyle={{width: 10, height: 10}}
              style={styles.slider}
              value={value}
              onValueChange={handleSetTime}
              maximumValue={MusicLength}
              minimumValue={0}
              step={0.01}
            />
            <Text style={styles.sliderLabel}>{MusicLength.toFixed(2)}</Text>
          </View>
          <View style={styles.operationLine}>
            <View>
              <Icon onPress={() => props.store.prevPlay()} name="stepbackward" size={28} type="antdesign" color="#fcfcfc" />
            </View>
            <View style={styles.openBtn}>
              <Icon onPress={() => props.store.checkPlay()} name={ _playing ?  "pausecircleo" : "playcircleo"}  size={40} type="antdesign" color="#fcfcfc" />
            </View>
            <View>
              <Icon onPress={() => props.store.nextPlay()} name="stepforward" size={28} type="antdesign" color="#fcfcfc" />
            </View>
          </View>
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
    backgroundColor: "#fcfcfc"
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 150,
    paddingBottom: 35,
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
  controler: {
    // justifySelf: 'flex-end',
    // alignSelf: 'flex-end',
  },
  sliderLine: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#c6c6c6',
  },
  operationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    color: '#fff',
  },
  openBtn: {
    marginHorizontal: 40,
  },
});
