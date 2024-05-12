import React from 'react';
import { Card } from 'react-native-paper';

import CustomButton from '~/components/CustomButton';

function CompanyProfile({ data, onChange }) {
  return (
    <Card
      mode="contained"
      style={{
        marginHorizontal: 12,
        marginTop: 8,
        marginBottom: 18
      }}
    >
      <Card.Title
        titleStyle={{
          alignSelf: 'center',
          marginBottom: 12
        }}
        subtitleStyle={{
          alignSelf: 'center'
        }}
        titleVariant="titleLarge"
        title={data.name || 'Name: ---'}
        subtitle={data.email || 'Email: ---'}
      />
      <Card.Actions style={{ paddingBottom: 0, marginBottom: 0 }}>
        <CustomButton
          btn_text={'Change name'}
          style={{ width: '100%', borderRadius: 5, marginTop: 12 }}
          on_press={onChange}
        />
      </Card.Actions>
    </Card>
  );
}

export default CompanyProfile;
