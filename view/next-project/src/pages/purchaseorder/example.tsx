import { get, post, put, del } from '@api/purchaseOrder';
import { Table, Tr, Td, Button } from '@chakra-ui/react';
type PurchaseOrder= {
  id: number;
  deadline: string;
  user_id: number;
};

type Props = {
  purchaseOrder: PurchaseOrder[];
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
    deadline: '2020',
    user_id: 1,
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
    deadline: '2022',
    user_id: 1,
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
            <Td>{purchaseOrder.user_id}</Td>
            <Td>{purchaseOrder.deadline}</Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}
