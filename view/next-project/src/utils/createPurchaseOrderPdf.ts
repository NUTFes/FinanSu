import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from 'pdf-lib';
import { PurchaseOrderView, Expense } from '../type/common';

export const createPurchasOrderFormPdf = async (
  purchaseOrdersViews: PurchaseOrderView,
  expenses: Expense[],
) => {
  // 新しいPDFドキュメントを作成
  const pdfDoc = await PDFDocument.create();

  pdfDoc.registerFontkit(fontkit);

  // フォント「ナス」
  const fontData = await pdfDoc.embedFont(
    await (await fetch('./fonts/Nasu-Regular.ttf')).arrayBuffer(),
    { subset: true },
  );

  // ページを追加
  const page = pdfDoc.addPage([420, 594]);
  const { width, height } = page.getSize();

  // ページにテキストを追加
  const fontSize = 30;
  page.drawText('test' + purchaseOrdersViews.purchaseOrder.id, {
    x: 50,
    y: height - 50,
    size: fontSize,
    color: rgb(0, 0, 0),
  });
  page.drawText('テスト' + expenses[purchaseOrdersViews.purchaseOrder.expenseID].name, {
    x: 50,
    y: height - 100,
    size: fontSize,
    font: fontData,
    color: rgb(0, 0, 0),
  });

  // 生成されたPDFデータを取得
  const pdfBytes = await pdfDoc.save();

  // Blobを作成
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return blob;
};
