import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import APIService from '~/utils/APIService';
import InputSC from "~/components/InputSC";
import CustomModal from '~/components/CustomModal';
import SelectDropdown from '~/components/SelectDropdown';

const AssignOwner = ({ visible, device, handleClose, assignSuccess }) => {
  const [companies, setCompanies] = useState([]);
  const [user, setUser] = useState('');
  const [listCompanyFull, setListCompanyFull] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const onSave = () => {
    setLoadingBtn(true);
    const check = listCompanyFull.find((item) => item.name === user);
    APIService.assignOwner(device.id, check.id, (success, json) => {
      if (success && json.result) {
        setTimeout(() => {
          setLoadingBtn(false);
          assignSuccess();
        }, 200);
      }
    });
  };
  const fetchCompanies = () => {
    APIService.getUsers((success, json) => {
      if (success && json) {
        json.result.forEach((e) => {
          e.key = e.id;
        });
        let dataName = json?.result?.map((item) => {
          return item.name;
        });
        setCompanies(dataName);
        setListCompanyFull(json.result);
      }
    });
  };
  const emailUser = listCompanyFull.find((item) => item.name === user)?.email;
  useEffect(() => {
    fetchCompanies();
  }, []);
  return (
    <CustomModal
      visible={visible}
      handleClose={handleClose}
      titleModal="Assign Owner"
    >
      <View style={{ flex: 1, paddingHorizontal: 12 }}>
        <SelectDropdown
          listData={companies}
          value={user || '....'}
          search
          onChange={(item) => {
            if (item) {
              setUser(item);
            }
          }}
          inputSearchStyle={{ backgroundColor: '#fff' }}
        />
        <InputSC
          styleContainer={{ marginBottom: 6, marginTop: 12 }}
          styleInput={{ backgroundColor: '#fff', color: '#000' }}
          mode={'simple'}
          label="Device Name"
          name="deviceName"
          disabled={true}
          value={emailUser}
        />
        <View style={{ marginTop: 22 }}>
          <Button mode="contained" loading={loadingBtn} onPress={onSave}>
            Submit
          </Button>
        </View>
      </View>
    </CustomModal>
  );
};

export default AssignOwner;
