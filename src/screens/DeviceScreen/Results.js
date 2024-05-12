import React, { useEffect, useState, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import moment from "moment";
import { Table, TableWrapper, Cell } from "react-native-table-component";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Roles } from "~/utils/Settings";
import TablePagination from "~/components/TablePagination";
import CustomCheckBox from "~/components/CustomCheckBox";
import { OpenSansText } from "~/components/StyledText";
import { AppContext } from "~/Context/AppContext";
import { Height_Width, windowHeight } from "~/constants";

function Result({ data, filter, searchText, onSelected, onView, selectedIds }) {
  const { setIsLoading, orientationHoz } = useContext(AppContext);
  const numberRowTable = Math.round((windowHeight - (Height_Width.height_header + 20) - 34 - 44 - 60) / 40); //60:header
  const [limit, setLimit] = useState(numberRowTable);
  const [page, setPage] = useState(0);
  const [records, setRecords] = useState([]);
  const [sortItem, setSortItem] = useState();
  const [orderBy, setOrderBy] = useState("");
  const [orderType, setOrderType] = useState("asc");
  const [isCheckAll, setIsCheckAll] = useState(false);

  useEffect(() => {
    const heightScreen = Dimensions.get("window").height;
    const numberRowTable = Math.round((heightScreen - (Height_Width.height_header + 20) - 34 - 44 - 60) / 40); //60:header
    setLimit(numberRowTable);
  }, [orientationHoz]);
  const handleSelectAll = () => {
    let newSelectedItemIds;
    if (!isCheckAll) {
      newSelectedItemIds = data.map((item) => item.id);
      setIsCheckAll(true);
    } else {
      newSelectedItemIds = [];
      setIsCheckAll(false);
    }
    onSelected(newSelectedItemIds);
  };

  const handleSelectOne = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelectedItemIds = [];

    if (selectedIndex === -1) {
      newSelectedItemIds = newSelectedItemIds.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelectedItemIds = newSelectedItemIds.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelectedItemIds = newSelectedItemIds.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedItemIds = newSelectedItemIds.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }
    onSelected(newSelectedItemIds);
  };
  const onSort = (a, b, type) => {
    if (typeof a === "number" && typeof b === "number") {
      return type === "asc" ? a - b : b - a;
    }
    if (typeof a === "string" && typeof b === "string") {
      return type === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    }
    if (typeof a === "undefined" || !a) return 1;
    if (typeof b === "undefined" || !b) return -1;
    return 0;
  };

  const handleSort = (item) => {
    setSortItem(item);
    if (!item.getItem) return;
    if (orderBy !== item.title) {
      setOrderBy(item.title);
      setOrderType("asc");
      setRecords((preRecords) => preRecords.sort((a, b) => onSort(item.getItem(a), item.getItem(b), "asc")));
    } else {
      setRecords((preRecords) =>
        preRecords.sort((a, b) =>
          onSort(item.getItem(a), item.getItem(b), orderType === "asc" ? "desc" : "asc")
        )
      );
      setOrderType((preState) => (preState === "asc" ? "desc" : "asc"));
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const onFilter = (searchKeyword) => {
    return data.filter((item) => {
      if (filter) {
        let not = false;
        Object.keys(filter).forEach((key) => {
          if (!filter[key]) return;
          if (item[key] !== filter[key]) not = true;
        });
        if (not) return false;
      }
      return (
        item.deviceId?.toLowerCase().indexOf(searchKeyword.toLowerCase()) >= 0 ||
        item.name?.toLowerCase().indexOf(searchKeyword.toLowerCase()) >= 0 ||
        item.company?.name.toLowerCase().indexOf(searchKeyword.toLowerCase()) >= 0
      );
    });
  };

  const search = searchText ? searchText.toLowerCase() : "";
  useEffect(() => {
    setIsLoading(true);
    if (sortItem) {
      setRecords(
        onFilter(search).sort((a, b) => onSort(sortItem.getItem(a), sortItem.getItem(b), orderType))
      );
      setIsLoading(false);
    } else {
      setRecords(onFilter(search));
      setIsLoading(false);
    }
  }, [data, search, filter]);

  const maxPage = Math.floor(records.length / limit);
  if (page > maxPage) {
    setPage(maxPage);
  }
  const elementHead = (item) => {
    if (item.sortable) {
      return (
        <TouchableOpacity onPress={() => handleSort(item)}>
          <View
            style={{
              flexDirection: "row",
              height: "100%",
              alignItems: "center",
              paddingHorizontal: 6,
              justifyContent: "center",
            }}
          >
            <Text style={{ marginRight: 8, fontSize: 13 }}>{item.title}</Text>
            <FontAwesome5
              name={orderBy === item.title && orderType === "asc" ? "sort-down" : "sort-up"}
              size={20}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
            paddingHorizontal: 6,
            justifyContent: "center",
          }}
        >
          <Text style={{ marginRight: 2, fontSize: 13 }}>{item.title}</Text>
        </View>
      );
    }
  };
  const elementChecker = () => {
    return (
      <CustomCheckBox
        isChecked={selectedIds.length === data.length}
        color="primary"
        indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
        onPress={handleSelectAll}
      />
    );
  };
  const arrWidthColTable = [50, 60, 120, 130, 130, 100, 100, 70];

  return (
    <View style={{ flex: 1, justifyContent: "space-around", alignItems: "center" }}>
      <ScrollView style={{ backgroundColor: "#456", flex: 1 }} horizontal>
        <Table>
          <TableWrapper style={[styles.row, { height: 50, backgroundColor: "#ccc" }]}>
            <Cell
              style={[{ width: arrWidthColTable[0], paddingLeft: 10 }, styles.cell]}
              data={elementChecker()}
            />
            {[
              {
                title: "Id No",
                sortable: true,
                getItem: (item) => item?.id,
              },
              {
                title: "Device Id",
                sortable: true,
                getItem: (item) => item?.deviceId,
              },
              {
                title: "Name",
                sortable: true,
                getItem: (item) => item?.name,
              },
              {
                title: "Company",
                sortable: true,
                getItem: (item) => item?.company?.name,
              },
              {
                title: "Online/Offline",
                sortable: false,
              },
              {
                title: "Created At",
                sortable: true,
                getItem: (item) => item?.createdAt || item?.created_at,
              },
              {
                title: "Assigned",
                sortable: false,
              },
            ].map((item, index) => (
              <Cell
                key={index}
                data={elementHead(item)}
                style={{ width: arrWidthColTable[index + 1], height: 50 }}
              />
            ))}
          </TableWrapper>
          {records.slice(page * limit, page * limit + limit).map((item, index) => {
            const date = moment(item.createdAt || item.created_at).format("DD/MM/YYYY HH:mm");
            const isSelected = selectedIds.indexOf(item.id) !== -1;
            return (
              <TableWrapper
                style={[styles.row, isSelected ? { backgroundColor: "#0CC697" } : {}]}
                key={index}
              >
                <Cell
                  style={[{ width: arrWidthColTable[0], paddingLeft: 10 }, styles.cell]}
                  data={<CustomCheckBox isChecked={isSelected} onPress={() => handleSelectOne(item.id)} />}
                />

                <Cell style={[{ width: arrWidthColTable[1] }, styles.cell]} data={page * limit + index + 1} />
                <Cell
                  style={[{ width: arrWidthColTable[2] }, styles.cell]}
                  data={
                    <Text style={{ fontSize: 13 }} onPress={() => onView && onView(item)}>
                      {item.deviceId}
                    </Text>
                  }
                />
                <Cell
                  textStyle={{ fontSize: 10 }}
                  style={[{ width: arrWidthColTable[3] }, styles.cell]}
                  data={
                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => onView && onView(item)}>
                      <Feather name={"hard-drive"} size={18} color="#00acc1" />
                      <Text style={{ fontSize: 13 }}> {item.name}</Text>
                    </TouchableOpacity>
                  }
                />
                <Cell
                  style={[{ width: arrWidthColTable[4] }, styles.cell]}
                  data={
                    <View style={{ flexDirection: "row" }}>
                      <FontAwesome5 name={"warehouse"} size={18} color="#00acc1" />
                      <Text style={{ fontSize: 13, marginLeft: 4 }}>{item.company?.name}</Text>
                    </View>
                  }
                />

                <Cell
                  style={[{ width: arrWidthColTable[5], alignItems: "center" }, styles.cell]}
                  data={
                    <OpenSansText
                      style={[
                        item?.online?.toLowerCase() === "online"
                          ? { color: "green", fontWeight: "800" }
                          : { color: "#9D2109", fontWeight: "700" },
                      ]}
                    >
                      {item.online || "OFFLINE"}
                    </OpenSansText>
                  }
                />
                <Cell
                  textStyle={{ fontSize: 13 }}
                  style={[{ width: arrWidthColTable[6] }, styles.cell]}
                  data={date}
                />
                <Cell
                  style={[{ width: arrWidthColTable[7] }, styles.cell]}
                  data={
                    item.company?.role !== Roles.ADMIN && (
                      <>
                        <TouchableOpacity style={{ marginLeft: 12 }}>
                          <Feather name={"check-circle"} size={22} color="#2e7d32" />
                        </TouchableOpacity>
                        <Text style={{ display: "none" }}>Yes</Text>
                      </>
                    )
                  }
                />
              </TableWrapper>
            );
          })}
        </Table>
      </ScrollView>
      <TablePagination
        count={records.length}
        onChangePage={handlePageChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  // container: { flex: 1 },
  head: { height: 40, backgroundColor: "#808B97" },
  text: { margin: 6 },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1", height: 40 },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" },
  cell: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 12,
  },
});
export default Result;
