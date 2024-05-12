import React, { useEffect, useState, useContext } from 'react';
import { View } from 'react-native';

import DefaultLayout from '~/screens/DefaultLayout';
import AppHeader from '~/components/AppHeader';
import APIService from '~/utils/APIService';
import { Colors } from '~/constants';
import CompanyProfile from './CompanyProfile';
import UserDevices from './UserDevices';
import RenameForm from './RenameForm';

import { AppContext } from '~/Context/AppContext';

function ProFileScreen({ navigation, ...props }) {
  const { params } = props?.route;
  const userId = params?.userId;
  const [profile, setProfile] = useState({});
  const [visibleChangeName, setVisibleChangeName] = useState(false);
  const { setIsLoading } = useContext(AppContext);
  const fetchData = () => {
    setIsLoading(true);
    APIService.getProfile(userId, (success, json) => {
      if (json?.result) {
        const { devices } = json.result;
        if (devices) {
          devices.forEach((e) => {
            e.company = json.result;
          });
        }
        setProfile(json.result);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  const onNameChanged = () => {
    setVisibleChangeName(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [props.route.key]);
  const viewDevice = (device) => {
    navigation.navigate('DeviceInfo', { deviceId: device?.id });
  };
  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        back
        title="Company Profile"
        backgroundColor={Colors.primary}
        titleAlight={'center'}
        navigation={navigation}
      />
      <DefaultLayout>
        <View>
          <CompanyProfile
            data={profile}
            onChange={() => setVisibleChangeName(true)}
          />
          <>
            {profile?.devices && profile?.devices.length > 0 && (
              <UserDevices
                viewDevice={viewDevice}
                data={profile?.devices || []}
              />
            )}
          </>
          <RenameForm
            user={profile}
            visible={visibleChangeName}
            handleClose={() => setVisibleChangeName(false)}
            onFetch={onNameChanged}
          />
        </View>
      </DefaultLayout>
    </View>
  );
}

export default ProFileScreen;
