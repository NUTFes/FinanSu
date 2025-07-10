import { Document, Page, Text, Font, View, pdf, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import React from 'react';
import { formatDateToJapanese, calculateYearInfo } from './dateConverter';
import { Invoice } from '@type/common';

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
    width: '50%',
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
  sponsorNameAndOnchuContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sponsorNameChunksContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  marginBottom: {
    marginBottom: 8,
  },
  paddingTop: {
    paddingTop: 50,
  },
  rightDetailsBlock: {
    width: '45%',
  },
});

interface MyDocumentProps {
  invoiceItem: Invoice;
  deadline: string;
  issuedDate: string;
}

const MyDocument = ({ invoiceItem, deadline, issuedDate }: MyDocumentProps) => {
  const sponsorName = invoiceItem.sponsorName || '';
  const MAX_CHARS_PER_LINE_HINT = 15;
  let sponsorNameLines: string[] = [];

  if (/[a-zA-Z]/.test(sponsorName)) {
    const words = sponsorName.split(' ');
    let currentLine = '';
    for (const word of words) {
      if (currentLine.length === 0) {
        currentLine = word;
      } else if ((currentLine + ' ' + word).length <= MAX_CHARS_PER_LINE_HINT) {
        currentLine += ' ' + word;
      } else {
        sponsorNameLines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine.length > 0) {
      sponsorNameLines.push(currentLine);
    }
    if (sponsorNameLines.length === 0 && sponsorName.trim().length > 0) {
      sponsorNameLines.push(sponsorName.trim());
    }
  } else {
    sponsorNameLines = sponsorName.match(new RegExp(`.{1,${MAX_CHARS_PER_LINE_HINT}}`, 'g')) || [];
  }

  if (sponsorNameLines.length === 0) {
    sponsorNameLines.push(' ');
  }

  return (
    <Document>
      <Page style={styles.page} size='A4'>
        <View>
          <Text style={styles.header}>請 求 書</Text>
        </View>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <View style={styles.textVertical}>
              <View style={[styles.underLine, styles.sponsorNameAndOnchuContainer]}>
                <View style={styles.sponsorNameChunksContainer}>
                  {sponsorNameLines.map((line, index) => (
                    <Text key={index} style={styles.text_M}>
                      {line}
                    </Text>
                  ))}
                </View>
                <Text style={[styles.text_M, { marginLeft: '5pt', flexShrink: 0 }]}>御中</Text>
              </View>
              <Text style={[styles.text_S, styles.marginBottom]}>
                ご担当 : {invoiceItem.managerName} 様
              </Text>
              <Text style={[styles.text_S, styles.underLine]}>
                件名 : <Text style={styles.text_M}>{invoiceItem.subject || '技大祭企業協賛'}</Text>
              </Text>
              <View>
                <Text style={[styles.text_S, styles.paddingTop]}>
                  下記の通り、ご請求申し上げます。
                </Text>
                <View style={styles.sumField}>
                  <Text style={styles.text_S}>
                    合計金額{' '}
                    <Text style={styles.text_L}>¥ {invoiceItem.totalPrice.toLocaleString()}</Text>
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.rightDetailsBlock}>
              <Text style={styles.marginBottom}>請求日 : {formatDateToJapanese(issuedDate)}</Text>
              <View>
                <View style={styles.marginBottom}>
                  <Text>技大祭実行委員会</Text>
                  <Text>〒940-2188</Text>
                  <Text>新潟県長岡市上富岡町1603-1</Text>
                  <Text>長岡技術科学大学内</Text>
                </View>
                <Text style={styles.text_S}>E-Mail : nutfes_shogai_kyosan@googlegroups.com</Text>
                <Text>担当 : {invoiceItem.fesStuffName}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.itemsTable, styles.marginBottom]}>
          <View style={styles.tableRow}>
            <Text style={[styles.commonTableCol, styles.tableColHeader_S]}>No.</Text>
            <Text style={[styles.commonTableCol, styles.tableColHeader_L]}>概要</Text>
            <Text style={[styles.commonTableCol, styles.tableColHeader_S]}>数量</Text>
            <Text style={[styles.commonTableCol, styles.tableColHeader_M]}>単価</Text>
            <Text style={[styles.commonTableCol, styles.tableColHeader_M]}>金額</Text>
          </View>
          {invoiceItem.invoiceSponsorStyle.map((sponsorStyle, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.commonTableCol, styles.tableCol_S]}>{index + 1}</Text>
              <Text style={[styles.commonTableCol, styles.tableCol_L]}>
                {sponsorStyle.styleName}
              </Text>
              <Text style={[styles.commonTableCol, styles.tableCol_S]}>
                {sponsorStyle.quantity}
              </Text>
              <Text style={[styles.commonTableCol, styles.tableCol_M]}>
                ¥ {sponsorStyle.unitPrice.toLocaleString()}
              </Text>
              <Text style={[styles.commonTableCol, styles.tableCol_M]}>
                ¥ {sponsorStyle.price.toLocaleString()}
              </Text>
            </View>
          ))}
          <View style={styles.tableRow}>
            <Text style={[styles.commonTableCol, styles.tableColHeader_S]} />
            <Text style={[styles.commonTableCol, styles.tableColHeader_L]} />
            <Text style={[styles.commonTableCol, styles.tableColHeader_S]}>合計</Text>
            <Text style={[styles.commonTableCol, styles.tableColHeader_M, styles.tableCol_Sum]} />
            <Text style={[styles.commonTableCol, styles.tableColHeader_M]}>
              ¥ {invoiceItem.totalPrice.toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={[styles.detailField, styles.marginBottom]}>
          <Text style={styles.text_S}>
            お手数をおかけしますが、{formatDateToJapanese(deadline)}
            までに下記口座へお振込みくださいますようお願い申し上げます。
          </Text>
          <Text style={styles.text_S}>&lt;振込先&gt;</Text>
          <Text style={styles.text_S}>銀 行 名 : 大光銀行（金融機関コード : 0532）</Text>
          <Text style={styles.text_S}>支 店 名 : 希望ヶ丘支店（支店コード : 042）</Text>
          <Text style={styles.text_S}>預金種別 : 普通預金</Text>
          <Text style={styles.text_S}>口座番号 : 2002151</Text>
          <Text style={styles.text_S}>
            口座名義 : 技大祭実行委員会(ギダイサイジツコウイインカイ)
          </Text>
        </View>
        <View>
          <View style={styles.itemsTable}>
            <View style={[styles.tableRow]}>
              <View style={styles.textAreaHeader}>
                <Text>備考</Text>
              </View>
              <View style={styles.textArea}>
                <Text>振込手数料は、御社負担にてお願いいたします。</Text>
                {(invoiceItem.remark.match(/.{1,40}/g) || []).map((chunk, index) => (
                  <Text key={index}>{chunk}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const createSponsorActivitiesPDF = async (
  invoiceItem: Invoice,
  deadline: string,
  issuedDate: string,
) => {
  const asPdf = pdf(
    <MyDocument invoiceItem={invoiceItem} deadline={deadline} issuedDate={issuedDate} />,
  );
  const blob = await asPdf.toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const { reiwa, festivalNumber } = calculateYearInfo(issuedDate);
  link.download = `令和${reiwa}年度第${festivalNumber}回技大祭_協賛請求書_${invoiceItem.sponsorName}.pdf`;

  link.click();
};

export const PreviewPDF: React.FC<MyDocumentProps> = ({ invoiceItem, deadline, issuedDate }) => (
  <PDFViewer
    style={{
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      border: 'none',
    }}
    showToolbar={false}
  >
    <MyDocument invoiceItem={invoiceItem} deadline={deadline} issuedDate={issuedDate} />
  </PDFViewer>
);
