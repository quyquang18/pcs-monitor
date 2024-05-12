import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Dimensions, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import SelectDropdown from '~/components/SelectDropdown';
import APIService from '~/utils/APIService';
import { OpenSansText } from '~/components/StyledText';
import InputSC from "~/components/InputSC";
import CustomColorPicker from "~/components/CustomColorPicker";
import CustomButton from "~/components/CustomButton";
import { showError, showSuccess } from "~/utils/toastMessage";

const widthScreen = Dimensions.get("window").width;

function GroupForm({ group, devices, onFetch }) {
  const [adding, setAdding] = useState(false);
  const [pickingColor, setPickingColor] = useState(false);
  const [groupId, setGroupId] = useState(group?.id);

  const [models, setModels] = useState([]);
  const [productModels, setProductModels] = useState([]);
  const fetchSuggestions = () => {
    APIService.getStatsFilters((success, json) => {
      if (success && json.result) {
        const { result } = json;
        setModels(result.models);
        setProductModels(result.productModels);
      }
    });
  };

  useEffect(() => {
    setModels([]);
    setProductModels([]);
    fetchSuggestions();
  }, [devices]);

  const onSave = (values, actions) => {
    if (groupId) {
      APIService.editGroup(
        groupId,
        values.name,
        values.color,
        values.model,
        values.productModel,
        (success, json) => {
          if (success && json.result) {
            setAdding(false);
            showSuccess("Updated successfully !");
            actions.resetForm();
            onFetch();
          } else {
            actions.setErrors({ color: "Try again later!" });
            actions.setSubmitting(false);
          }
        }
      );
    } else {
      APIService.addGroup(values.name, values.color, values.model, values.productModel, (success, json) => {
        if (success && json.result) {
          setGroupId(json.result.id);
          setAdding(false);
          showSuccess("Created successfully!");
          actions.resetForm();
          onFetch();
        } else {
          showError("Try again later!");
          actions.setSubmitting(false);
        }
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ccc",
        padding: 12,
        width: widthScreen - 100,
        alignSelf: "flex-end",
      }}
    >
      <OpenSansText style={{ fontSize: 18, fontWeight: "700", color: "#000" }}>
        {groupId && !adding ? "Edit Group" : "Add Group"}
      </OpenSansText>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Formik
            initialValues={{
              name: group?.name || "",
              color: group?.color || "#3DA6A6",
              model: group?.model || "",
              productModel: group?.productModel || "",
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().max(100).required("Name is required"),
              color: Yup.string(),
            })}
            onSubmit={(values, actions) => {
              onSave(values, actions);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              touched,
              setFieldTouched,
              values,
              isValid,
              dirty,
            }) => {
              return (
                <View style={{ flex: 1, justifyContent: "space-between" }}>
                  <InputSC
                    styleContainer={{
                      marginBottom: 26,
                      marginTop: 12,
                    }}
                    textColor="#000"
                    styleInput={{ backgroundColor: "#ccc" }}
                    label="Name"
                    name="name"
                    type={"error"}
                    onChange={(value) => {
                      setFieldValue("name", value);
                    }}
                    value={values.name}
                    error={touched.name && errors.name}
                    onBlur={() => setFieldTouched("name")}
                    helperText={errors.name}
                  />

                  <View style={{ marginBottom: 26 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ color: "#000", fontSize: 16 }}>Select color group:</Text>
                      <TouchableOpacity
                        style={{ marginHorizontal: 22 }}
                        onPress={() => setPickingColor(true)}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            backgroundColor: values.color,
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 9,
                          }}
                        ></View>
                      </TouchableOpacity>
                    </View>
                    {pickingColor && (
                      <CustomColorPicker
                        value={values.color}
                        onChange={(color) => setFieldValue("color", color.valueHEX)}
                        onOk={() => setPickingColor(false)}
                      />
                    )}
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <SelectDropdown
                      label="Model"
                      listData={models}
                      leftIconName={"alpha-m-box-outline"}
                      value={values.model}
                      search
                      onChange={(item) => {
                        if (item) {
                          setFieldValue("model", item);
                        }
                      }}
                    />
                    <SelectDropdown
                      label="Product Model"
                      listData={productModels}
                      leftIconName={"alpha-m-box-outline"}
                      value={values.productModel}
                      search
                      onChange={(item) => {
                        if (item) {
                          setFieldValue("productModel", item);
                        }
                      }}
                    />
                  </View>
                  <View>
                    <CustomButton btn_text={"Save"} on_press={handleSubmit}></CustomButton>
                  </View>
                </View>
              );
            }}
          </Formik>
        </View>
      </View>
    </View>
  );
}

export default GroupForm;
