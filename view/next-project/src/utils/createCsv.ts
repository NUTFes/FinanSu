export type CsvColumn<T> = { label: string } & (
  | { getCustomValue: (row: T) => string | number | null }
  | { key: keyof T }
);
export function createHeader<T extends object>(columns: CsvColumn<T>[]) {
  return columns.map(({ label }) => label);
}
export function createCsvData<T extends object>(rows: T[], columns: CsvColumn<T>[]) {
  const header = createHeader(columns);
  const body = rows.map((values) =>
    columns.map((column) => {
      if ('key' in column) {
        return String(values[column.key] ?? '');
      }

      return column.getCustomValue(values);
    }),
  );
  return [header, ...body];
}

export const createCsv = (csvData: (number | string | null)[][]) =>
  csvData
    .map((row) => {
      const rowString = row.map((value) => {
        if (value === null) return '';
        if (typeof value === 'string') return value.replace(/,/g, '，').replace(/\n/g, ' ');
        return String(value);
      });
      return rowString.join(',');
    })
    .join('\n');
