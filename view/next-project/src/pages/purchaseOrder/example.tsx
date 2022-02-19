import { get, post, put, del } from '@api/purchaseOrder';
import { Table, Tr, Td, Button } from '@chakra-ui/react';
type PurchaseOrders = {
  id: number;
  item: string;
  price: number;
  department_id: number;
  detail: string;
  url: string;
};

type Props = {
  purchaseOrder: PurchaseOrders[];
};

export async function getStaticProps() {
  const getUrl = 'http://nutfes-finansu-api:1323/purchaseorders';
  const json = await get(getUrl);
  return {
    props: {
      purchaseOrder: json,
    },
  };
}

export async function postPurchaseOrders() {
  const postUrl = 'http://localhost:1323/purchaseorders';
  const postData = {
    item: 'item',
    price: 100000,
    department_id: 1,
    detail: 'detail',
    url: 'https://nutfes.net',
  };
  const getRes = await get(postUrl);
  console.log(getRes.slice(-1)[0].id);
  const postReq = await post(postUrl, postData);
}

export async function putPurchaseOrders() {
  const Url = 'http://localhost:1323/purchaseorders';
  const getRes = await get(Url);
  const putUrl = Url + '/' + getRes.slice(-1)[0].id;
  const putData = {
    item: 'change item',
    price: 1000,
    department_id: 2,
    detail: 'change item detail',
    url: 'https://nutneg.net',
  };
  const putReq = await put(putUrl, putData);
}

export async function deletePurchaseOrders() {
  const Url = 'http://localhost:1323/purchaseorders';
  const getRes = await get(Url);
  const delUrl = Url + '/' + getRes.slice(-1)[0].id;
  console.log(getRes.slice(-1)[0].id);
  const delReq = await del(delUrl);
}

export default function Example(props: Props) {
  return (
    <div>
      <Button onClick={postPurchaseOrders}>POST</Button>
      <Button onClick={putPurchaseOrders}>PUT</Button>
      <Button onClick={deletePurchaseOrders}>DELETE</Button>
      <Table>
        {props.purchaseOrder.map((purchaseOrder) => (
          <Tr key={purchaseOrder.toString()}>
            <Td>{purchaseOrder.id}</Td>
            <Td>{purchaseOrder.price}</Td>
            <Td>{purchaseOrder.department_id}</Td>
            <Td>{purchaseOrder.detail}</Td>
            <Td>{purchaseOrder.url}</Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}
