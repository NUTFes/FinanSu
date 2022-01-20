import { get, post, put, del } from '@utils/api_methods';
import { Table, Tr, Td, Button } from '@chakra-ui/react';
type Budget = {
  id: number;
  price: number;
  year_id: number;
  source_id: number;
};

type Props = {
  budget: Budget[];
};

export async function getStaticProps() {
  const getUrl = 'http://nutfes-finansu-api:1323/budgets';
  const json = await get(getUrl);
  return {
    props: {
      budget: json,
    },
  };
}

export async function postBudget() {
  const postUrl = 'http://localhost:1323/budgets';
  const postData = { price: 100000, year_id: 1, source_id: 1 };
  const getRes = await get(postUrl);
  console.log(getRes.slice(-1)[0].id);
  const postReq = await post(postUrl, postData);
}

export async function putBudget() {
  const Url = 'http://localhost:1323/budgets';
  const getRes = await get(Url);
  const putUrl = Url + '/' + getRes.slice(-1)[0].id;
  const putData = { price: 200000, year_id: 2, source_id: 2 };
  const putReq = await put(putUrl, putData);
}

export async function deleteBudget() {
  const Url = 'http://localhost:1323/budgets';
  const getRes = await get(Url);
  const delUrl = Url + '/' + getRes.slice(-1)[0].id;
  console.log(getRes.slice(-1)[0].id);
  const delReq = await del(delUrl);
}

export default function Example(props: Props) {
  return (
    <div>
      <Button onClick={postBudget}>POST</Button>
      <Button onClick={putBudget}>PUT</Button>
      <Button onClick={deleteBudget}>DELETE</Button>
      <Table>
        {props.budget.map((budget) => (
          <Tr key={budget.toString()}>
            <Td>{budget.id}</Td>
            <Td>{budget.price}</Td>
            <Td>{budget.year_id}</Td>
            <Td>{budget.source_id}</Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}
