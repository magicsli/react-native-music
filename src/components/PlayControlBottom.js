import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, ImageBackground, TouchableWithoutFeedback} from 'react-native';
import {Icon, BottomSheet, ListItem} from 'react-native-elements';
import {getPlayList} from '@/api';
import {observer, inject} from 'mobx-react';
import RotateInView from '@/components/RotateInView';

function PlayControlBottom(props) {
    const {playMusic} = props?.store;
    console.log(props);
  const [isVisible, setIsVisible] = useState(false);
  const list = [
    {title: 'ListItem1'},
    {title: 'ListItem2'},
    {
      title: 'Cancel',
      containerStyle: {backgroundColor: 'red'},
      titleStyle: {color: 'white'},
      onPress: () => setIsVisible(false),
    },
  ];
  const handeTest = e => {
    console.log(e, "item event");
    e.stopPropagation()
    e.preventDefault()
  }
  return (
    <View style={styles.root}  onTouchEnd={() => props.navigation.navigate('Play')}>
      <RotateInView isPlay={true} style={styles.recordBox}>
        <ImageBackground style={styles.record} source={require('@/assets/img/record.png')}>
          <Image source={{uri: playMusic?.al?.picUrl}} style={styles.cover}></Image>
        </ImageBackground>
      </RotateInView>
      <Text numberOfLines={1} style={styles.name}>
        {playMusic?.al?.name || playMusic?.name} - {playMusic?.ar?.map(item => (<Text key={item.id} style={styles.author}>{item.name}</Text>))}
      </Text>
      <View style={styles.control}>
        <Icon style={{marginRight: 18}} name="playcircleo" type="antdesign" size={22} color="#666" />
        <Icon name="menuunfold" type="antdesign" size={22} color="#666" onPress={() => setIsVisible(true)} />
      </View>
      <BottomSheet modalProps={{animationType: "fade"}} onTouchEnd={(e) => console.log('Xxx', e.taget)} isVisible={isVisible} containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
        {list.map((l, i) => (
          <ListItem  key={i} containerStyle={{zIndex: 1}} onTouchEnd={e => e.preventDefault()} onPress={handeTest}>
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>
                <Text>{l.title}</Text>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
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
});
