import React, {useState, useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View, Image, FlatList} from 'react-native';
import {Icon} from 'react-native-elements';
import {getPlayList} from '@/api';
import {observer, inject} from 'mobx-react';
import PlayControlBottom from '@/components/PlayControlBottom';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

function Home(props) {
  const [playlist, setPlaylist] = useState([]);

  const [refreshing, setRefreshing] = useState(true);
  const [lasttime, setLasttime] = useState('');

  /**
   *
   * @param {Boolean}} refresh 是否重置列表
   * @returns
   */
  const handleGetPayList = (refresh = false) => {
    // 如果为刷新状态， 显示loading
    if (refresh) setRefreshing(true);
    return getPlayList({limit: 20, before: refresh ? '' : lasttime})
      .then(res => {
        // props.store.addCounter(1);
        setRefreshing(false);
        setLasttime(res.lasttime);
        if (refresh) {
          setPlaylist(res.playlists);
        } else {
          setPlaylist(playlist.concat(res.playlists));
        }
      })
      .catch(err => {
        console.error(err);
        props.store.toast('接口错误');
      });
  };

  const handleSearch = () => {
    props.navigation.navigate('Search');
  };

  const handleSongList = id => {
    props.navigation.navigate('SongList', {id});
  };

  useEffect(() => {
    handleGetPayList();
  }, []);

  return (
    <View style={style.root}>
      <View onTouchEnd={handleSearch} style={style.searchBar}>
        <Icon name="search1" type="antdesign" />
        <Text style={style.searchText}>请输入搜索内容</Text>
      </View>
      <FlatList
        style={{flex: 1, paddingHorizontal: 5}}
        data={playlist}
        numColumns={3}
        refreshing={refreshing}
        onRefresh={() => handleGetPayList(true)}
        onEndReached={() => handleGetPayList()}
        renderItem={({item}) => (
          <View style={style.playItem} onTouchEnd={() => handleSongList(item.id)}>
            <Image style={style.playImage} source={{uri: item.coverImgUrl}}></Image>
            <Text numberOfLines={2}>{item.copywriter}</Text>
          </View>
        )}
        keyExtractor={item => item.id + item.name}
      />
      <PlayControlBottom {...props} />
    </View>
  );
}

export default inject('store')(observer(Home));

const style = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 15,
    justifyContent: 'space-between',
  },
  searchBar: {
    // height:32,
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  searchText: {
    marginLeft: 10,
    color: '#666',
  },
  playItem: {
    flex: 1,
    width: (screenWidth - 40) / 3, // 解决最后一行 flex:1 时候样式占据了全行
    paddingHorizontal: 5,
    // backgroundColor: 'red',
    marginBottom: 15,
    // marginHorizontal: 5,
    borderRadius: 6,
    overflow: 'hidden',
  },
  playImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
});
