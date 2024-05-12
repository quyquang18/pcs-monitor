import React, { useEffect, useState } from 'react';
import Timeline from 'react-native-timeline-flatlist';
import moment from 'moment';

import { OpenSansText } from '~/components/StyledText';
import { Colors } from '~/constants';
import CustomModal from './CustomModal';

function TimeLineStatus({ visible, runStopStats, handleClose }) {
  const [dataTimeLine, setDataTimeLine] = useState([]);

  const buildData = () => {
    const dataBuild = runStopStats?.map((item) => {
      let objData = {};
      objData.time = moment(item.startTime).format('HH:mm:ss');
      objData.title = item.status;
      objData.description = `The device ${item.status} between ${moment(
        item.startTime
      ).format('HH:mm:ss')} and ${moment(item.endTime).format('HH:mm:ss')}`;
      if (item.status === 'OFFLINE') {
        objData.color = Colors.offline;
      }
      if (item.status === 'RUN') {
        objData.color = Colors.run;
      }
      if (item.status === 'WAITTING') {
        objData.color = Colors.waiting;
      }
      if (item.status === 'ONLINE') {
        objData.color = Colors.stop;
        objData.title = 'STOP';
      }
      return objData;
    });

    return dataBuild;
  };

  useEffect(() => {
    setDataTimeLine(buildData());
  }, [runStopStats]);

  return (
    <CustomModal
      visible={visible}
      handleClose={handleClose}
      titleModal={`TimeLine Day ${moment(new Date()).format('DD/MM/YYYY')}`}
    >
      <Timeline
        data={dataTimeLine}
        circleSize={20}
        innerCircle={'dot'}
        circleColor="rgb(45,156,219)"
        lineColor="rgb(45,156,219)"
        timeContainerStyle={{
          minWidth: 32
        }}
        renderTime={(rowData, sectionID, rowID) => {
          return (
            <OpenSansText
              style={{
                backgroundColor: rowData.color,
                height: 20,
                paddingHorizontal: 12,
                borderRadius: 5
              }}
            >
              {rowData.time}
            </OpenSansText>
          );
        }}
        timeStyle={{
          textAlign: 'center',
          backgroundColor: '#ff9797',
          color: 'white',
          padding: 5,
          borderRadius: 13
        }}
        detailContainerStyle={{
          borderBottomColor: '#567',
          borderBottomWidth: 1,
          minHeight: 62
        }}
        titleStyle={{
          marginTop: 0,
          marginVertical: 0,
          top: -9,
          fontSize: 14,
          fontWeight: '700'
        }}
        descriptionStyle={{
          marginTop: 0,
          color: 'gray',
          fontSize: 12,
          minHeight: 42
        }}
        isUsingFlatlist={true}
      />
    </CustomModal>
  );
}

export default TimeLineStatus;
