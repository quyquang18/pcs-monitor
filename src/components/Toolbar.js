import React from "react";
import { View, TouchableOpacity } from "react-native";
import CustomButton from "~/components/CustomButton";
import InputSearch from "~/components/InputSearch";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
function Toolbar({ styleInputSearch, onAdd, onDelete, onSearch, addText }) {
  return (
    <View
      style={{
        padding: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        height: 44,
      }}
    >
      <InputSearch
        style={[{ width: "50%" }, styleInputSearch]}
        onChangeText={(text) => onSearch && onSearch(text)}
      />

      {onDelete && (
        <CustomButton
          style={{
            color: "#fff",
            marginRight: 20,
            backgroundColor: "#f00",
            width: "20%",
            height: "100%",
            borderRadius: 8,
          }}
          style_text={{ fontSize: 14 }}
          on_press={() => onDelete && onDelete()}
          btn_text={"Delete"}
        />
      )}
      {onAdd && onDelete && (
        <TouchableOpacity
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
            paddingHorizontal: 12,
            backgroundColor: "#800080",
            borderRadius: 5,
          }}
          onPress={() => onAdd && onAdd()}
        >
          <MaterialIcons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      )}
      {onAdd && !onDelete && (
        <CustomButton
          style={{
            color: "#fff",
            marginRight: 20,
            backgroundColor: "#800080",
            width: "35%",
            height: "100%",
            borderRadius: 8,
            paddingHorizontal: 8,
          }}
          style_text={{ fontSize: 13 }}
          on_press={() => onAdd && onAdd()}
          btn_text={addText ?? "Add Item"}
        />
      )}
    </View>
  );
}

export default Toolbar;
