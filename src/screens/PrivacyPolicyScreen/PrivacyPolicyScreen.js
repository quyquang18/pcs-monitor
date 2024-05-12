import React from 'react';
import { SafeAreaView, View, Text, NativeModules } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import AppHeader from '~/components/AppHeader';
import { Colors } from '~/constants';
import { OpenSansText } from '~/components/StyledText';
import DefaultLayout from '../DefaultLayout';


function PrivacyPolicyScreen({ navigation }) {
  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#fff', marginTop: STATUSBAR_HEIGHT }}
    >
      <AppHeader
        back
        title="Privacy Policy"
        backgroundColor={Colors.primary}
        titleAlight={'center'}
        navigation={navigation}
      />
      <DefaultLayout>
        <View
          style={{
            paddingHorizontal: 8,
            paddingTop: 8,
            backgroundColor: '#fff'
          }}
        >
          <Text style={{ fontSize: 15, lineHeight: 22, textAlign: 'justify' }}>
            Data protection is important to us, and we take it very seriously.
            We rely on reliable cooperation with you and do our best to your
            satisfaction - this of course also applies to the processing of your
            personal data. With these data protection terms, we would like to
            inform you about how your personal data is handled. Therefore please
            consider the following information. These data protection terms are
            a supplement to the Terms of Use During the development of our
            application and implementation of new legal requirements, new
            technology or to improve our services, changes to this privacy
            policy may occur. For that reason we recommend that you refer back
            to this privacy policy from time to time.
          </Text>
          <View>
            <OpenSansText style={{ fontSize: 18, fontWeight: '600' }}>
              1. Person responsible for control
            </OpenSansText>
            <Text style={{ textAlign: 'justify', fontSize: 16 }}>
              The Operator of this application and the Controller responsible
              for data protection are:
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Entypo name={'dot-single'} color={'#000'} size={28}></Entypo>
              <Text>LUXAS CO., LTD</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Entypo name={'dot-single'} color={'#000'} size={28}></Entypo>
              <Text>
                38/5 Van Kiep Street Ward 3, Binh Thanh District, Ho Chí Minh
                City, Viet Nam.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Entypo name={'dot-single'} color={'#000'} size={28}></Entypo>
              <Text>Hotline: 0937511617</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Entypo name={'dot-single'} color={'#000'} size={28}></Entypo>
              <Text>Email: sale-luxas@.com.vn</Text>
            </View>
          </View>
          <View>
            <OpenSansText style={{ fontSize: 18, fontWeight: '600' }}>
              2. General information about personal data processing
            </OpenSansText>
            <Text style={{ textAlign: 'justify', fontSize: 16 }}>
              This Privacy Policy applies to data about you, including personal
              data collected by Luxas. Personal data is data or a combination of
              personal data through which you are identified. Under no
              circumstances will we forward your personal data to third parties
              other than Luxas for advertising or marketing purposes without
              your consent.{'\n'}
              In our company compliance with legal regulations and this policy
              is monitored by our data protection officers. Our employees are
              trained to handle personal data and undertake in writing to comply
              with data protection regulations.{'\n'}
              We ask you to pay attention to the fact that the transmission of
              data over the Internet (for example, when communicating by e-mail)
              may involve gaps in security. We strive to protect your data from
              unauthorized access by third parties with precautions, such as
              “anonymization”, data environment restrictions, compliance with
              data erasure deadlines and consider the most advanced technology
              available today. Despite these safeguards, we cannot completely
              rule out illegal third-party interference.
            </Text>
          </View>
          <View>
            <OpenSansText style={{ fontSize: 18, fontWeight: '600' }}>
              3. Data collection and processing in case of access from the
              Internet
            </OpenSansText>
            <Text style={{ textAlign: 'justify', fontSize: 16 }}>
              When you access our application our server will temporarily store
              each access permission to a log file. The lawful processing of
              this data is done for the purpose of authorizing the use of the
              application (establishing a connection), for system security, for
              technical administration of the network infrastructure, and for
              optimizing the provision of services. Internet. By agreeing to
              this privacy policy, you consent to our collection of this data.
              These personal data are not processed outside of the cases
              outlined above, unless you expressly consent to further
              processing.
            </Text>
          </View>
          <View style={{ marginTop: 6 }}>
            <OpenSansText style={{ fontSize: 18, fontWeight: '600' }}>
              4. Purpose of data use
            </OpenSansText>
            <Text style={{ textAlign: 'justify', fontSize: 16 }}>
              According to the data-saving and avoidance principle of the
              General Data Protection Regulation, we only collect personal data
              on our application when necessary for the intended purpose of the
              application. you, we are obligated to do so by law or by binding
              agreement, if we have a legitimate interest and/or if you
              voluntarily consent.{'\n'}
              We process and save the provided data only as necessary for the
              intended purpose and delete them upon fulfillment of the purpose
              or after the expiration of the respective retention period. The
              collection, processing or use is not made for any other purpose.
            </Text>
          </View>
          <View style={{ marginTop: 6 }}>
            <OpenSansText style={{ fontSize: 18, fontWeight: '600' }}>
              5. Data transmission over the Internet The
            </OpenSansText>
            <Text style={{ textAlign: 'justify', fontSize: 16 }}>
              Internet is a global open interface. Due to the operational nature
              of the internet and the systemic risks involved, any data
              transmission is done at your own risk. To ensure safety, we
              exclusively deploy service to you via encrypted communication
              channel.
            </Text>
          </View>
          <View style={{ marginTop: 6 }}>
            <OpenSansText style={{ fontSize: 18, fontWeight: '600' }}>
              6. Security measures
            </OpenSansText>
            <Text style={{ textAlign: 'justify', fontSize: 16 }}>
              We have taken extensive precautions to secure your data. The data
              you have entered is transmitted in encrypted form (SSL - Secure
              Sockets Layer) to us over the public data network to the Luxas
              server, where they are stored and processed.{'\n'}
              This application uses SSL encryption for security reasons and to
              protect the transmission of confidential content, such as requests
              that you send to us as an application user.
            </Text>
          </View>
          <View style={{ marginTop: 6 }}>
            <OpenSansText style={{ fontSize: 18, fontWeight: '600' }}>
              7. Forwarding of personal data to third parties
            </OpenSansText>
            <Text style={{ textAlign: 'justify', fontSize: 16 }}>
              Your personal data will not be forwarded to third parties (outside
              of Luxas), unless you have agreed with us in advance to that. This
              provision does not apply to the forwarding of service partners,
              such as postal service providers or freight forwarders, if
              transmission is necessary for order processing. or delivery.
              Logistics service providers receive the data required for the
              delivery of goods for their own responsible use. We restrict this
              to sending data necessary for delivery.
            </Text>
          </View>
          <View style={{ paddingBottom: 18 }}>
            <OpenSansText style={{ fontSize: 18, fontWeight: '600' }}>
              8. Contact about data protection
            </OpenSansText>
            <Text style={{ textAlign: 'justify', fontSize: 16 }}>
              If you have questions regarding the processing of your personal
              data, you can directly contact our data protection officer, they
              are available. Respond to requests, applications or complaints for
              information:
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Entypo name={'dot-single'} color={'#000'} size={28}></Entypo>
              <Text>LUXAS CO., LTD</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Entypo name={'dot-single'} color={'#000'} size={28}></Entypo>
              <Text>
                38/5 Van Kiep Street Ward 3, Binh Thanh District, Ho Chí Minh
                City, Viet Nam.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Entypo name={'dot-single'} color={'#000'} size={28}></Entypo>
              <Text>Hotline: 0937511617</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Entypo name={'dot-single'} color={'#000'} size={28}></Entypo>
              <Text>Email: sale-luxas@.com.vn</Text>
            </View>
          </View>
        </View>
      </DefaultLayout>
    </SafeAreaView>
  );
}

export default PrivacyPolicyScreen;
