import { get, post, put, del } from '@api/purchaseReport';
import { Table, Tr, Td, Button } from '@chakra-ui/react';
interface PurchaseReport {
  id: number;
  user_id: number;
  purchase_order_id: number;
}

interface Props {
  purchaseReport: PurchaseReport[];
};

export async function getStaticProps() {
  const getUrl = 'http://nutfes-finansu-api:1323/purchasereports';
  const json = await get(getUrl);
  return {
    props: {
      purchaseReport: json,
    },
  };
}

export async function postPurchaseReport() {
  const postUrl = 'http://localhost:1323/purchasereports';
  const postData = {
    user_id: 1,
    purchase_order_id: 1,
  };
  const getRes = await get(postUrl);
  console.log(getRes.slice(-1)[0].id);
  const postReq = await post(postUrl, postData);
}

export async function putPurchaseReport() {
  const Url = 'http://localhost:1323/purchasereports';
  const getRes = await get(Url);
  const putUrl = Url + '/' + getRes.slice(-1)[0].id;
  const putData = {
    user_id: 2,
    purchase_order_id: 1,
  };
  const putReq = await put(putUrl, putData);
}

export async function deletePurchaseReport() {
  const Url = 'http://localhost:1323/purchasereports';
  const getRes = await get(Url);
  const delUrl = Url + '/' + getRes.slice(-1)[0].id;
  console.log(getRes.slice(-1)[0].id);
  const delReq = await del(delUrl);
}

export default function Example(props: Props) {
  return (
    <div>
      <Button onClick={postPurchaseReport}>POST</Button>
      <Button onClick={putPurchaseReport}>PUT</Button>
      <Button onClick={deletePurchaseReport}>DELETE</Button>
      <Table>
        {props.purchaseReport.map((purchaseReportItem) => (
          <Tr key={purchaseReportItem.toString()}>
            <Td>{purchaseReportItem.id}</Td>
            <Td>{purchaseReportItem.user_id}</Td>
            <Td>{purchaseReportItem.purchase_order_id}</Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}
