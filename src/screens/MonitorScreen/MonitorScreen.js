import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import AppHeader from '~/components/AppHeader';
import { Colors } from '~/constants';
import APIService from '~/utils/APIService';
import FilterChip from '~/components/FilterChip';
import CustomSwitch from '~/components/CustomSwitch';
import Filter from './components/Filter';
import Results from './components/Results';
import GroupFilter from './components/GroupFilter';
import DefaultLayout from '../DefaultLayout';
import { AppContext } from '~/Context/AppContext';

const Tags = {
  startTime: 'From',
  endTime: 'To',
  deviceName: 'Device name',
  boardId: 'Device Id',
  machineId: 'Machine Number',
  machineName: 'Machine name',
  model: 'Model',
  productModel: 'Product Model',
  productName: 'Product Name',
  process: 'Process',
  workshop: 'Workshop'
};

const heightScreen = Dimensions.get('window').height;

export default function MonitorScreen({ navigation }) {
  const initialTimeRange = () => ({
    startTime: new Date(moment().startOf('date')),
    endTime: new Date(moment().endOf('date'))
  });
  const [groups, setGroups] = useState(null);
  const [devices, setDevices] = useState([]);
  const [options, setOptions] = useState(initialTimeRange());
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [visibleGroup, setVisibleGroup] = useState(false);
  const [listView, setListView] = useState(false);
  const [realtime, setRealTime] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pollingInt = useRef(null);

  const { setIsLoading } = useContext(AppContext);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 10);
    fetchGroups();
    querySearch(options, true);
  };

  const onToggleFilter = () => {
    setVisibleFilter(true);
  };
  const fetchGroups = () => {
    APIService.getGroups((success, json) => {
      if (success && json.result) {
        setGroups(json.result.groups);
      }
    });
  };
  const querySearch = (data, polling = false) => {
    if (!polling) setIsLoading(true);
    APIService.filterStats(data, (success, json) => {
      if (json.result) {
        const { devices: devs, stats, alarms } = json.result;

        devs.forEach((e) => {
          e.alarm = alarms.find((a) => a.deviceId === e.device.id);
        });
        setDevices(devs);
        devs.forEach((d) => {
          d.stats = stats.filter((e) => e.deviceId === d.device.id);
        });
      }
      setIsLoading(false);
    });
  };
  const onClear = () => {
    setOptions(initialTimeRange());
    querySearch({});
    setVisibleFilter(false);
  };

  const onSearch = (data) => {
    setOptions(data);
  };
  const parseFilter = (e) => {
    if (e === "startTime") {
      return `${Tags[e]}: ${moment(options[e]).format("HH:mm")} - Now`;
    }
    if (e === "group") {
      return `Group: ${options[e].name}`;
    }
    return `${Tags[e]}: ${options[e]}`;
  };

  const onRemoveFitler = (key) => {
    if (key === "group") {
      AsyncStorage.removeItem("groupFilter");
    }
    delete options[key];
    setOptions({ ...options });
    querySearch(options);
  };

  const onFilterGroup = useCallback(
    (group) => {
      options.group = group;
      AsyncStorage.setItem("groupFilter", group.name);
      setVisibleGroup(null);
      setOptions({
        ...options,
        model: group.model,
        productModel: group.productModel,
      });
    },
    [options]
  );

  useEffect(() => {
    querySearch(options);
  }, [navigation.navigate, options]);

  useEffect(() => {
    fetchGroups();
  }, [navigation.navigate]);

  useEffect(() => {
    const groupFilter = AsyncStorage.getItem("groupFilter");
    if (groupFilter && groups) {
      const group = groups.find((e) => e.name === groupFilter);
      if (group) {
        setOptions((prev) => ({ ...prev, group }));
      }
    }
  }, [groups]);
  useEffect(() => {
    clearInterval(pollingInt.current);
    if (realtime) {
      pollingInt.current = setInterval(() => {
        querySearch(options, true);
      }, 4000);
    }
  }, [realtime]);

  const [openFAB, setOpenFAB] = useState(false);
  const [visibleFAB, setVisibleFAB] = useState(false);
  const handleScroll = (event) => {
    const locationScroll = event.nativeEvent.contentOffset.y;
    if (locationScroll > heightScreen / 2) {
      setVisibleFAB(true);
    } else {
      setVisibleFAB(false);
    }
  };
  const onStateChange = ({ open }) => setOpenFAB(open);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader
        title={"Monitor"}
        headerBg={Colors.primary}
        iconColor={Colors.black}
        menu
        titleAlight="left"
        optionalBadge={5}
        navigation={navigation}
        right="more-vertical"
        optionalBtn="bell"
      />
      <DefaultLayout isRefresh onRefresh={onRefresh} refreshing={refreshing} handleScroll={handleScroll}>
        <View
          style={{
            paddingRight: 8,
            paddingTop: 6,
            backgroundColor: "#212224c2",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            flex: 1,
            height: 40,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "50%",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                paddingHorizontal: 2,
                marginLeft: 12,
              }}
              onPress={onToggleFilter}
            >
              <MaterialCommunityIcons name="filter" size={26} color={"#fff"} />
              <Text style={{ color: "#fff", fontSize: 12, marginRight: -5 }}>Filter</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CustomSwitch
                textLeft="Live Sync"
                value={realtime}
                onValueChange={() => setRealTime(!realtime)}
              />
            </View>
          </View>
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={{ marginRight: 22 }} onPress={() => setListView(!listView)}>
              {listView ? (
                <MaterialCommunityIcons name="view-grid-outline" size={24} color={"#FFF"} />
              ) : (
                <MaterialCommunityIcons name="view-list-outline" size={24} color={"#FFF"} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVisibleGroup(true)}>
              <FontAwesome5 name="layer-group" size={24} color={"#FFF"} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          horizontal
          style={{
            paddingVertical: 6,
            paddingHorizontal: 6,
            borderBottomWidth: 1,
            flexDirection: "row",
            margin: 0,
          }}
        >
          {Object.keys(options).map((e, index) => {
            const removable = e !== "startTime" && e !== "endTime";
            return (
              !!options[e] &&
              e !== "endTime" && (
                <FilterChip
                  key={index}
                  style={{ marginRight: 6 }}
                  label={parseFilter(e)}
                  onRemove={removable ? () => onRemoveFitler(e) : null}
                />
              )
            );
          })}
        </ScrollView>
        <Filter
          options={options}
          visible={visibleFilter}
          onSearch={onSearch}
          handleClose={() => setVisibleFilter(false)}
          onClear={() => onClear()}
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <View style={{ flex: 1 }}>
            <Results
              data={devices.filter((e) => {
                return !options.group || options.group.devices.find((d) => d.id === e.device.id);
              })}
              onGroup={onFilterGroup}
              startTime={options.startTime}
              endTime={options.endTime}
              groups={groups || []}
              listView={listView}
              navigation={navigation}
            />
          </View>
        </View>
        <View style={{}}>
          {visibleGroup && (
            <GroupFilter
              visible={visibleGroup}
              devices={devices}
              data={groups}
              onFilter={(group) => onFilterGroup(group)}
              onFetch={fetchGroups}
              handleClose={() => setVisibleGroup(null)}
            />
          )}
        </View>
      </DefaultLayout>

      {visibleFAB && (
        <FAB.Group
          open={openFAB}
          visible
          icon={openFAB ? "close" : "plus"}
          actions={[
            {
              icon: "filter",
              label: "Filter options",
              onPress: () => onToggleFilter(),
            },
            {
              icon: listView ? "view-grid-outline" : "view-list-outline",
              label: `Convert to ${!listView ? "List" : "Grid"} `,
              onPress: () => setListView(!listView),
            },
            {
              icon: "layers-triple",
              label: "Filer Group",
              onPress: () => setVisibleGroup(true),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (openFAB) {
              // do something if the speed dial is open
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
