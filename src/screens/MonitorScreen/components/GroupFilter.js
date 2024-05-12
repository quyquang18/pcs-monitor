import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import APIService from '~/utils/APIService';
import GroupForm from './GroupForm';
import { OpenSansText } from '~/components/StyledText';
import AssignToGroup from './AssignToGroup';

const widthScreen = Dimensions.get('window').width;

function GroupFilter({
  visible,
  devices,
  data,
  onFilter,
  onFetch,
  handleClose
}) {
  const [editGroup, setEditGroup] = useState(null);
  const [groups, setGroups] = useState(data?.groups || []);
  const [devs, setDevices] = useState(devices.map((e) => e.device) || []);
  const [assignGroup, setAssignGroup] = useState(null);
  const fetchGroups = () => {
    APIService.getGroups((success, json) => {
      if (success && json.result) {
        const { result } = json;
        setGroups(result.groups);
        setDevices(result.devices);
      }
    });
  };

  const _onFetch = () => {
    setEditGroup(null);
    fetchGroups();
    onFetch();
  };

  const _handleClose = () => {
    setEditGroup(null);
    handleClose();
  };

  const onEditGroup = (evt, group) => {
    setEditGroup(group);
    evt.stopPropagation();
  };

  const deleteGroup = (evt, group) => {
    evt.stopPropagation();
    APIService.deleteGroup(group.id, () => {
      fetchGroups();
    });
  };

  useEffect(() => {
    fetchGroups();
  }, []);
  const optionModal = {
    animationIn: "slideInRight",
    animationOut: "slideOutRight",

    backdropTransitionInTiming: 0,
    backdropTransitionOutTiming: 0,
    avoidKeyboard: true,
    coverScreen: true,
    hideModalContentWhileAnimating: true,
    useNativeDriver: true,
  };
  return (
    <View>
      <Modal
        style={{ margin: 0, flex: 1 }}
        isVisible={visible}
        {...optionModal}
        onBackdropPress={_handleClose}
      >
        {assignGroup ? (
          <AssignToGroup
            devices={devices.filter((e) => {
              return devs.find((d) => {
                return d.id === e.device.id;
              });
            })}
            assignGroup={assignGroup}
            onFetch={_onFetch}
            onClose={handleClose}
          />
        ) : (
          <>
            {editGroup ? (
              <GroupForm
                devices={devices.filter((e) => devs.find((d) => d.id === e.device.id))}
                group={editGroup}
                onFetch={_onFetch}
              />
            ) : (
              <View style={styles.container}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 6,
                    }}
                  >
                    <OpenSansText
                      style={{
                        fontWeight: "600",
                        fontSize: 18,
                        marginVertical: 12,
                      }}
                    >
                      Group Filters
                    </OpenSansText>
                    <MaterialIcons
                      name="add-to-photos"
                      size={32}
                      color="#1e88e5"
                      onPress={() => setEditGroup(true)}
                    />
                  </View>
                  <KeyboardAwareScrollView>
                    <View>
                      {groups.map((g, index) => {
                        return (
                          <TouchableOpacity key={index} onPress={() => onFilter(g)}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingHorizontal: 14,
                                paddingVertical: 10,
                                backgroundColor: "#32B666",
                                marginBottom: 6,
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: "#fff",
                                  width: 35,
                                  height: 35,
                                  borderRadius: 35,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: g.color,
                                    width: 20,
                                    height: 20,
                                    margin: 1,
                                  }}
                                />
                              </View>
                              <OpenSansText
                                style={{ fontSize: 16, fontWeight: "600" }}
                              >{`${g.name}`}</OpenSansText>
                              <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity onPress={(evt) => onEditGroup(evt, g)}>
                                  <MaterialCommunityIcons
                                    name={"circle-edit-outline"}
                                    size={28}
                                    color={"#ff7d0a"}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{ marginLeft: 12 }}
                                  onPress={(evt) => setAssignGroup(g)}
                                >
                                  <MaterialIcons name={"assistant-direction"} size={28} color={"#f80000"} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{ marginLeft: 12 }}
                                  onPress={(evt) => deleteGroup(evt, g)}
                                >
                                  <MaterialCommunityIcons
                                    name={"delete-circle-outline"}
                                    size={28}
                                    color={"#f80000"}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </KeyboardAwareScrollView>
                </View>
              </View>
            )}
          </>
        )}
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    width: widthScreen - 100,
    backgroundColor: '#ccc',
    flex: 1
  },
  wrapperInput: {
    marginTop: 18
  },
  textLabel: {
    marginLeft: 12,
    marginBottom: 4
  }
});
export default GroupFilter;
