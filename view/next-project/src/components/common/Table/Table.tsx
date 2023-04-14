import React, { FC, useState } from 'react';
import DataTable from 'react-data-table-component';
import Input from '../Input/Input';
import CloseButton from '../CloseButton';
import { Column } from '@type/column';

interface TableContentProps {
  columns: Column[];
  data: any;
}

const CUSTOM_STYLES = {
  //   headCells: {
  //     style: {
  //       fontSize: '14px',
  //       justifyContent: 'center',
  //     },
  //   },
  //   cells: {
  //     style: {
  //       justifyContent: 'center',
  //       padding: '25px',
  //     },
  //   },
  //   headRow: {
  //     style: {
  //       borderBottomWidth: '1px',
  //       borderBottomColor: '#000',
  //     },
  //   },
  //   rows: {
  //     highlightOnHoverStyle: {
  //       transform: 'translateY(-1px)',
  //       backgroundColor: 'white',
  //       boxShadow: '5px 5px 14px #f0f0f0, -5px -5px 14px #fafafa',
  //       transition: 'all 0.2s ease-in-out',
  //     },
  //   },
};

const Table: FC<TableContentProps> = (props) => {
  const [filterText, setFilterText] = useState('');

  const filteredItems = props.data.filter(
    (item: any) => JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1,
  );

  return (
    <>
      <div className='flex gap-3'>
        <Input
          placeholder='絞り込み'
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <CloseButton onClick={() => setFilterText('')} />
      </div>
      <DataTable
        columns={props.columns}
        data={filteredItems}
        pagination
        highlightOnHover
        pointerOnHover
        customStyles={CUSTOM_STYLES}
      />
    </>
  );
};

export default Table;
