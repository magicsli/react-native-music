import React, {useRef, useEffect} from 'react';
import {Animated, Easing} from 'react-native';

const RotateInView = React.memo((props = {isPlay: true, duration: 7200}) => {
  let rotateAnim = useRef(new Animated.Value(0)).current;
  const startAnimation = () => {
    // console.log('载入动画');
    rotateAnim.setValue(0); // 透明度初始值设为0
    Animated.timing(
      // 随时间变化而执行动画
      rotateAnim, // 动画中的变量值
      {
        toValue: 360, //
        duration: props.duration || 7200, // 让动画持续一段时间
        easing: Easing.out(Easing.linear),
        useNativeDriver: true,
      },
    ).start(({finished}) => finished && startAnimation());
  };

  React.useEffect(() => {
    if (!props.isPlay) {
      rotateAnim.stopAnimation();
    } else {
      startAnimation(); // 开始执行动画
    }
  }, [props.isPlay]);
  return (
    <Animated.View // 使用专门的可动画化的View组件
      style={{
        ...props.style,
        transform: [
          {
            rotateZ: rotateAnim.interpolate({inputRange: [0, 360], outputRange: ['0deg', '360deg']}),
          },
        ],
      }}>
      {props.children}
    </Animated.View>
  );
});
export default RotateInView;
