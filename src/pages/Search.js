import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import {Icon, SearchBar} from 'react-native-elements';
import {getSearch, getSearchRecommend} from '@/api';
import {debounce, getRandomLove} from '@/utils';
import {observer, inject} from 'mobx-react';
import PlayControlBottom from '@/components/PlayControlBottom';
import RotateInView from '@/components/RotateInView';
import Loading from '@/components/Loading';

// 使用 AbortController 进行请求拦截

const loveName = getRandomLove();
const handleSearch = debounce(keywords => getSearch({keywords}));

function User(props) {
  const [search, setSearch] = useState('');

  const [searchList, setSearchList] = useState([]);

  const [loading, setLoading] = useState(false);

  const [recommend, setRecommend] = useState([]);

  const [scroll, setScroll] = useState(null);

  useEffect(() => {
    getSearchRecommend().then(res => {
      setRecommend(res?.result?.hots);
    });
  }, []);

  useEffect(() => {
    if (!search) {
      setLoading(false);
      setSearchList([]);
      return;
    }

    setLoading(true);

    // 存在一个当用户操作过快时， 前边的请求会覆盖后边的数据的Bug -2021/05/12
    handleSearch(search)
      .then(res => {
        scroll?.scrollTo({y: 0});
        setSearchList(res.result?.songs || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search]);

  const getMusicDetail = id => {
    props.store.resetSongList(searchList);
    props.store?.palyMusicById(id);

    props.navigation.navigate('Play');
  };

  return (
    <View style={style.root}>
      <SearchBar
        containerStyle={style.searchBox}
        inputContainerStyle={style.searchBar}
        lightTheme
        placeholder={loveName}
        onChangeText={setSearch}
        value={search}
      />

      <ScrollView ref={e => setScroll(e)} style={{flex: 1, position: 'relative'}}>
        <View>
          <Text style={style.tagTitle}>热搜</Text>
          <View style={style.tagList}>
            {recommend?.map(item => (
              <Text onPress={() => setSearch(item.first)} key={item.first} style={style.tagItem}>
                {item.first}
              </Text>
            ))}
          </View>
        </View>
        <Loading style={style.loading} show={loading} />
        {searchList.map((item, index) => (
          <View key={item.id} style={style.searchItem}>
            <View onTouchEnd={() => getMusicDetail(item.id)} style={style.searchItemInfo}>
              <Image style={style.infoImg} source={{uri: item?.al?.picUrl}}></Image>
              <View style={{flex: 1}}>
                <Text numberOfLines={1} style={{fontSize: 14}}>
                  {item.name}
                </Text>
                <Text numberOfLines={1} style={style.author}>
                  {item?.ar?.map(item => item.name)?.join('  ')}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon onPress={() => props.store.pushSong(item)} name="rightcircleo" size={20} color="#666" type="antdesign" />
            </View>
          </View>
        ))}
      </ScrollView>

      <PlayControlBottom {...props} />
    </View>
  );
}
export default inject('store')(observer(User));
const style = StyleSheet.create({
  root: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  searchBox: {
    // padding: 0,
    backgroundColor: 'transparent', // 必须如此设置， 别问，问就是不会改
    borderTopColor: 'transparent', // 必须如此设置， 别问，问就是不会改
    borderBottomColor: 'transparent', // 必须如此设置， 别问，问就是不会改
  },
  searchBar: {
    height: 38,
    lineHeight: 38,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  searchText: {
    padding: 0,
    lineHeight: 1.5,
    fontSize: 12,
    marginLeft: 10,
    color: 'red',
  },
  tagTitle: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
    marginBottom: 10,
  },
  tagItem: {
    fontSize: 12,
    color: '#888',
    backgroundColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  loading: {
    marginTop: 20,
  },
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  searchItemInfo: {
    flex: 1,
    marginRight: 35,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  author: {
    maxWidth: 140,
    color: '#666',
    marginTop: 5,
    fontSize: 12,
  },
});
