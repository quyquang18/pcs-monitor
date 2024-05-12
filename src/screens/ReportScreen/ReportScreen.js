import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

import DefaultLayout from '../DefaultLayout';
import AppHeader from '~/components/AppHeader';
import { Colors } from '~/constants';
import APIService from '~/utils/APIService';
import FilterChip from '~/components/FilterChip';
import Filter from './Filter';
import Results from './Results';
import ChartCard from './ChartCard';
import CustomButton from '~/components/CustomButton';
import { showWarning } from '~/utils/toastMessage';
import { AppContext } from '~/Context/AppContext';

const Tags = {
  startTime: "From",
  endTime: "To",
  deviceName: "Device name",
  boardId: "Device Id",
  machineId: "Machine Number",
  machineName: "Machine name",
  model: "Model",
  productModel: "Product Model",
  productName: "Product Name",
  process: "Process",
  workshop: "Workshop",
};
function ReportScreen({ navigation }) {
  const { setIsLoading, orientationHoz } = useContext(AppContext);
  const initialTimeRange = () => ({
    startTime: moment(new Date()).startOf("day").valueOf(),
    endTime: moment(new Date()).endOf("day").valueOf(),
  });
  const [devices, setDevices] = useState([]);
  const [options, setOptions] = useState(initialTimeRange());
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [chartView, setChartView] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const onToggleFilter = () => {
    setVisibleFilter(true);
  };

  const onCompare = () => {
    if (selectedIds?.length > 0) {
      setChartView(!chartView);
    } else {
      showWarning("Please select at least 1 device");
    }
  };

  const onSelectItems = useCallback((items) => {
    setSelectedIds(items);
  }, []);

  const querySearch = (data) => {
    setIsLoading(true);
    APIService.filterStats(data, (success, json) => {
      if (json.result) {
        const { devices: devs, stats, cycles, alarms } = json.result;
        devs.forEach((e) => {
          e.alarm = alarms.find((a) => a.deviceId === e.device.id);
          e.cycles = cycles.find((a) => a.deviceId === e.device.id);
        });
        setDevices(devs);
        devs.forEach((d) => {
          d.stats = stats.filter((e) => e.deviceId === d.device.id);
        });
        setIsLoading(false);
      }
    });
  };

  const onClear = () => {
    setOptions(initialTimeRange());
    querySearch({});
  };

  const onSearch = (data) => {
    setOptions(data);
  };

  const parseFilter = (e) => {
    if (e === "startTime" || e === "endTime") {
      return `${Tags[e]}: ${moment(options[e]).format("YYYY-MM-DD HH:mm")}`;
    }
    return `${Tags[e]}: ${options[e]}`;
  };

  const onRemoveFitler = (key) => {
    delete options[key];
    setOptions({ ...options });
    querySearch(options);
  };

  useEffect(() => {
    querySearch(options);
  }, [navigation.navigate, options]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 10);
    querySearch(options);
  };
  const onPressFilter = (e) => {
    setOpenDatePicker(e);
  };
  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setOpenDatePicker(false);
    }
    if (event.type === "dismissed") {
      return;
    }
    if (event.type === "neutralButtonPressed") {
      const coppyOptions = { ...options };
      coppyOptions[openDatePicker] = new Date(0).getTime();
      setOptions(coppyOptions);
    } else {
      const coppyOptions = { ...options };
      coppyOptions[openDatePicker] = new Date(selectedDate).getTime();
      setOptions(coppyOptions);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <AppHeader
        title={"Reports"}
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
        <View
          style={{
            paddingVertical: 6,
            paddingHorizontal: 6,
            borderBottomWidth: 1,
            borderBottomColor: "#546e7a",
            flexDirection: "row",
            margin: 0,
            height: 50,
          }}
        >
          <TouchableOpacity onPress={onToggleFilter}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                paddingHorizontal: 2,
                marginRight: 12,
              }}
            >
              <MaterialCommunityIcons name="filter" size={30} color={"#F06D12"} />
              <Text style={{ color: "#F06D12", fontSize: 12, marginLeft: -8 }}>Filter</Text>
            </View>
          </TouchableOpacity>
          <ScrollView horizontal>
            {Object.keys(options).map((e, index) => {
              const removable = e !== "startTime" && e !== "endTime";
              const isPress = e === "startTime" || e === "endTime";
              return (
                !!options[e] && (
                  <FilterChip
                    style={{ marginRight: 12 }}
                    key={index}
                    label={parseFilter(e)}
                    onPress={isPress ? () => onPressFilter(e) : null}
                    onRemove={removable ? () => onRemoveFitler(e) : null}
                  />
                )
              );
            })}
          </ScrollView>
        </View>
        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <CustomButton
            style={{
              width: "40%",
              borderRadius: 4,
              height: 40,
              marginLeft: 22,
            }}
            textLeftIcon={"" + selectedIds.length}
            btn_text={chartView ? "Cancel" : "Compare"}
            on_press={onCompare}
            leftIcon={<FontAwesome name="exchange" size={22} color="#fff" />}
          />
        </View>
        {chartView && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {devices
              .filter((e) => selectedIds.includes(e.device.id))
              .map((e, index) => (
                <View style={orientationHoz ? { width: "48%" } : { width: "100%" }} key={index}>
                  <ChartCard data={e} startTime={options.startTime} endTime={options.endTime} />
                </View>
              ))}
          </View>
        )}
        {openDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            // maximumDate={maximumDate || null}
            timeZoneName={"Asia/Bangkok"}
            value={new Date(options[openDatePicker])}
            mode={"date"}
            // display={DISPLAY_VALUES[0]}
            onChange={onChangeDate}
            minuteInterval={1}
          />
        )}
        <Filter
          options={options}
          visible={visibleFilter}
          onSearch={onSearch}
          handleClose={() => setVisibleFilter(false)}
          onReset={() => onClear()}
        />
        {!chartView && (
          <Results
            data={devices}
            startTime={options.startTime}
            endTime={options.endTime}
            selectedIds={selectedIds}
            onSelect={onSelectItems}
          />
        )}
      </DefaultLayout>
    </SafeAreaView>
  );
}

export default ReportScreen;
