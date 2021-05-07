import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import {Icon} from 'react-native-elements';
import {getPlayList} from '@/api';
import {observer, inject} from 'mobx-react';
import RotateInView from '@/components/RotateInView';

function PlayControlBottom(props) {
  //   const {playMusic} = props?.store;
  return (
    <View style={style.root}>
      <RotateInView isPlay={play} style={styles.recordBox}>
        <ImageBackground style={styles.record} source={require('@/assets/img/record.png')}>
          {/* <Image source={{uri: playMusic?.al?.picUrl}} style={styles.cover}></Image> */}
        </ImageBackground>
      </RotateInView>
    </View>
  );
}

export default inject('store')(observer(PlayControlBottom));

const style = StyleSheet.create({});
