import React from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
function TablePagination({ count, onChangePage, page, rowsPerPage, rowsPerPageOptions }) {
  let listRowPerPage = [];
  const disabledNextBtn = page + 1 === Math.ceil(count / rowsPerPage);
  const disabledPrevBtn = page <= 0;
  if (rowsPerPageOptions?.length) {
    rowsPerPageOptions.map((item) => {
      listRowPerPage.push("" + item);
    });
  }
  const handleChangePage = (key) => {
    if (key === "prev") {
      if (page <= 0) {
        onChangePage(0);
      } else {
        onChangePage(page - 1);
      }
    }
    if (key === "next") {
      if (page > Math.ceil(count / rowsPerPage)) {
        onChangePage(Math.ceil(count / rowsPerPage));
      } else {
        onChangePage(page + 1);
      }
    }
  };
  const valueStart = page * rowsPerPage + 1;
  const valueEnd = Math.min(valueStart + rowsPerPage - 1, count);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
      }}
    >
      <TouchableOpacity
        onPress={() => handleChangePage("prev")}
        disabled={disabledPrevBtn}
        style={[
          disabledPrevBtn ? { backgroundColor: "#ccc", opacity: 0.5 } : { backgroundColor: "#0CC696" },
          { padding: 4, borderRadius: 4 },
        ]}
      >
        <MaterialIcons name="navigate-before" size={26} color={disabledPrevBtn ? "#363636" : "#fff"} />
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: "#e5e555",
          height: "100%",
          paddingHorizontal: 24,
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 12,
        }}
      >
        <Text style={{ fontSize: 14 }}>{`${valueStart}-${valueEnd} of ${count}`}</Text>
      </View>
      <TouchableOpacity
        disabled={disabledNextBtn}
        onPress={() => handleChangePage("next")}
        style={[
          disabledNextBtn ? { backgroundColor: "#ccc", opacity: 0.5 } : { backgroundColor: "#0CC696" },
          { padding: 4, borderRadius: 4 },
        ]}
      >
        <MaterialIcons name="navigate-next" size={26} color={disabledNextBtn ? "#363636" : "#fff"} />
      </TouchableOpacity>
    </View>
  );
}

export default TablePagination;
