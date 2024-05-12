import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, View, Alert, Dimensions } from "react-native";
import AppHeader from "~/components/AppHeader";
import { Colors } from "~/constants";
import APIService from "~/utils/APIService";
import Toolbar from "~/components/Toolbar";
import Results from "./Results";

import { Roles } from "~/utils/Settings";
import DefaultLayout from "../DefaultLayout";
import { showError, showSuccess } from "~/utils/toastMessage";
import AddUser from "./AddUser";
import { AppContext } from "~/Context/AppContext";

const heightScreen = Dimensions.get("window").height;

function UsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [visibleForm, showForm] = useState(false);

  const { user, setIsLoading } = useContext(AppContext);

  const getUsers = () =>
    APIService.getUsers((success, json) => {
      if (success && json.result) {
        setUsers(json.result.filter((e) => !e.deleted));
      }
    });

  handleDeleTeUser = (idUser) => {
    APIService.deleteUsers(idUser, (success, json) => {
      if (success && json.result) {
        setSelectedItems([]);
        getUsers();
        showSuccess("Deleted user successfully");
      } else {
        showError(`${json.error}`);
      }
    });
  };
  const suspendUser = (id, suspend) => {
    setIsLoading(true);
    APIService.activateUser(id, suspend, (success, json) => {
      if (success && json.result) {
        setUsers((preUsers) =>
          preUsers.map((user) => {
            if (user.id === id) {
              return { ...user, locked: suspend };
            }
            return user;
          })
        );
        setIsLoading(false);
        showSuccess(`${suspend ? "Suspended" : "Activated"} successfully!`);
      } else {
        setIsLoading(false);
      }
    });
  };
  const viewProfile = (user) => {
    navigation.navigate("Profile", {
      userId: user.id,
    });
  };

  const handleCloseAddUser = (result) => {
    showForm(false);
    if (result) {
      getUsers();
    }
  };
  useEffect(() => {
    getUsers();
  }, [navigation.navigate]);
  const isAdmin = user.role === Roles.ADMIN;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getUsers();
    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  };
  const alertConfirmDelete = (idUser) =>
    Alert.alert(
      "Are you sure you want to delete users?",
      "These accounts will be permanently deleted from your system and you cannot restore them!",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        { text: "OK", onPress: () => handleDeleTeUser(idUser) },
      ]
    );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader
        title={"Users"}
        headerBg={Colors.primary}
        iconColor={Colors.black}
        menu
        titleAlight="left"
        optionalBadge={5}
        navigation={navigation}
        right="more-vertical"
        optionalBtn="bell"
      />
      <DefaultLayout isRefresh onRefresh={onRefresh} refreshing={refreshing}>
        <View style={{ flex: 1, minHeight: heightScreen - 200 }}>
          <Toolbar
            onSearch={(text) => setSearchText(text)}
            onAdd={!isAdmin ? null : () => showForm(true)}
            addText="Add Company"
          />
          <Results
            data={users}
            searchText={searchText}
            selectedIds={selectedItems}
            onSelected={(ids) => setSelectedItems(ids)}
            onView={viewProfile}
            onSuspend={suspendUser}
            hadleDelete={alertConfirmDelete}
          />
          <AddUser
            visible={visibleForm}
            onClose={handleCloseAddUser}
            onFetch={() => {
              showForm(false);
              getUsers();
            }}
          />
        </View>
      </DefaultLayout>
    </SafeAreaView>
  );
}

export default UsersScreen;
