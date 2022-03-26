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

export async function getServerSideProps() {
  const getUrl = process.env.SSR_API_URI + '/purchaseorders';
  const json = await get(getUrl);
  return {
    props: {
      purchaseOrder: json,
    },
  };
}

export async function postPurchaseOrders() {
  const postUrl = process.env.CSR_API_URI + '/purchaseorders';
  const postData = {
    deadline: '2020',
    user_id: 1,
  };
  const getRes = await get(postUrl);
  console.log(getRes.slice(-1)[0].id);
  const postReq = await post(postUrl, postData);
}

export async function putPurchaseOrders() {
  const url = process.env.CSR_API_URI + '/purchaseorders';
  const getRes = await get(url);
  const putUrl = url + '/' + getRes.slice(-1)[0].id;
  const putData = {
    deadline: '2022',
    user_id: 1,
  };
  const putReq = await put(putUrl, putData);
}

export async function deletePurchaseOrders() {
  const url = process.env.CSR_API_URI + '/purchaseorders';
  const getRes = await get(url);
  const delUrl = url + '/' + getRes.slice(-1)[0].id;
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
