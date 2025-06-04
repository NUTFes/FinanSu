import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';

interface OtherTeacher {
  building: string;
  room: string;
  name: string;
  amount?: number;
}

interface Props {
  teachers: OtherTeacher[];
}

const OtherBuildingsCard = ({ teachers }: Props) => (
  <Box
    p={4}
    border="2px dashed #FF69B4"
    borderRadius="md"
    bg="#FFF0F6"
    minW={0}
    w="100%"
    maxW="100%"
    boxShadow="md"
  >
    <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="#D72660" mb={2}>
      その他
    </Text>
    <Table variant="simple" size="sm">
      <Thead>
        <Tr>
          <Th fontSize={{ base: 'xs', md: 'sm' }}>棟名</Th>
          <Th fontSize={{ base: 'xs', md: 'sm' }}>居室</Th>
          <Th fontSize={{ base: 'xs', md: 'sm' }}>教員名</Th>
          <Th fontSize={{ base: 'xs', md: 'sm' }}>金額</Th>
        </Tr>
      </Thead>
      <Tbody>
        {teachers.map((t, i) => (
          <Tr key={i}>
            <Td fontSize={{ base: 'xs', md: 'sm' }}>{t.building}</Td>
            <Td fontSize={{ base: 'xs', md: 'sm' }}>{t.room}</Td>
            <Td fontSize={{ base: 'xs', md: 'sm' }}>{t.name}</Td>
            <Td fontSize={{ base: 'xs', md: 'sm' }}>{t.amount ? `¥${t.amount.toLocaleString()}` : ''}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

export default OtherBuildingsCard;