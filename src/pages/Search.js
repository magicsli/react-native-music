import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import {Icon, SearchBar} from 'react-native-elements';
import {getSearch, getDetail} from '@/api';
import {debounce, getRandomLove} from '@/utils';

const loveName = getRandomLove();
const handleSearch = debounce(search => {
  return getSearch({keywords: search});
});

export default function User(props) {
  const [search, setSearch] = useState('tk');

  const [searchList, setSearchList] = useState([]);
  useEffect(() => {
    if (!search) {
      // 如果没有搜索值， 不执行请求操作
      setSearchList([]);
      return;
    }
    handleSearch(search).then(res => {
      console.log(res);
      setSearchList(res.result?.songs || []);
    });
  }, [search]);

  const getMusicDetail = (id) => {
    props.navigation.navigate("Play", {id: id})
  }

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
      <ScrollView style={{flex: 1}}>
        {searchList.map((item, index) => (
          <View onTouchEnd={() => getMusicDetail(item.id)} key={item.id} style={style.searchItem}>
            <View style={style.searchItemInfo}>
              <Image style={style.infoImg} source={{uri: item?.al?.picUrl}}></Image>
              <Text numberOfLines={2} style={{fontSize: 14, width: 260}}>
                {item.name}
              </Text>
            </View>
            <View>
              <Text numberOfLines={1} style={style.author}>
                {item?.ar?.map(item => item.name)?.join('  ')}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

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
    maxWidth: 120,
    color: '#666',
    marginRight: 5,
    fontSize: 12,
  },
});
