import {
  Box,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import OpenEditModalButton from '@/components/campus_fund/OpenEditModalButton';
import ReportModal from '@/components/campus_fund/ReportModal';
import SelectTeacherModal from '@/components/campus_fund/SelectTeacherModal';
import formatNumber from '@/components/common/Formatter';
import MainLayout from '@/components/layout/MainLayout';

const CampusFund = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isSelectTeacherOpen, setIsSelectTeacherOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const buildings = [
    { name: '機械・建設棟', amount: 24000 },
    { name: '電気棟', amount: 5000 },
    { name: '生物棟', amount: 6500 },
    { name: '環境・システム棟', amount: 21000 },
    { name: '物質・材料経営情報棟', amount: 34000 },
    { name: '総合研究棟', amount: 41000 },
    { name: '原子力・システム安全棟', amount: 8500 },
    { name: '事務局棟', amount: 64000 },
    { name: 'センター', amount: 121000 },
  ];

  // 総募金額を計算
  const totalAmount = buildings.reduce((sum, building) => sum + building.amount, 0);

  const handleBuildingClick = (building: string) => {
    setSelectedBuilding(building);
    setIsSelectTeacherOpen(true); // 教員選択モーダルを開く
  };

  const handleTeacherSelect = (teacher: string) => {
    setSelectedTeacher(teacher);
    setIsSelectTeacherOpen(false); // 教員選択モーダルを閉じる
    setIsReportModalOpen(true); // 報告モーダルを開く
  };

  return (
    <MainLayout>
      <Box p={8} mx="auto">
        <Text fontSize="2xl" fontWeight="bold" color="#26C1CE" textAlign="center" mt={8}>
          総募金額
        </Text>
        <Text fontSize="6xl" fontWeight="bold" color="#04668C" textAlign="center" mb={8}>
          ¥{formatNumber(totalAmount)}
        </Text>
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
          {buildings.map((building) => (
            <GridItem
              key={building.name}
              p={4}
              border="1px solid #E2E8F0"
              borderRadius="md"
              textAlign="center"
              cursor="pointer"
              onClick={() => handleBuildingClick(building.name)}
            >
              <Text fontSize="lg" fontWeight="bold">
                {building.name}
              </Text>
              <Text fontSize="xl" color="#26C1CE">
                ¥{formatNumber(building.amount)}
              </Text>
              <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
                <OpenEditModalButton className="w-full md:w-fit">
                  報告登録
                </OpenEditModalButton>
              </Box>
            </GridItem>
          ))}
        </Grid>

        {/* 教員選択モーダル */}
        <SelectTeacherModal
          isOpen={isSelectTeacherOpen}
          onClose={() => setIsSelectTeacherOpen(false)}
          onSelect={handleTeacherSelect}
          building={selectedBuilding}
        />

        {/* 報告モーダル */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          building={selectedBuilding}
          teacher={selectedTeacher}
        />
      </Box>
    </MainLayout>
  );
};

export default CampusFund;