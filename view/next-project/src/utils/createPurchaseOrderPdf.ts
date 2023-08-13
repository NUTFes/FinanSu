import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from 'pdf-lib';
import { PurchaseOrderView } from '../type/common';
import { BUREAUS } from '@/constants/bureaus';

export const createPurchasOrderFormPdf = async (purchaseOrdersViews: PurchaseOrderView) => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  // A4サイズのpdf作成
  const page = pdfDoc.addPage([595.28, 841.89]);
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
      return fontSizes[0];
    }
  };
  //フォントのサイズ
  const fontSizes = [12, 24];

  // 内容の作成ここから
  page.drawText('資料番号', {
    x: 25,
    y: height - 35,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('-', {
    x: 140,
    y: height - 35,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('受取日', {
    x: 25,
    y: height - 50,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('年', {
    x: 126,
    y: height - 50,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('月', {
    x: 152,
    y: height - 50,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('日', {
    x: 177,
    y: height - 50,
    size: fontSizes[0],
    font: fontData,
  });
  const date = purchaseOrdersViews.purchaseOrder.deadline.split('-');
  page.drawText('購入期限', {
    x: 25,
    y: height - 65,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText(date[0] + '年', {
    x: 100,
    y: height - 65,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText(date[1], {
    x: 153 - date[1].length * 7,
    y: height - 65,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('月', {
    x: 152,
    y: height - 65,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText(date[2], {
    x: 178 - date[2].length * 7,
    y: height - 65,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('日', {
    x: 177,
    y: height - 65,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('引渡し額', {
    x: 25,
    y: height - 80,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('¥', {
    x: 115,
    y: height - 80,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('提出者', {
    x: 25,
    y: height - 95,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText(BUREAUS[purchaseOrdersViews.user.bureauID].name, {
    x: 100,
    y: height - 95,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('(担当:' + purchaseOrdersViews.user.name + ')', {
    x: 150,
    y: height - 95,
    size: fontSizes[0],
    font: fontData,
  });
  for (let i = 0; i < 5; i++) {
    page.drawText('：', {
      x: 75,
      y: height - (35 + i * 15),
      size: fontSizes[0],
      font: fontData,
    });
    if (i !== 4) {
      page.drawLine({
        start: { x: 90, y: height - (38 + i * 15) },
        end: { x: 200, y: height - (38 + i * 15) },
        opacity: 0.75,
      });
    } else {
      page.drawLine({
        start: { x: 90, y: height - (38 + i * 15) },
        end: { x: 270, y: height - (38 + i * 15) },
        opacity: 0.75,
      });
    }
  }

  page.drawText('見積書', {
    x: width / 2 - 33,
    y: height - 160,
    size: fontSizes[1],
    font: fontData,
  });
  page.drawText('提出日: 令和　年　月　日', {
    x: 25,
    y: height - 190,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawLine({
    start: { x: 67, y: height - 192 },
    end: { x: 170, y: height - 192 },
    opacity: 0.75,
  });
  page.drawText('財務局長 殿', {
    x: 25,
    y: height - 215,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText(
    '下記，当該物品の購入にあたり資金が必要となるため，資金を提出していただけますようお願い',
    {
      x: 40,
      y: height - 230,
      size: fontSizes[0],
      font: fontData,
    },
  );
  page.drawText('申し上げます。', {
    x: 40,
    y: height - 245,
    size: fontSizes[0],
    font: fontData,
  });

  page.drawText('記', {
    x: width / 2 - 20,
    y: height - 255,
    size: fontSizes[0],
    font: fontData,
  });

  page.drawRectangle({
    x: (3 * width) / 4,
    y: height - 130,
    width: width / 6,
    height: 20,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawRectangle({
    x: (3 * width) / 4,
    y: height - 165,
    width: width / 6,
    height: 35,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText('局長サイン欄', {
    x: (3 * width) / 4 + 13,
    y: height - 125,
    size: fontSizes[0],
    font: fontData,
  });

  //購入物品のテーブル作成
  const rectangleWidth = width / 5;
  const rectangleWidth2 = (width - (width * 3) / 5) / 4;
  const tableHight = 300;
  const tableTextHight = 296;
  page.drawRectangle({
    x: 22,
    y: height - tableHight,
    width: rectangleWidth,
    height: 20,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  for (let i = 0; i < 3; i++) {
    page.drawRectangle({
      x: 22 + rectangleWidth + i * rectangleWidth2,
      y: height - tableHight,
      width: rectangleWidth2,
      height: 20,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  }
  for (let i = 0; i < 2; i++) {
    page.drawRectangle({
      x: 22 + rectangleWidth + 3 * rectangleWidth2 + i * rectangleWidth,
      y: height - tableHight,
      width: rectangleWidth,
      height: 20,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  }
  page.drawRectangle({
    x: 22 + 3 * rectangleWidth + 3 * rectangleWidth2,
    y: height - tableHight,
    width: 20,
    height: 20,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText('物品名', {
    x: 62,
    y: height - tableTextHight,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('単価', {
    x: 22 + rectangleWidth + 17,
    y: height - tableTextHight,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('個数', {
    x: 22 + rectangleWidth + rectangleWidth2 + 17,
    y: height - tableTextHight,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('小計', {
    x: 22 + rectangleWidth + 2 * rectangleWidth2 + 17,
    y: height - tableTextHight,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('用途', {
    x: 22 + rectangleWidth + 3 * rectangleWidth2 + 47,
    y: height - tableTextHight,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('備考', {
    x: 22 + 2 * rectangleWidth + 3 * rectangleWidth2 + 47,
    y: height - tableTextHight,
    size: fontSizes[0],
    font: fontData,
  });
  page.drawText('☑︎', {
    x: 22 + 3 * rectangleWidth + 3 * rectangleWidth2 + 4,
    y: height - tableTextHight,
    size: fontSizes[0],
    font: fontData,
  });
  let sum = 0;
  purchaseOrdersViews.purchaseItem.map((item, index, arr) => {
    page.drawRectangle({
      x: 22,
      y: height - (tableHight + 20 * (1 + index)),
      width: rectangleWidth,
      height: 20,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    for (let i = 0; i < 3; i++) {
      page.drawRectangle({
        x: 22 + rectangleWidth + i * rectangleWidth2,
        y: height - (tableHight + 20 * (1 + index)),
        width: rectangleWidth2,
        height: 20,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    }
    for (let i = 0; i < 2; i++) {
      page.drawRectangle({
        x: 22 + rectangleWidth + 3 * rectangleWidth2 + i * rectangleWidth,
        y: height - (tableHight + 20 * (1 + index)),
        width: rectangleWidth,
        height: 20,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    }
    page.drawRectangle({
      x: 22 + 3 * rectangleWidth + 3 * rectangleWidth2,
      y: height - (tableHight + 20 * (1 + index)),
      width: 20,
      height: 20,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    const itemName = truncateString(item.item, 9, 16);
    const itemFontSize = fontSizeFunc(item.item);
    page.drawText(itemName, {
      x: (rectangleWidth - itemName.length * itemFontSize) / 2 + 22,
      y: height - (tableTextHight + 20 * (1 + index)),
      size: fontSizes[0],
      font: fontData,
    });
    page.drawText(String(item.price), {
      x: 18 + rectangleWidth + rectangleWidth2 - String(item.price).length * 7,
      y: height - (tableTextHight + 20 * (1 + index)),
      size: fontSizes[0],
      font: fontData,
    });
    page.drawText(String(item.quantity), {
      x: 22 + rectangleWidth + rectangleWidth2 + rectangleWidth2 / 2 - 5,
      y: height - (tableTextHight + 20 * (1 + index)),
      size: fontSizes[0],
      font: fontData,
    });
    sum += item.price * item.quantity;
    page.drawText(String(item.price * item.quantity), {
      x: 18 + rectangleWidth + 3 * rectangleWidth2 - String(item.price * item.quantity).length * 7,
      y: height - (tableTextHight + 20 * (1 + index)),
      size: fontSizes[0],
      font: fontData,
    });
    const detail = truncateString(item.detail, 9, 16);
    page.drawText(detail, {
      x: 24 + 2 * rectangleWidth + 3 * rectangleWidth2,
      y: height - (tableTextHight + 20 * (1 + index)),
      size: fontSizes[0],
      font: fontData,
    });
    //合計の処理
    if (index === arr.length - 1) {
      page.drawRectangle({
        x: 22,
        y: height - (tableHight + 20 * (2 + index)),
        width: rectangleWidth,
        height: 20,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      for (let i = 0; i < 3; i++) {
        page.drawRectangle({
          x: 22 + rectangleWidth + i * rectangleWidth2,
          y: height - (tableHight + 20 * (2 + index)),
          width: rectangleWidth2,
          height: 20,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });
      }
      for (let i = 0; i < 2; i++) {
        page.drawRectangle({
          x: 22 + rectangleWidth + 3 * rectangleWidth2 + i * rectangleWidth,
          y: height - (tableHight + 20 * (2 + index)),
          width: rectangleWidth,
          height: 20,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });
      }
      page.drawRectangle({
        x: 22 + 3 * rectangleWidth + 3 * rectangleWidth2,
        y: height - (tableHight + 20 * (2 + index)),
        width: 20,
        height: 20,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      page.drawText('合計', {
        x: 22 + rectangleWidth + rectangleWidth2 + 17,
        y: height - (tableTextHight + 20 * (2 + index)),
        size: fontSizes[0],
        font: fontData,
      });
      page.drawText(String(sum), {
        x: 18 + rectangleWidth + 3 * rectangleWidth2 - String(sum).length * 7,
        y: height - (tableTextHight + 20 * (2 + index)),
        size: fontSizes[0],
        font: fontData,
      });
      page.drawText('以上', {
        x: width - 65,
        y: height - (tableTextHight + 20 * (3 + index)),
        size: fontSizes[0],
        font: fontData,
      });
    }
  });
  // 内容の作成ここまで
  // 生成されたPDFデータを取得
  const pdfBytes = await pdfDoc.save();
  // Blobを作成
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return blob;
};
