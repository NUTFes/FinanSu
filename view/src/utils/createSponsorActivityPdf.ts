import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from 'pdf-lib';
import { SponsorActivityView, SponsorStyleDetail } from '../type/common';

export const createSponsorActivityFormPdf = async (
  SponsorActivityViews: SponsorActivityView,
  IssueDay: string,
  PaymentDay: string,
) => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  // A4サイズのpdf作成
  const page = pdfDoc.addPage([642.52, 321.26]);
  const { width, height } = page.getSize();

  // フォント「ナス」
  const fontData = await pdfDoc.embedFont(
    await (await fetch('./fonts/Nasu-Regular.ttf')).arrayBuffer(),
    { subset: true },
  );
  // 日本語フォント以外を判定する関数
  const isNonJapaneseFont = (str: string): boolean => {
    const nonJapaneseRegex = /^[A-Za-z0-9!-~\s]*$/;
    return nonJapaneseRegex.test(str);
  };
  //文字列を省略する関数
  const truncateString = (str: string, maxLength: number, maxLength2: number) => {
    if (isNonJapaneseFont(str)) {
      return str.length > maxLength2 ? `${str.slice(0, maxLength2)}...` : str;
    } else {
      return str.length > maxLength ? `${str.slice(0, maxLength - 1)}…` : str;
    }
  };
  const fontSizeFunc = (str: string) => {
    if (isNonJapaneseFont(str)) {
      return 8;
    } else {
      return fontSizes[2];
    }
  };
  //フォントのサイズ
  const fontSizes = [12, 24, 8, 14, 16];

  const totalFee =
    SponsorActivityViews.styleDetail.length > 0
      ? SponsorActivityViews.styleDetail.reduce(
          (total: number, detail: SponsorStyleDetail) => total + detail.sponsorStyle.price,
          0,
        )
      : 0;

  // 内容の作成ここから
  page.drawText('領　収　書', {
    x: 180,
    y: height - 35,
    size: fontSizes[1],
    font: fontData,
  });
  page.drawText('No.', {
    x: 480,
    y: height - 35,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('発行日　' + IssueDay, {
    x: 480,
    y: height - 50,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText(SponsorActivityViews.sponsor.name, {
    x: 100,
    y: height - 80,
    size: fontSizes[4],
    font: fontData,
  });
  page.drawLine({
    start: { x: 20, y: height - 85 },
    end: { x: 250, y: height - 85 },
    opacity: 0.75,
  });
  page.drawText('御中', {
    x: 260,
    y: height - 80,
    size: fontSizes[4],
    font: fontData,
  });
  page.drawText('下記、正に領収いたしました。', {
    x: 20,
    y: height - 110,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawRectangle({
    x: 40,
    y: height - 160,
    width: width - 100,
    height: 40,
    color: rgb(0.85, 0.93, 0.95),
  });
  page.drawText('金額：', {
    x: 80,
    y: height - 150,
    size: fontSizes[4],
    font: fontData,
  });
  page.drawText('￥' + totalFee, {
    x: 150,
    y: height - 150,
    size: fontSizes[4],
    font: fontData,
  });
  page.drawLine({
    start: { x: 40, y: height - 160 },
    end: { x: width - 60, y: height - 160 },
    opacity: 0.75,
    thickness: 2,
  });
  page.drawText('但', {
    x: 80,
    y: height - 190,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('技大祭への広告協賛として', {
    x: 140,
    y: height - 190,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawLine({
    start: { x: 140, y: height - 195 },
    end: { x: 300, y: height - 195 },
    opacity: 0.75,
  });
  page.drawText('入金日', {
    x: 80,
    y: height - 210,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText(PaymentDay, {
    x: 140,
    y: height - 210,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawLine({
    start: { x: 140, y: height - 215 },
    end: { x: 300, y: height - 215 },
    opacity: 0.75,
  });
  page.drawText('内', {
    x: 80,
    y: height - 230,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('消費税等', {
    x: 80,
    y: height - 250,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('長岡技術科学大学　技大祭実行員会', {
    x: 340,
    y: height - 230,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('〒940-2188', {
    x: 340,
    y: height - 250,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('新潟県長岡市上富岡町1603-1', {
    x: 340,
    y: height - 270,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('大学集会施設1号館技大祭実行委員会', {
    x: 340,
    y: height - 290,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('E-mail：nutfes_shogai_kyosan@googlegroups.com', {
    x: 340,
    y: height - 310,
    size: fontSizes[0],
    font: fontData,
  });

  // 内容の作成ここまで
  // 生成されたPDFデータを取得
  const pdfBytes = await pdfDoc.save();
  // Blobを作成
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return blob;
};
