import React, { useEffect, useState, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

import APIService from '~/utils/APIService';
import CustomModal from '~/components/CustomModal';
import SelectDropdown from '~/components/SelectDropdown';

function Filter({ options, visible, onSearch, handleClose, onClear }) {
  const [boardIds, setBoardIds] = useState([]);
  const [machineIds, setMachineIds] = useState([]);
  const [machineNames, setMachineNames] = useState([]);
  const [productModels, setProductModels] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [models, setModels] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const onSave = (values) => {
    onSearch(values);
  };

  const fetchSuggestions = () => {
    APIService.getStatsFilters((success, json) => {
      if (success && json.result) {
        const { result } = json;
        setBoardIds(result.boardIds);
        setMachineIds(result.machineIds);
        setMachineNames(result.machineNames);
        setModels(result.models);
        setProductModels(result.productModels);
        setProductNames(result.productNames);
        setProcesses(result.processes);
        setWorkshops(result.workshops);
      }
    });
  };
  useEffect(() => {
    setBoardIds([]);
    setMachineIds([]);
    setMachineNames([]);
    setModels([]);
    setProductModels([]);
    setProductNames([]);
    setProcesses([]);
    setWorkshops([]);
    fetchSuggestions();
  }, [options]);

  return (
    <CustomModal
      visible={visible}
      handleClose={handleClose}
      isScrollView={true}
      titleModal="Filter Options"
    >
      <Formik
        initialValues={{
          startTime: options?.startTime,
          endTime: options?.endTime,
          deviceName: options?.deviceName,
          boardId: options?.boardId,
          machineId: options?.machineId,
          machineName: options?.machineName,
          model: options?.model,
          productModel: options?.productModel,
          productName: options?.productName,
          process: options?.process,
          workshop: options?.workshop
        }}
        validationSchema={Yup.object().shape({
          deviceName: Yup.string(),
          boardId: Yup.string(),
          machineId: Yup.string(),
          machineName: Yup.string(),
          model: Yup.string(),
          productModel: Yup.string(),
          productName: Yup.string(),
          process: Yup.string(),
          workshop: Yup.string()
        })}
        onSubmit={(values, actions) => {
          onSave(values, actions);
          handleClose();
          actions.setSubmitting(false);
        }}
      >
        {({ handleSubmit, isSubmitting, values, setFieldValue }) => {
          return (
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <SelectDropdown
                label="Workshop"
                listData={workshops}
                leftIconName={'home-assistant'}
                value={values.workshop}
                search
                onChange={(item) => {
                  if (item) {
                    setFieldValue('workshop', item);
                  }
                }}
              />
              <SelectDropdown
                label="Product Model"
                listData={productModels}
                leftIconName={'alpha-m-box-outline'}
                value={values.productModel}
                search
                onChange={(item) => {
                  if (item) {
                    setFieldValue('productModel', item);
                  }
                }}
              />
              <SelectDropdown
                label="Product Name"
                listData={productNames}
                search
                leftIconName={'alpha-n-box-outline'}
                value={values.productName}
                onChange={(item) => {
                  if (item) {
                    setFieldValue('productName', item);
                  }
                }}
              />
              <SelectDropdown
                label="Device Id"
                listData={boardIds}
                search
                leftIconName={'identifier'}
                value={values.boardId}
                onChange={(item) => {
                  if (item) {
                    setFieldValue('boardId', item);
                  }
                }}
              />
              <SelectDropdown
                label="Machine Number"
                listData={machineIds}
                search
                leftIconName={'identifier'}
                value={values.machineId}
                onChange={(item) => {
                  if (item) {
                    setFieldValue('machineId', item);
                  }
                }}
              />
              <SelectDropdown
                label="Machine Name"
                listData={machineNames}
                search
                leftIconName={'alpha-n-box-outline'}
                value={values.machineName}
                onChange={(item) => {
                  if (item) {
                    setFieldValue('machineName', item);
                  }
                }}
              />
              <SelectDropdown
                label="Model"
                listData={models}
                search
                leftIconName={'alpha-m-box-outline'}
                value={values.model}
                onChange={(item) => {
                  if (item) {
                    setFieldValue('model', item);
                  }
                }}
              />
              <SelectDropdown
                label="Process"
                listData={processes}
                search
                leftIconName={'chart-timeline-variant'}
                value={values.process}
                onChange={(item) => {
                  if (item) {
                    setFieldValue('process', item);
                  }
                }}
              />

              <View
                style={{
                  marginTop: 22,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'space-around'
                }}
              >
                <Button
                  style={{
                    flex: 0.3,
                    borderRadius: 5,
                    backgroundColor: '#AE1717'
                  }}
                  mode="contained"
                  onPress={onClear}
                >
                  Reset
                </Button>
                <Button
                  style={{
                    flex: 0.3,
                    borderRadius: 5,
                    backgroundColor: '#2C9C0E'
                  }}
                  mode="contained"
                  onPress={handleSubmit}
                >
                  Search
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
    </CustomModal>
  );
}
const styles = StyleSheet.create({
  wrapperInput: {
    marginTop: 18
  },
  textLabel: {
    marginLeft: 12,
    marginBottom: 4
  }
});
export default memo(Filter);
