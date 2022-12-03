import { Button, Table, Td, Tr } from '@chakra-ui/react';

import { del, get } from '@api/api_methods';
import { post, put } from '@api/fundInformations';
type FundInformations = {
  id: number;
  contact_person: string;
  fund_date: string;
  fund_time: string;
  price: number;
  detail: string;
  report_person: string;
  report_price: number;
};

type Props = {
  fundInformation: FundInformations[];
};

export async function getServerSideProps() {
  const getUrl = 'http://nutfes-finansu-api:1323/fundinformations';
  // const getUrl = process.env.SSR_API_URI + '/fundinformations';
  const json = await get(getUrl);
  return {
    props: {
      fundInformation: json,
    },
  };
}

export async function postPurchaseOrders() {
  const postUrl = 'http://localhost:1323/fundinformations';
  // const postUrl = process.env.CSR_API_URI + '/fundinformations';
  const postData = {
    contact_person: 'user',
    fund_date: '20220101',
    fund_time: '12:00',
    price: 5000,
    detail: 'fund details',
    report_person: 'report user',
    report_price: 5000,
  };
  const getRes = await get(postUrl);
  console.log(getRes.slice(-1)[0].id);
  await post(postUrl, postData);
}

export async function putPurchaseOrders() {
  const Url = 'http://localhost:1323/fundinformations';
  // const Url = process.env.CSR_API_URI + '/fundinformations';
  const getRes = await get(Url);
  const putUrl = Url + '/' + getRes.slice(-1)[0].id;
  const putData = {
    contact_person: 'put user',
    fund_date: '20220201',
    fund_time: '24:00',
    price: 3000,
    detail: 'details',
    report_person: 'report',
    report_price: 3000,
  };
  await put(putUrl, putData);
}

export async function deletePurchaseOrders() {
  const Url = 'http://localhost:1323/fundinformations';
  // const Url = process.env.CSR_API_URI + '/fundinformations';
  const getRes = await get(Url);
  const delUrl = Url + '/' + getRes.slice(-1)[0].id;
  console.log(getRes.slice(-1)[0].id);
  await del(delUrl);
}

export default function Example(props: Props) {
  return (
    <div>
      <Button onClick={postPurchaseOrders}>POST</Button>
      <Button onClick={putPurchaseOrders}>PUT</Button>
      <Button onClick={deletePurchaseOrders}>DELETE</Button>
      <Table>
        {props.fundInformation.map((fundInformation) => (
          <Tr key={fundInformation.toString()}>
            <Td>{fundInformation.id}</Td>
            <Td>{fundInformation.contact_person}</Td>
            <Td>{fundInformation.fund_date}</Td>
            <Td>{fundInformation.fund_time}</Td>
            <Td>{fundInformation.price}</Td>
            <Td>{fundInformation.detail}</Td>
            <Td>{fundInformation.report_person}</Td>
            <Td>{fundInformation.report_price}</Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}
