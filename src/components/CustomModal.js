import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { OpenSansText } from '~/components/StyledText';

const widthScreen = Dimensions.get('window').width;

export default function CustomModal({
  visible,
  handleClose,
  titleModal,
  isScrollView,
  children
}) {
  return (
    <Modal
      style={{ margin: 0, flex: 1 }}
      isVisible={visible}
      onBackdropPress={handleClose}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      avoidKeyboard={true}
      coverScreen={true}
      hideModalContentWhileAnimating={true}
      useNativeDriver={true}
    >
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <OpenSansText
            style={{
              fontWeight: '600',
              fontSize: 18,
              marginVertical: 12,
              marginTop: Platform.OS === 'ios' ? 20 : 0
            }}
          >
            {titleModal}
          </OpenSansText>
          {isScrollView ? (
            <KeyboardAwareScrollView>
              <View style={{ flex: 1 }}>{children}</View>
            </KeyboardAwareScrollView>
          ) : (
            <View style={{ flex: 1 }}>{children}</View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    width: widthScreen - 100,
    paddingHorizontal: 8,
    backgroundColor: '#ccc',
    flex: 1,
    paddingTop: 12
  }
});
