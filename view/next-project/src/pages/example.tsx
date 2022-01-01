import { get, post, put, del } from '@utils/api_methods';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Button,
  Flex,
  Spacer,
  Select,
  Icon,
  Text,
  createIcon,
} from '@chakra-ui/react';
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

// export async function postBudget() {
//   const postUrl = 'http://localhost:1323/budget';
//   const postData = { title: 'Rust勉強', content: '未定', homework: '未定', skill_id: 1 };
//   const getRes = await get(postUrl);
//   console.log(getRes.slice(-1)[0].id);
//   const postReq = await post(postUrl, postData);
// }

// export async function putBudget() {
//   const Url = 'http://localhost:1323/budget';
//   const getRes = await get(Url);
//   const putUrl = Url + '/' + getRes.slice(-1)[0].id;
//   const putData = {
//     title: 'Rust勉強会',
//     content: 'Rustとwasbによるフロントエンド実装',
//     homework: 'ソート',
//     skill_id: 1,
//   };
//   console.log(getRes.slice(-1)[0].id);
//   const putReq = await put(putUrl, putData);
// }

// export async function deleteBudget() {
//   const Url = 'http://localhost:1323/budget';
//   const getRes = await get(Url);
//   const delUrl = Url + '/' + getRes.slice(-1)[0].id;
//   console.log(getRes.slice(-1)[0].id);
//   const delReq = await del(delUrl);
// }

export default function Example(props: Props) {
  return (
    <div>
      {/* <Button onClick={postBudget}>POST</Button> */}
      {/* <Button onClick={putBudget}>PUT</Button> */}
      {/* <Button onClick={deleteBudget}>DELETE</Button> */}
      <Table>
        {props.budget.map((budget) => (
          <Tr key={budget.toString()}>
            <Td>{budget.id}</Td>
            <Td>{budget.price}</Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}
