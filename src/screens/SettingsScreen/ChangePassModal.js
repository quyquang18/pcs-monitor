import React, { useEffect, useState, useContext } from "react";
import { View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import * as SecureStore from "expo-secure-store";
import APIService from "~/utils/APIService";
import CustomModal from "~/components/CustomModal";
import CustomButton from "~/components/CustomButton";
import { AppContext } from "~/Context/AppContext";
import InputSC from "~/components/InputSC";
import Settings from "~/utils/Settings";

function ChangePassModal({ visible, handleClose }) {
  const { setUser } = useContext(AppContext);

  const logout = () => {
    setUser({ isLoggedIn: false, role: "" });
    SecureStore.setItemAsync("password", "");
    Settings.setProfile(
      JSON.stringify({
        name: "",
        id: "",
        email: "",
      })
    );
  };
  const handleChangePassword = (values, actions) => {
    APIService.changePassword(values.password, values.newPassword, (success, json) => {
      if (success && json.result) {
        handleClose();
        logout();
      } else {
        actions.setErrors({ password: json.error });
        actions.setSubmitting(false);
      }
    });
  };

  return (
    <CustomModal visible={visible} handleClose={handleClose} titleModal={`Change Password`}>
      <Formik
        initialValues={{
          password: "",
          newPassword: "",
          confirmNewPassword: "",
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().max(20).required("Password is required"),
          newPassword: Yup.string().max(20).required("Password is required"),
          confirmNewPassword: Yup.string().max(20).required("Please confirm password"),
        })}
        onSubmit={(values, actions) => {
          if (values.newPassword !== values.confirmNewPassword) {
            actions.setErrors({ confirmNewPassword: "Confirm password does not match" });
            actions.setSubmitting(false);
            return;
          }

          handleChangePassword(values, actions);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldTouched,
          isSubmitting,
          values,
          errors,
          touched,
          dirty,
          isValid,
          setFieldValue,
        }) => (
          <View>
            <View>
              <InputSC
                secureTextEntry
                label="Password"
                name="password"
                onBlur={() => setFieldTouched("password")}
                onChange={(value) => {
                  setFieldValue("password", value);
                }}
                value={values?.password}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                style={{ marginBottom: 12 }}
              />
              <InputSC
                secureTextEntry
                label="New Password"
                name="newPassword"
                onBlur={() => setFieldTouched("newPassword")}
                onChange={(value) => {
                  setFieldValue("newPassword", value);
                }}
                value={values?.newPassword}
                error={Boolean(touched.newPassword && errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
                style={{ marginBottom: 12 }}
              />
              <InputSC
                secureTextEntry
                label="Confirm New Password"
                name="confirmNewPassword"
                onBlur={() => setFieldTouched("confirmNewPassword")}
                onChange={(value) => {
                  setFieldValue("confirmNewPassword", value);
                }}
                value={values?.confirmNewPassword}
                error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
                helperText={touched.confirmNewPassword && errors.confirmNewPassword}
                style={{ marginBottom: 12 }}
              />
            </View>
            <View display="flex" justifyContent="flex-end" p={2}>
              <CustomButton
                btn_text={"Submit"}
                style={{
                  width: "100%",
                  borderRadius: 5,
                }}
                mode="contained"
                on_press={() => handleSubmit()}
                disabled={!isValid || !dirty}
              />
            </View>
          </View>
        )}
      </Formik>
    </CustomModal>
  );
}

export default ChangePassModal;
