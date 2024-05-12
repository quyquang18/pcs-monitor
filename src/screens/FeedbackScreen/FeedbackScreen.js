import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Colors } from '~/constants';
import AppHeader from '~/components/AppHeader';
import DefaultLayout from '../DefaultLayout';
import CustomButton from '~/components/CustomButton';

function FeedbackScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader
        back
        title="Feedbacks"
        backgroundColor={Colors.primary}
        titleAlight={'center'}
        navigation={navigation}
      />
      <DefaultLayout>
        <Formik
          initialValues={{
            name: '',
            phonenumber: '',
            email: '',
            message: ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(100).required('Name is required'),
            email: Yup.string().required('Email is required'),
            phonenumber: Yup.string().required('Phone number is required'),
            message: Yup.string().required('Message is required').min(100)
          })}
          onSubmit={(values, actions) => {}}
        >
          {({ errors, handleSubmit, setFieldValue }) => (
            <View>
              <View style={{ marginVertical: 12 }}>
                <TextInput
                  label="Name"
                  onChangeText={(text) => setFieldValue('name', text)}
                />
                <Text>{errors.name}</Text>
              </View>
              <View style={{ marginVertical: 12 }}>
                <TextInput
                  label="Phone number"
                  onChangeText={(text) => setFieldValue('phonenuber', text)}
                />
              </View>
              <View style={{ marginVertical: 12 }}>
                <TextInput
                  label="Email"
                  onChangeText={(text) => setFieldValue('email', text)}
                />
              </View>
              <View>
                <TextInput
                  label="Message"
                  multiline={true}
                  numberOfLines={10}
                  onChangeText={(text) => setFieldValue('message', text)}
                />
              </View>
              <View>
                <CustomButton
                  btn_text={'Send'}
                  style={{
                    width: '100%',
                    marginTop: 22,
                    borderRadius: 5
                  }}
                  on_press={() => handleSubmit()}
                ></CustomButton>
              </View>
            </View>
          )}
        </Formik>
      </DefaultLayout>
    </SafeAreaView>
  );
}

export default FeedbackScreen;
