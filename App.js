/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
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

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={appStore}>
      <SafeAreaProvider>
        <NavigationContainer>
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
