import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import moment from 'moment';
import { Menu } from 'react-native-material-menu';
import { Table, TableWrapper, Cell } from 'react-native-table-component';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Roles } from '~/utils/Settings';
import TablePagination from '~/components/TablePagination';
import { AppContext } from '~/Context/AppContext';
import CustomSwitch from '~/components/CustomSwitch';
import { showError } from '~/utils/toastMessage';

function Result({
  data,
  filter,
  searchText,
  onView,
  onSuspend,
  selectedIds,
  hadleDelete
}) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [records, setRecords] = useState([]);
  const [sortItem, setSortItem] = useState();
  const [orderBy, setOrderBy] = useState('');
  const [orderType, setOrderType] = useState('asc');
  const [visibleMenu, setVisibleMenu] = useState(false);
  const { setIsLoading } = useContext(AppContext);

  const onSort = (a, b, type) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return type === 'asc' ? a - b : b - a;
    }
    if (typeof a === 'string' && typeof b === 'string') {
      return type === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    }
    if (typeof a === 'undefined' || !a) return 1;
    if (typeof b === 'undefined' || !b) return -1;
    return 0;
  };

  const handleSort = (item) => {
    setSortItem(item);
    if (!item.getItem) return;
    if (orderBy !== item.title) {
      setOrderBy(item.title);
      setOrderType('asc');
      setRecords((preRecords) =>
        preRecords.sort((a, b) =>
          onSort(item.getItem(a), item.getItem(b), 'asc')
        )
      );
    } else {
      setRecords((preRecords) =>
        preRecords.sort((a, b) =>
          onSort(
            item.getItem(a),
            item.getItem(b),
            orderType === 'asc' ? 'desc' : 'asc'
          )
        )
      );
      setOrderType((preState) => (preState === 'asc' ? 'desc' : 'asc'));
    }
  };

  const handleLimitChange = (dataSelected) => {
    setLimit(dataSelected);
  };

  const renderRoleChip = (role) => {
    switch (role) {
      case Roles.ADMIN:
        return (
          <View
            style={{
              backgroundColor: '#fb8c00',
              flexDirection: 'row',
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 18,
              minWidth: 96
            }}
          >
            <FontAwesome5 name="user-shield" color={'#fff'} size={18} />
            <Text style={{ marginLeft: 6 }}>{Roles.ADMIN}</Text>
          </View>
        );
      default:
        return (
          <View
            style={{
              backgroundColor: '#00acc1',
              flexDirection: 'row',
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 18,
              minWidth: 96
            }}
          >
            <Ionicons name="home-outline" size={18} color="#fff" />
            <Text style={{ marginLeft: 6 }}>{Roles.USER}</Text>
          </View>
        );
    }
    return;
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
        item.deviceId?.toLowerCase().indexOf(searchKeyword.toLowerCase()) >=
          0 ||
        item.name?.toLowerCase().indexOf(searchKeyword.toLowerCase()) >= 0 ||
        item.company?.name.toLowerCase().indexOf(searchKeyword.toLowerCase()) >=
          0
      );
    });
  };

  const search = searchText ? searchText.toLowerCase() : '';
  useEffect(() => {
    setIsLoading(true);
    if (sortItem) {
      setRecords(
        onFilter(search).sort((a, b) =>
          onSort(sortItem.getItem(a), sortItem.getItem(b), orderType)
        )
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
              flexDirection: 'row',
              height: '100%',
              alignItems: 'center',
              paddingHorizontal: 6,
              justifyContent: 'center'
            }}
          >
            <Text style={{ marginRight: 12 }}>{item.title}</Text>
            <FontAwesome5
              name={
                orderBy === item.title && orderType === 'asc'
                  ? 'sort-down'
                  : 'sort-up'
              }
              size={22}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: 'row',
            height: '100%',
            alignItems: 'center',
            paddingHorizontal: 6,
            justifyContent: 'center'
          }}
        >
          <Text style={{ marginRight: 12 }}>{item.title}</Text>
        </View>
      );
    }
  };

  const arrWidthColTable = [50, 60, 180, 200, 120, 100, 90];

  return (
    <View>
      <ScrollView style={styles.container} horizontal>
        <Table>
          <TableWrapper style={[styles.row, { height: 60, backgroundColor: "#ccc" }]}>
            {[
              {
                title: "Id No",
              },
              {
                title: "Name",
                sortable: true,
                getItem: (item) => item?.email,
              },
              {
                title: "Email",
                sortable: true,
                getItem: (item) => item?.name,
              },
              {
                title: "Role",
                sortable: false,
              },
              {
                title: "Created At",
                sortable: false,
              },
              {
                title: "Active/Suspended",
                sortable: false,
              },
            ].map((item, index) => (
              <Cell
                key={index}
                data={elementHead(item)}
                style={{ width: arrWidthColTable[index + 1], height: 60 }}
              />
            ))}
          </TableWrapper>
          {records.slice(page * limit, page * limit + limit).map((item, index) => {
            const date = moment(item.createdAt || item.created_at).format("DD/MM/YYYY HH:mm");
            return (
              <TableWrapper style={styles.row} key={index} selected={selectedIds.indexOf(item.id) !== -1}>
                <Cell
                  style={[{ width: arrWidthColTable[1] }, styles.cell]}
                  data={
                    <Text
                      style={{
                        alignSelf: "center",
                      }}
                    >
                      {page * limit + index + 1}
                    </Text>
                  }
                />
                <Cell
                  style={[{ width: arrWidthColTable[2] }, styles.cell]}
                  data={
                    <View>
                      {item.id === visibleMenu && (
                        <Menu
                          visible={true}
                          onRequestClose={() => setVisibleMenu(false)}
                          style={{
                            flexDirection: "row",
                            paddingHorizontal: 6,
                            paddingTop: 8,
                            marginTop: -28,
                            marginLeft: 6,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "flex-end",
                              justifyContent: "flex-start",
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                flexDirection: "row",
                                alignItems: "flex-end",
                              }}
                              onPress={() => {
                                onView && onView(item);
                                setVisibleMenu(false);
                              }}
                            >
                              <Feather name="info" size={22} color="#0CC696" />
                              <Text style={{ marginLeft: 6 }}>Info...</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                item.role === "ADMIN" ? { opacity: 0.3 } : {},
                                {
                                  flexDirection: "row",
                                  alignItems: "flex-end",
                                  marginLeft: 12,
                                },
                              ]}
                              onPress={() => {
                                if (item.role === "ADMIN") {
                                  showError("You are trying to delete an ADMIN account");
                                  setVisibleMenu(false);
                                } else {
                                  hadleDelete([item.id]);
                                  setVisibleMenu(false);
                                }
                              }}
                            >
                              <AntDesign name="delete" size={22} color="red" />
                              <Text style={{ marginLeft: 6 }}>Delete</Text>
                            </TouchableOpacity>
                          </View>
                        </Menu>
                      )}
                      <TouchableOpacity
                        delayLongPress={200}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingRight: 2,
                        }}
                        onLongPress={() => setVisibleMenu(item.id)}
                      >
                        <View
                          style={{
                            height: 40,
                            width: 40,
                            borderRadius: 40,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#ccc",
                          }}
                        >
                          <FontAwesome5 name="user-tie" color={"#fff"} size={26} />
                        </View>
                        <View
                          style={{
                            width: "80%",
                            padding: 10,
                            alignItems: "flex-start",
                          }}
                        >
                          <Text
                            numberOfLines={3}
                            style={{
                              fontSize: 13,
                            }}
                          >
                            {item.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  }
                />

                <Cell
                  textStyle={{ fontSize: 13 }}
                  style={[{ width: arrWidthColTable[3] }, styles.cell]}
                  data={item.email || item.phoneNo || item.socialID}
                />
                <Cell
                  style={[{ width: arrWidthColTable[4] }, styles.cell]}
                  data={renderRoleChip(item.role)}
                />
                <Cell
                  textStyle={{ fontSize: 13 }}
                  style={[{ width: arrWidthColTable[5] }, styles.cell]}
                  data={date}
                />
                <Cell
                  style={[
                    {
                      width: arrWidthColTable[6],
                      paddingLeft: 10,
                      flexDirection: "row",
                      justifyContent: "center",
                    },
                    styles.cell,
                  ]}
                  data={
                    <View>
                      {item.role === "ADMIN" ? (
                        <CustomSwitch
                          value={!item?.locked}
                          noAction
                          onValueChange={() => showError(`This account cannot be locked`)}
                        />
                      ) : (
                        <CustomSwitch
                          value={!item?.locked}
                          onValueChange={(value) => onSuspend(item.id, value)}
                        />
                      )}
                    </View>
                  }
                />
              </TableWrapper>
            );
          })}
        </Table>
      </ScrollView>
      <View style={{ paddingHorizontal: 22 }}>
        <TablePagination
          count={records.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1', height: 60 },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
  cell: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 12
  }
});
export default Result;
