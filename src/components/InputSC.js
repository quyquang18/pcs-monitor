import React, { useRef } from "react";
import { View, Text, TextInput } from "react-native";
import { TextInput as TextInputPaper } from "react-native-paper";

function InputSC({
  error,
  label,
  name,
  type,
  onBlur,
  onChange,
  value,
  multiline,
  helperText,
  mode,
  disabled,
  styleInput,
  style,
  textColor,
  secureTextEntry,
  ...props
}) {
  return (
    <View style={[props.styleContainer, style]}>
      {mode !== "simple" ? (
        <TextInputPaper
          type={type}
          secureTextEntry={secureTextEntry}
          mode="outlined"
          name={name}
          label={label}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          multiline={multiline}
          textColor={textColor || "#000"}
          error={!!error}
          activeOutlineColor={"#00c853"}
          style={[{ backgroundColor: "#ccc" }, styleInput]}
          underlineColor="#000"
        />
      ) : (
        <View>
          <Text style={{ color: "#333333", marginLeft: 4, marginBottom: 2 }}>{label}</Text>
          <TextInput
            editable={!disabled}
            selectTextOnFocus={!disabled}
            name={name}
            style={[
              {
                backgroundColor: "#bfbfbf",
                borderRadius: 4,
                color: "#000",
                borderWidth: 1,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderColor: "#292727",
                borderStyle: "dashed",
              },
              styleInput,
            ]}
            onChangeText={onChange}
            value={value}
            placeholder={label}
            onBlur={onBlur}
          />
        </View>
      )}

      {!!error && <Text style={{ fontSize: 14, color: "#cb362d" }}>{helperText}</Text>}
    </View>
  );
}

export default InputSC;
