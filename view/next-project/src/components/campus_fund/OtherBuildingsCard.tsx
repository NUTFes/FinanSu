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
  <div className='w-full rounded-md border-2 border-dashed border-pink-400 bg-pink-50 p-4 shadow-md'>
    <p className='mb-2 text-base font-bold text-pink-700 md:text-lg'>その他</p>
    <div className='overflow-x-auto'>
      <table className='w-full table-auto text-left text-xs md:text-sm'>
        <thead>
          <tr className='border-b border-pink-200'>
            <th className='px-2 py-2 font-semibold'>棟名</th>
            <th className='px-2 py-2 font-semibold'>居室</th>
            <th className='px-2 py-2 font-semibold'>教員名</th>
            <th className='px-2 py-2 font-semibold'>金額</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher, index) => (
            <tr key={`${teacher.building}-${teacher.room}-${index}`} className='border-b last:border-0'>
              <td className='px-2 py-2'>{teacher.building}</td>
              <td className='px-2 py-2'>{teacher.room}</td>
              <td className='px-2 py-2'>{teacher.name}</td>
              <td className='px-2 py-2'>
                {teacher.amount ? `¥${teacher.amount.toLocaleString()}` : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default OtherBuildingsCard;
