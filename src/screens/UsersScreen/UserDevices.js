import React, { useState } from 'react';
import { View, Text } from 'react-native';
import APIService from '~/utils/APIService';
// import ConfirmAlert from '~/components/ConfirmAlert';
import Results from '~/screens/DeviceScreen/Results';
import Toolbar from "~/components/Toolbar";
import { showError, showSuccess } from '~/utils/toastMessage';

const UserDevices = ({ viewDevice, ...props }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState('');

  const deleteItems = () =>
    APIService.deleteDevices(selectedItems, (success, json) => {
      setConfirmDelete(false);
      if (success && json.result) {
        setSelectedItems([]);
        showSuccess('Deleted user successfully');
      } else {
        showError(` ${json.error}`);
      }
    });

  return (
    <View>
      <Toolbar
        onSearch={(text) => setSearchText(text)}
        onDelete={
          selectedItems && selectedItems.length > 0
            ? () => setConfirmDelete(true)
            : null
        }
      />
      <Results
        data={props.data}
        searchText={searchText}
        selectedIds={selectedItems}
        onSelected={(ids) => setSelectedItems(ids)}
        onView={viewDevice}
      />
    </View>
  );
};

export default UserDevices;
