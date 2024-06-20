import { Document, Page, Text, Font, View, pdf, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import React from 'react';
import { SponsorActivityView } from '@type/common';

Font.register({
  family: 'NotoSansJP',
  src: 'https://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Regular.woff2',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'NotoSansJP',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
  },
  text_S: {
    fontSize: 10,
  },
  text_M: {
    fontSize: 15,
  },
  text_L: {
    fontSize: 20,
  },
  details: {
    marginTop: 20,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemsTable: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  commonTableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    textAlign: 'center',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableColHeader_S: {
    width: '10%',
  },
  tableColHeader_M: {
    width: '20%',
  },
  tableColHeader_L: {
    width: '40%',
  },
  tableCol_S: {
    width: '10%',
  },
  tableCol_M: {
    width: '20%',
  },
  tableCol_L: {
    width: '40%',
  },
  tableCol_Sum: {
    borderRight: 0,
  },
  textVertical: {
    flexDirection: 'column',
  },
  textArea: {
    width: '85%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    minHeight: 50,
    justifyContent: 'center',
    padding: 7,
  },
  textAreaHeader: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sumField: {
    marginLeft: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '250',
    fontSize: 20,
    borderStyle: 'solid',
    borderWidth: 2,
    borderTop: 0,
    borderRight: 0,
    borderLeft: 0,
  },
  detailField: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 7,
  },
  underLine: {
    paddingBottom: 3,
    borderStyle: 'solid',
    borderWidth: 2,
    borderTop: 0,
    borderRight: 0,
    borderLeft: 0,
  },
  marginButtom: {
    marginBottom: 8,
  },
  paddingTop: {
    paddingTop: 50,
  },
});

interface MyDocumentProps {
  sponsorActivitiesViewItem: SponsorActivityView;
  totalPrice: number;
  date: string;
  issuedDate: string;
  remarks: string;
  formatDate: (date: string) => string;
}

const MyDocument = (props: MyDocumentProps) => (
  <Document>
    <Page style={styles.page} size='A4'>
      <View>
        <Text style={styles.header}>御 請 求 書</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <View style={styles.textVertical}>
            <Text style={[styles.text_M, styles.underLine]}>
              {props.sponsorActivitiesViewItem.sponsor.name}
              {'  '}
              <Text style={styles.text_M}> 御中</Text>
            </Text>
            <Text style={[styles.text_S, styles.marginButtom]}>
              ご担当 : {props.sponsorActivitiesViewItem.sponsor.representative} 様
            </Text>
            <Text style={[styles.text_S, styles.underLine]}>
              件名 : <Text style={styles.text_M}>技大祭企業協賛</Text>
            </Text>
            <View>
              <Text style={[styles.text_S, styles.paddingTop]}>
                下記の通り、ご請求申し上げます。
              </Text>
              <View style={styles.sumField}>
                <Text style={styles.text_S}>
                  合計金額 <Text style={styles.text_L}>¥ {props.totalPrice}</Text>
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.marginButtom}>請求日 : {props.issuedDate}</Text>
            <View>
              <View style={styles.marginButtom}>
                <Text>技大祭実行委員会</Text>
                <Text>〒940-2137</Text>
                <Text>新潟県長岡市上富岡町1603-1</Text>
                <Text>長岡技術科学大学 大学集会施設</Text>
              </View>
              <Text style={styles.text_S}>E-Mail : nutfes_shogai_kyosan@googlegroups.com</Text>
              <Text>担当 : {props.sponsorActivitiesViewItem.user.name}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.itemsTable, styles.marginButtom]}>
        <View style={styles.tableRow}>
          <Text style={[styles.commonTableCol, styles.tableColHeader_S]}>No.</Text>
          <Text style={[styles.commonTableCol, styles.tableColHeader_L]}>概要</Text>
          <Text style={[styles.commonTableCol, styles.tableColHeader_S]}>数量</Text>
          <Text style={[styles.commonTableCol, styles.tableColHeader_M]}>単価</Text>
          <Text style={[styles.commonTableCol, styles.tableColHeader_M]}>金額</Text>
        </View>
        {props.sponsorActivitiesViewItem.styleDetail.map((styleDetail, index) => (
          <View style={styles.tableRow} key={styleDetail.sponsorStyle.id}>
            <Text style={[styles.commonTableCol, styles.tableCol_S]}>{index + 1}</Text>
            <Text style={[styles.commonTableCol, styles.tableCol_L]}>
              {styleDetail.sponsorStyle.style} ({styleDetail.sponsorStyle.feature})
            </Text>
            <Text style={[styles.commonTableCol, styles.tableCol_S]}>1</Text>
            <Text style={[styles.commonTableCol, styles.tableCol_M]}>
              ¥ {styleDetail.sponsorStyle.price}
            </Text>
            <Text style={[styles.commonTableCol, styles.tableCol_M]}>
              ¥ {styleDetail.sponsorStyle.price}
            </Text>
          </View>
        ))}
        <View style={styles.tableRow}>
          <Text style={[styles.commonTableCol, styles.tableColHeader_S]} />
          <Text style={[styles.commonTableCol, styles.tableColHeader_L]} />
          <Text style={[styles.commonTableCol, styles.tableColHeader_S]}>合計</Text>
          <Text style={[styles.commonTableCol, styles.tableColHeader_M, styles.tableCol_Sum]} />
          <Text style={[styles.commonTableCol, styles.tableColHeader_M]}>¥ {props.totalPrice}</Text>
        </View>
      </View>
      <View style={[styles.detailField, styles.marginButtom]}>
        <Text style={styles.text_S}>
          お手数でございますが、{props.date}までに下記口座へ振込くださいますようお願い申し上げます。
        </Text>
        <Text style={styles.text_S}>&lt;振込先&gt;</Text>
        <Text style={styles.text_S}>銀 行 名 : 大光銀行（金融機関コード : 0532）</Text>
        <Text style={styles.text_S}>支 店 名 : 希望ヶ丘支店（支店コード : 042）</Text>
        <Text style={styles.text_S}>預金種別 : 普通預金</Text>
        <Text style={styles.text_S}>口座番号 : 2002151</Text>
        <Text style={styles.text_S}>口座名義 : 技大祭実行委員会(ギダイサイジツコウイインカイ)</Text>
      </View>
      <View>
        <View style={styles.itemsTable}>
          <View style={[styles.tableRow]}>
            <View style={styles.textAreaHeader}>
              <Text>備考</Text>
            </View>
            <View style={styles.textArea}>
              <Text>振込手数料は、御社負担にてお願いいたします。</Text>
              {(props.remarks.match(/.{1,40}/g) || []).map((chunk, index) => (
                <Text key={index}>{chunk}</Text>
              ))}
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
  issuedDate: string,
  remarks: string,
) => {
  const asPdf = pdf(
    <MyDocument
      sponsorActivitiesViewItem={sponsorActivitiesViewItem}
      totalPrice={CalculateTotalPrice(sponsorActivitiesViewItem)}
      date={date}
      issuedDate={issuedDate}
      remarks={remarks}
      formatDate={formatDate}
    />,
  );
  const blob = await asPdf.toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${formatDate(sponsorActivitiesViewItem.sponsorActivity.createdAt || '')}-${
    sponsorActivitiesViewItem.sponsor.name
  }-請求書.pdf`;
  link.click();
};

interface PreviewProps {
  sponsorActivitiesViewItem: SponsorActivityView;
  date: string;
  issuedDate: string;
  remarks: string;
}

export const PreviewPDF: React.FC<PreviewProps> = ({
  sponsorActivitiesViewItem,
  date,
  issuedDate,
  remarks,
}) => (
  <PDFViewer style={{ width: '100vw', height: '100vh' }} showToolbar={false}>
    <MyDocument
      sponsorActivitiesViewItem={sponsorActivitiesViewItem}
      date={date}
      issuedDate={issuedDate}
      remarks={remarks}
      totalPrice={CalculateTotalPrice(sponsorActivitiesViewItem)}
      formatDate={formatDate}
    />
  </PDFViewer>
);
