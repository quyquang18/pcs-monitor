import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import APIService from "~/utils/APIService";
import InputSC from "~/components/InputSC";
import CustomButton from "~/components/CustomButton";
import CustomModal from "~/components/CustomModal";

const EditDevice = ({
  visible,
  device,
  setting,
  handleClose,
  updateSuccess
}) => {
  const settingHash = Math.floor(Math.random() * 10 ** 12);

  const onSave = (values) => {
    APIService.deviceSettings(
      { deviceId: device.id, ...values },
      (success, json) => {
        if (success && json) {
          updateSuccess();
        } else {
          //   actions.setErrors({ workshop:  });
          // showError(json.error);
        }
      }
    );
  };

  return (
    <CustomModal
      visible={visible}
      handleClose={handleClose}
      titleModal="Edit Device Info"
      isScrollView={true}
    >
      <Formik
        initialValues={{
          deviceName: device?.name || '',
          name: setting?.settingName || '',
          settingId: setting?.settingId || settingHash.toString(16),
          productModel: setting?.productModel || '',
          productName: setting?.productName || '',
          productUnit: setting?.productUnit || '',
          boardId: setting?.boardId || '',
          machineId: setting?.machineId || '',
          machineName: setting?.machineName || '',
          model: setting?.model || '',
          process: setting?.process || '',
          workshop: setting?.workshop || ''
        }}
        validationSchema={Yup.object().shape({
          deviceName: Yup.string().max(100).required('Device name is required'),
          name: Yup.string().max(100),
          productModel: Yup.string(),
          productName: Yup.string(),
          productUnit: Yup.string(),
          boardId: Yup.string().required('Device Id Id is required'),
          machineId: Yup.string(),
          machineName: Yup.string(),
          model: Yup.string(),
          process: Yup.string(),
          workshop: Yup.string()
        })}
        onSubmit={(values, actions) => {
          onSave(values, actions);
        }}
      >
        {({
          errors,
          handleSubmit,
          touched,
          values,
          setFieldTouched,
          setFieldValue,
          isValid,
          dirty
        }) => (
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              paddingHorizontal: 6
            }}
          >
            <InputSC
              styleContainer={styles.inputSc}
              mode={'simple'}
              label="Device Name"
              name="deviceName"
              onBlur={() => setFieldTouched('deviceName')}
              onChange={(value) => {
                setFieldValue('deviceName', value);
              }}
              value={values.deviceName}
              error={Boolean(touched.deviceName && errors.deviceName)}
              helperText={errors.deviceName}
            />

            <InputSC
              styleContainer={styles.inputSc}
              mode={'simple'}
              label="Product Model"
              name="productModel"
              onBlur={() => setFieldTouched('productModel')}
              onChange={(value) => {
                setFieldValue('productModel', value);
              }}
              value={values.productModel}
              error={Boolean(touched.productModel && errors.productModel)}
              helperText={errors.productModel}
            />
            <InputSC
              styleContainer={styles.inputSc}
              mode={'simple'}
              label="Product Name"
              name="productName"
              onBlur={() => setFieldTouched('productName')}
              onChange={(value) => {
                setFieldValue('productName', value);
              }}
              value={values.productName}
              error={Boolean(touched.productName && errors.productName)}
              helperText={errors.productName}
            />
            <InputSC
              styleContainer={styles.inputSc}
              mode={'simple'}
              label="Product Unit"
              name="productUnit"
              onBlur={() => setFieldTouched('productUnit')}
              onChange={(value) => {
                setFieldValue('productUnit', value);
              }}
              value={values.productUnit}
              error={Boolean(touched.productUnit && errors.productUnit)}
              helperText={errors.productUnit}
            />
            <InputSC
              styleContainer={styles.inputSc}
              mode={'simple'}
              label="Device Id"
              name="boardId"
              onBlur={() => setFieldTouched('boardId')}
              onChange={(value) => {
                setFieldValue('boardId', value);
              }}
              value={values.boardId}
              error={Boolean(touched.boardId && errors.boardId)}
              helperText={errors.boardId}
            />
            <InputSC
              styleContainer={styles.inputSc}
              mode={'simple'}
              label="Machine Number"
              name="machineId"
              onBlur={() => setFieldTouched('machineId')}
              onChange={(value) => {
                setFieldValue('machineId', value);
              }}
              value={values.machineId}
              error={Boolean(touched.machineId && errors.machineId)}
              helperText={errors.machineId}
            />
            <InputSC
              styleContainer={styles.inputSc}
              mode={'simple'}
              label="Machine Name"
              name="machineName"
              onBlur={() => setFieldTouched('machineName')}
              onChange={(value) => {
                setFieldValue('machineName', value);
              }}
              value={values.machineName}
              error={Boolean(touched.machineName && errors.machineName)}
              helperText={errors.machineName}
            />
            <InputSC
              styleContainer={styles.inputSc}
              mode={'simple'}
              label="Machine Model"
              name="model"
              onBlur={() => setFieldTouched('model')}
              onChange={(value) => {
                setFieldValue('model', value);
              }}
              value={values.model}
              error={Boolean(touched.model && errors.model)}
              helperText={errors.model}
            />
            <InputSC
              styleContainer={styles.inputSc}
              mode={'simple'}
              label="Process"
              name="process"
              onBlur={() => setFieldTouched('process')}
              onChange={(value) => {
                setFieldValue('process', value);
              }}
              value={values.process}
              error={Boolean(touched.process && errors.process)}
              helperText={errors.process}
            />
            <InputSC
              styleContainer={styles.inputSc}
              mode={'simple'}
              label="Workshop"
              name="workshop"
              onBlur={() => setFieldTouched('workshop')}
              onChange={(value) => {
                setFieldValue('workshop', value);
              }}
              value={values.workshop}
              error={Boolean(touched.workshop && errors.workshop)}
              helperText={errors.workshop}
            />
            <View>
              <CustomButton
                btn_text={'Submit'}
                style={{
                  width: '100%',
                  marginTop: 22,
                  borderRadius: 5
                }}
                mode="contained"
                on_press={() => handleSubmit()}
                disabled={!isValid || !dirty}
              ></CustomButton>
            </View>
          </View>
        )}
      </Formik>
    </CustomModal>
  );
};
const styles = StyleSheet.create({
  inputSc: { marginBottom: 6, marginTop: 12 }
});
export default EditDevice;
