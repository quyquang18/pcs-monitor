import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import CustomModal from '~/components/CustomModal';
import CustomButton from '~/components/CustomButton';
import APIService from '~/utils/APIService';
import InputSC from "~/components/InputSC";
import { showSuccess } from '~/utils/toastMessage';

function AddUser({ visible, onClose, onFetch }) {
  const handleClose = (result) => {
    onClose(result);
  };
  const onSave = (values, actions) => {
    APIService.addUser(values.name, values.email, (success, json) => {
      if (success && json.result) {
        onFetch();
        showSuccess('Created user successfully!');
        actions.resetForm();
      } else {
        actions.setErrors({ email: 'Email exists!' });
        actions.setSubmitting(false);
      }
    });
  };

  return (
    <CustomModal
      visible={visible}
      handleClose={handleClose}
      titleModal="Company Info"
    >
      <View style={{ flex: 1 }}>
        <Formik
          initialValues={{
            name: '',
            email: ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(100).required('Name is required'),
            email: Yup.string()
              .email('Invalid email format')
              .required('Email is required')
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
              <View>
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
                <InputSC
                  label="Email"
                  name="email"
                  onBlur={() => setFieldTouched('email')}
                  onChange={(value) => {
                    setFieldValue('email', value);
                  }}
                  value={values.email}
                  error={Boolean(touched.email && errors.email)}
                  helperText={errors.email}
                />
              </View>
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

export default AddUser;
