import React from 'react';

import {Icon} from 'react-native-elements';

import RotateInView from '@/components/RotateInView';

export default function Loading(props) {
  return (
    <>
      {(props.show ?? true) && (
        <RotateInView {...props} isPlay={true} duration={props.duration || 1200}>
          <Icon name="loading2" size={32} color="#666" type="antdesign" />
        </RotateInView>
      )}
    </>
  );
}
