import { Document, Page, Text, Font, View, pdf, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import React from 'react';
import { SponsorActivityView } from '@type/common';

Font.register({
  family: 'NotoSansJP',
  src: 'https://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Regular.woff2',
});

const styles = StyleSheet.create({
  page: {
    width: '519.13pt',
    height: '241.89pt',
    paddingTop: 10,
    paddingHorizontal: 20,
    fontSize: 10,
    fontFamily: 'NotoSansJP',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
  },
  headerRight: {
    textAlign: 'right',
    fontSize: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    margin: 10,
    flexDirection: 'row',
  },
  section: {
    marginBottom: 10,
  },
  text_S: {
    fontSize: 10,
    flexWrap: 'wrap',
  },
  text_M: {
    fontSize: 15,
    flexWrap: 'wrap',
  },
  text_L: {
    fontSize: 20,
    flexWrap: 'wrap',
  },
  companyName: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  details: {
    marginVertical: 5,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textVertical: {
    flexDirection: 'column',
  },
  sumField: {
    marginHorizontal: 30,
    paddingHorizontal: 30,
    flexDirection: 'row',
    width: '85vw',
    fontSize: 20,
    borderStyle: 'solid',
    borderWidth: 0.7,
    borderTop: 0,
    borderRight: 0,
    borderLeft: 0,
    backgroundColor: '#dde6f1',
  },
  name: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: '250',
    fontSize: 20,
    borderStyle: 'solid',
    borderWidth: 0.7,
    borderTop: 0,
    borderRight: 0,
    borderLeft: 0,
  },
  nameField: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    width: '100%',
    fontSize: 20,
  },
  detailField: {
    flexDirection: 'row',
    gap: 20,
    width: '70%',
  },
  detailName: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    width: '250',
    fontSize: 20,
    borderStyle: 'solid',
    borderWidth: 0.7,
    borderTop: 0,
    borderRight: 0,
    borderLeft: 0,
  },
  underLine: {
    paddingBottom: 0.5,
    borderStyle: 'solid',
    borderWidth: 2,
    borderTop: 0,
    borderRight: 0,
    borderLeft: 0,
  },
  paddingTop: {
    paddingVertical: 5,
  },
});

interface MyDocumentProps {
  sponsorActivitiesViewItem: SponsorActivityView;
  totalPrice: number;
  date: string;
  paymentDay: string;
  formatDate: (date: string) => string;
}

const MyDocument = (props: MyDocumentProps) => (
  <Document>
    <Page style={styles.page} size={{ width: 519.13, height: 241.89 }}>
      <Image
        fixed
        style={{ width: '120px', position: 'absolute', top: 45, right: 20 }}
        src={'43rd_Stamp.png'}
      />
      <View style={styles.pageHeader}>
        <Text style={styles.header}>
          領{'  '}収{'  '}書
        </Text>
        <View style={styles.headerRight}>
          <Text>No.{}</Text>
          <Text>発行日:{props.date}</Text>
        </View>
      </View>
      <View>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <View style={styles.textVertical}>
              <View style={styles.nameField}>
                <View style={styles.name}>
                  <Text style={styles.text_M}>{props.sponsorActivitiesViewItem.sponsor.name}</Text>
                </View>
                <Text style={styles.text_M}>御中</Text>
              </View>
              <View>
                <Text style={[styles.text_S, styles.paddingTop]}>下記、正に徴収いたしました。</Text>
                <View style={styles.sumField}>
                  <Text style={styles.text_S}>
                    金額{' '}
                    <Text style={styles.text_L}>
                      {'  '}¥ {props.totalPrice}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: '10' }}>
                <View style={{ flexDirection: 'column' }}>
                  <View style={styles.detailField}>
                    <Text style={styles.text_S}> 但 し </Text>
                    <View style={styles.detailName}>
                      <Text style={styles.text_S}>技大祭への広告協賛として</Text>
                    </View>
                  </View>
                  <View style={styles.detailField}>
                    <Text style={styles.text_S}>入金日</Text>
                    <View style={styles.detailName}>
                      <Text style={styles.text_S}>{props.paymentDay}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginRight: '35' }}>
                  <Text>長岡技術科学大学 技大祭実行委員会</Text>
                  <Text>〒940-2137</Text>
                  <Text>新潟県長岡市上富岡町1603-1</Text>
                  <Text>大学集会施設 1号館 技大祭実行委員会</Text>
                  <Text>E-Mail : nutfes_shogai_kyosan@googlegroups.com</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const CalculateTotalPrice = (sponsorActivitiesViewItem: SponsorActivityView): number => {
  const totalPrice = sponsorActivitiesViewItem.styleDetail.reduce((totalPriceAccumulator, item) => {
    return totalPriceAccumulator + item.sponsorStyle.price;
  }, 0);
  return totalPrice;
};

const formatDate = (datetime: string) => {
  const datetime2 = datetime.substring(0, datetime.length - 10);
  return datetime2;
};

export const createSponsorActivitiesPDF = async (
  sponsorActivitiesViewItem: SponsorActivityView,
  date: string,
  paymentDay: string,
) => {
  const asPdf = pdf(
    <MyDocument
      sponsorActivitiesViewItem={sponsorActivitiesViewItem}
      totalPrice={CalculateTotalPrice(sponsorActivitiesViewItem)}
      date={date}
      paymentDay={paymentDay}
      formatDate={formatDate}
    />,
  );
  const blob = await asPdf.toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${formatDate(sponsorActivitiesViewItem.sponsorActivity.createdAt || '')}-${
    sponsorActivitiesViewItem.sponsor.name
  }-領収書.pdf`;
  link.click();
};

interface PreviewProps {
  sponsorActivitiesViewItem: SponsorActivityView;
  date: string;
  paymentDay: string;
}

export const PreviewPDF: React.FC<PreviewProps> = ({
  sponsorActivitiesViewItem,
  date,
  paymentDay,
}) => (
  <PDFViewer style={{ width: '100%', height: '100%' }} showToolbar={false}>
    <MyDocument
      sponsorActivitiesViewItem={sponsorActivitiesViewItem}
      date={date}
      paymentDay={paymentDay}
      totalPrice={CalculateTotalPrice(sponsorActivitiesViewItem)}
      formatDate={formatDate}
    />
  </PDFViewer>
);
