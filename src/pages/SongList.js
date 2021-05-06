import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Image, ImageBackground, Dimensions, FlatList} from 'react-native';
import {getPlaylistDetail, getMusicUrlDetail} from '@/api';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function SongList(props) {
  id = props?.route?.params?.id || 2140965208;
  const [detail, setDetail] = useState(null);
  const [playList, setPlayList] = useState([]);
  useEffect(() => {
    getPlaylistDetail({id}).then(res => {
      setDetail(res.playlist);
      if (res?.trackIds?.[0]?.name) {
        setPlayList(res.playlist.trackIds);
      } else {
        getMusicUrlDetail({ids: res?.playlist?.trackIds?.map(item => item.id)?.join()}).then(res => {
          console.log(res);
          setPlayList(res.songs);
        });
      }
    });
  }, []);

  const getMusicDetail = id => {
    props.navigation.navigate('Play', {id});
  };

  return (
    <View style={style.root}>
      <View style={style.detail}>
        <ImageBackground blurRadius={18} source={{uri: detail?.coverImgUrl}} style={style.detailBackGround}></ImageBackground>
        <View style={style.detailInfo}>
          <Image style={style.cover} source={{uri: detail?.coverImgUrl}} />
          <View style={style.info}>
            <View>
              <Text numberOfLines={2} style={style.title}>
                {detail?.name}
              </Text>
              <View style={style.userInfo}>
                <Image style={style.avatar} source={{uri: detail?.creator?.avatarUrl}} />
                <Text style={{color: '#eee'}}>{detail?.creator?.nickname}</Text>
              </View>
            </View>
            <View>
              <Text numberOfLines={2} style={style.desc}>
                介绍：{detail?.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <FlatList
        data={playList}
        style={style.list}
        renderItem={({item, index}) => (
          <View style={style.songItem} onTouchEnd={() => getMusicDetail(item.id)}>
            <Text style={style.songIndex}>{index}</Text>
            <View style={{flex: 1}}>
              <Text numberOfLines={1} style={style.songItemTitle}>
                {item?.name}
              </Text>
              <Text numberOfLines={1} style={style.songAuthor}>
                {item?.al?.name}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const style = StyleSheet.create({
  root: {
    flex: 1,
  },
  detail: {
    position: 'relative',
    height: 220,
    overflow: 'hidden',
  },
  detailInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    // height: ',
    width: '100%',
    padding: 20,
    flexDirection: 'row',
  },
  cover: {
    height: 150,
    width: 120,
    borderRadius: 12,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: '#Fff',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#ccc',
    fontSize: 14,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 6,
  },
  desc: {
    color: '#ccc',
    fontSize: 14,
  },
  detailBackGround: {
    height: screenWidth * 5,
    width: screenWidth * 5,
    transform: [{translateX: screenWidth * 4 * -0.5}, {translateY: screenWidth * -4 - 200}],
    overflow: 'hidden',
    borderRadius: 999,
    // borderBottomStartRadius:400,
    // borderBottomEndRadius:400,
  },
  list: {
    flex: 1,
    height: 300,
    // backgroundColor: 'red',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    paddingRight: 15,
    // height: 50,
  },
  songIndex: {
    fontSize: 18,
    margin: 15,
    color: '#999',
  },
  songItemTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  songAuthor: {
    fontSize: 12,
    color: '#666',
  },
});
