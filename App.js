/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import Toast from 'react-native-easy-toast';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'mobx-react';
import User from '@/pages/User';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Play from '@/pages/Play';
import SongList from '@/pages/SongList';
import appStore from '@/Mobox/appStore';

const Stack = createStackNavigator();

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [toast, setToast] = useState(null);
  const [store, setStore] = useState(appStore);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    toast && appStore.setToast(toast);
  }, [toast]);

  return (
    <Provider store={appStore}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Toast ref={e => setToast(e)} />
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="User" component={User} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Play" component={Play} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="SongList" component={SongList} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
