import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, FlatList, ImageBackground, Modal, SafeAreaView} from 'react-native';
import {Icon, ListItem, Avatar} from 'react-native-elements';
import {getPlayList} from '@/api';
import {observer, inject} from 'mobx-react';
import RotateInView from '@/components/RotateInView';

function PlayControlBottom(props) {
  const {playMusic} = props?.store;

  const [isVisible, setIsVisible] = useState(false);

  const handleShowList = e => {
    e.preventDefault();
    setIsVisible(true);
  };

  const getMusicDetail = id => {
    props.store.palyMusicById(id);
  };

  // 删除歌单中的某一项
  const handleDelteItem = id => {
    props.store.deteleSongItemById(id);
  };

  // 切换当前播放
  const handeCheckPlay = id => {
    props.store.palyMusicById(id);
  };

  return (
    <View style={styles.root}>
      <RotateInView onTouchEnd={() => props.navigation.navigate('Play')} isPlay={props.store._playing} style={styles.recordBox}>
        <ImageBackground style={styles.record} source={require('@/assets/img/record.png')}>
          <Image source={{uri: playMusic?.al?.picUrl}} style={styles.cover}></Image>
        </ImageBackground>
      </RotateInView>
      <Text onTouchEnd={() => props.navigation.navigate('Play')} numberOfLines={1} style={styles.name}>
        {playMusic?.al?.name || playMusic?.name} -{' '}
        {playMusic?.ar?.map(item => (
          <Text key={item.id} style={styles.author}>
            {item.name}
          </Text>
        ))}
      </Text>
      <View style={styles.control}>
        <View>
          <Icon name={props.store._playing ? 'playcircle' : 'pausecircleo'} type="antdesign" onPress={() => props.store.checkPlay()} size={22} color="#666" />
        </View>
        <View style={{marginLeft: 18}}>
          <Icon name="menuunfold" type="antdesign" size={22} color="#666" onPress={handleShowList} />
        </View>
      </View>

      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <SafeAreaView style={styles.safeAreaView}>
          {/* 不知道为什么， 不加背景色属性就无法触发touchEnd事件， 猜测是由于层级问题。。。 */}
          <View style={{flex: 1, backgroundColor: 'transparent'}} onTouchEnd={() => setIsVisible(false)}></View>

          <View style={styles.containList}>
            <Text style={styles.listTitle}>
              当前播放
              <Text style={styles.listSubTitle}>（{props.store.songList.length}）</Text>
            </Text>
            <FlatList
              data={props.store.songList.slice(0, 16)}
              renderItem={({item, index}) => (
                <ListItem containerStyle={{paddingVertical: 8}} key={item.id} onPress={() => handeCheckPlay(item.id)}>
                  <Avatar rounded source={{uri: item?.al?.picUrl}} />
                  <ListItem.Content>
                    <ListItem.Title>
                      <Text style={{fontSize: 14, maxWidth: 260}} numberOfLines={1}>
                        {item?.al.name}
                      </Text>{' '}
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      <Text numberOfLines={1} style={{maxWidth: 200}}>
                        {item?.ar?.map(item => item.name)?.join(' ')}
                      </Text>{' '}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron onPress={() => handleDelteItem(item.id)} name="close" type="antdesign" />
                </ListItem>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

export default inject('store')(observer(PlayControlBottom));

const styles = StyleSheet.create({
  root: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 15,

    // backgroundColor: 'pink',
  },
  recordBox: {
    width: 60,
    height: 60,
  },
  record: {
    position: 'relative',
    width: 60,
    height: 60,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    width: 38,
    height: 38,
    borderRadius: 20,
    position: 'relative',
    zIndex: 0,
  },
  name: {
    color: '#333',
    fontSize: 14,
    marginLeft: 5,
    flex: 1,
    marginRight: 30,
  },
  author: {
    marginLeft: 5,
    color: '#666',
    fontSize: 12,
  },

  control: {
    // paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  containList: {
    maxHeight: 400,
    backgroundColor: '#ffffff',
    // flexDirection: 'column',
    // justifyContent: 'flex-end',
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  listSubTitle: {
    fontSize: 12,
    marginLeft: 5,
    color: '#ccc',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'column',
  },
});
