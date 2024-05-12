import { useRef, useState } from "react";
import {
  View,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Easing,
  Animated,
} from "react-native";
import { Colors } from "~/constants";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function MenuPopup({ navigation }) {
  const MENU_ITEMS = [
    {
      icon: 'wb-twighlight',
      title: 'Light mode'
    },
    {
      icon: 'help-outline',
      title: 'Help',
      press: () => {
        navigation.navigate('Help');
      }
    },
    {
      icon: 'feedback',
      title: 'Feedbacks',
      press: () => {
        navigation.navigate('Feedback');
      }
    }
  ];
  const [visible, setVisible] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  const resizeBox = (to) => {
    to === 1 && setVisible(true);
    Animated.timing(scale, {
      toValue: to,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.linear
    }).start(() => to === 0 && setVisible(false));
  };
  return (
    <View style={{ marginRight: -10, marginLeft: 5 }}>
      <TouchableOpacity onPress={() => resizeBox(1)}>
        <FontAwesome5 name="user-circle" size={24} color="#000" />
      </TouchableOpacity>
      <Modal transparent visible={visible}>
        <SafeAreaView style={{ flex: 1 }} onTouchStart={() => resizeBox(0)}>
          <Animated.View
            style={[
              styles.popup,
              {
                opacity: scale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              },
              {
                transform: [{ scale }]
              }
            ]}
          >
            <Entypo
              style={styles.arrow}
              name="triangle-up"
              size={24}
              color="#fff"
            />
            {MENU_ITEMS.map((op, i) => (
              <TouchableOpacity
                key={i}
                onPress={op.press}
                style={[
                  styles.option,
                  { borderBottomWidth: i === MENU_ITEMS.length - 1 ? 0 : 1 }
                ]}
              >
                <MaterialIcons name={op.icon} size={20} />
                <Text style={{ marginLeft: 15, fontSize: 18 }}>{op.title}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

export default MenuPopup;

const styles = StyleSheet.create({
  popup: {
    borderRadius: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    position: "absolute",
    right: 10,
    top: 45,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  option: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#ccc",
  },
  arrow: {
    position: "absolute",
    top: -14,
    right: -4,
  },
});
