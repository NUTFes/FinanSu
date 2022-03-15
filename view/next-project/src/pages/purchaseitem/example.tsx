import { get, post, put, del } from '@api/purchaseItem';
import { Table, Tr, Td, Button } from '@chakra-ui/react';
type PurchaseItem = {
  id: number;
  item: string;
  price: number;
  quantity: number;
  detail: string;
  url: string;
};

type Props = {
  purchaseItem: PurchaseItem[];
};

export async function getStaticProps() {
  const getUrl = 'http://nutfes-finansu-api:1323/purchaseitems';
  const json = await get(getUrl);
  return {
    props: {
      purchaseItem: json,
    },
  };
}

export async function postPurchaseItems() {
  const postUrl = 'http://localhost:1323/purchaseitems';
  const postData = {
    item: 'item',
    price: 100000,
    quantity: 1,
    detail: 'detail',
    url: 'https://nutfes.net',
  };
  const getRes = await get(postUrl);
  console.log(getRes.slice(-1)[0].id);
  const postReq = await post(postUrl, postData);
}

export async function putPurchaseItems() {
  const Url = 'http://localhost:1323/purchaseitems';
  const getRes = await get(Url);
  const putUrl = Url + '/' + getRes.slice(-1)[0].id;
  const putData = {
    item: 'change item',
    price: 1000,
    quantity: 2,
    detail: 'change item detail',
    url: 'https://nutneg.net',
  };
  const putReq = await put(putUrl, putData);
}

export async function deletePurchaseItems() {
  const Url = 'http://localhost:1323/purchaseitems';
  const getRes = await get(Url);
  const delUrl = Url + '/' + getRes.slice(-1)[0].id;
  console.log(getRes.slice(-1)[0].id);
  const delReq = await del(delUrl);
}

export default function Example(props: Props) {
  return (
    <div>
      <Button onClick={postPurchaseItems}>POST</Button>
      <Button onClick={putPurchaseItems}>PUT</Button>
      <Button onClick={deletePurchaseItems}>DELETE</Button>
      <Table>
        {props.purchaseItem.map((purchaseItem) => (
          <Tr key={purchaseItem.toString()}>
            <Td>{purchaseItem.id}</Td>
            <Td>{purchaseItem.price}</Td>
            <Td>{purchaseItem.quantity}</Td>
            <Td>{purchaseItem.detail}</Td>
            <Td>{purchaseItem.url}</Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}
