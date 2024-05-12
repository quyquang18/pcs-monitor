import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import CustomModal from '~/components/CustomModal';
import CustomButton from '~/components/CustomButton';
import APIService from '~/utils/APIService';
import InputSC from "~/components/InputSC";
import { showError, showSuccess } from '~/utils/toastMessage';

function RenameForm({ visible, onFetch, user, handleClose }) {
  const onSave = (values, actions) => {
    if (values.userId && values.name) {
      APIService.updateProfile(values, (success, json) => {
        if (success && json.result) {
          onFetch();
          showSuccess('Updated successfully!');
          actions.resetForm();
        } else {
          actions.setErrors({ name: json.error });
          actions.setSubmitting(false);
        }
      });
    } else {
      showError('An error occurred with this user !');
    }
  };

  return (
    <CustomModal
      visible={visible}
      handleClose={handleClose}
      titleModal="Change name"
    >
      <View style={{ flex: 1 }}>
        <Formik
          initialValues={{
            userId: user?.id,
            name: user?.name
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(100).required('Name is required')
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
            isValid,
            dirty,
            setFieldTouched,
            setFieldValue
          }) => (
            <View
              style={{
                flex: 1,
                justifyContent: 'space-between',
                paddingHorizontal: 6
              }}
            >
              <InputSC
                label="Name"
                name="name"
                onBlur={() => setFieldTouched('name')}
                onChange={(value) => {
                  setFieldValue('name', value);
                }}
                value={values.name}
                error={Boolean(touched.name && errors.name)}
                helperText={errors.name}
                style={{ marginBottom: 12 }}
              />

              <View>
                <CustomButton
                  btn_text={'Submit'}
                  style={{
                    width: '100%',
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
      </View>
    </CustomModal>
  );
}

export default RenameForm;
