import { get, post, put, del } from '@api/purchaseReport';
import { Table, Tr, Td, Button } from '@chakra-ui/react';
interface PurchaseReport {
  id: number;
  user_id: number;
  purchase_order_id: number;
}

interface Props {
  purchaseReport: PurchaseReport[];
}

export async function getServerSideProps() {
  const getUrl = process.env.SSR_API_URI + '/purchasereports';
  const json = await get(getUrl);
  return {
    props: {
      purchaseReport: json,
    },
  };
}

export async function postPurchaseReport() {
  const postUrl = process.env.CSR_API_URI + '/purchasereports';
  const postData = {
    user_id: 1,
    purchase_order_id: 1,
  };
  const getRes = await get(postUrl);
  console.log(getRes.slice(-1)[0].id);
  const postReq = await post(postUrl, postData);
}

export async function putPurchaseReport() {
  const url = process.env.CSR_API_URI + '/purchasereports';
  const getRes = await get(url);
  const putUrl = url + '/' + getRes.slice(-1)[0].id;
  const putData = {
    user_id: 2,
    purchase_order_id: 1,
  };
  const putReq = await put(putUrl, putData);
}

export async function deletePurchaseReport() {
  const url = process.env.CSR_API_URI + '/purchasereports';
  const getRes = await get(url);
  const delUrl = url + '/' + getRes.slice(-1)[0].id;
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
