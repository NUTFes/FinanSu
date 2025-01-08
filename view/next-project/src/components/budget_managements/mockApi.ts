export interface Department {
  id: number;
  name: string;
  budget: number;
  used: number;
  remaining: number;
}

export interface Division {
  id: number;
  name: string;
  departmentId: number;
  budget: number;
  used: number;
  remaining: number;
}

export interface Item {
  id: number;
  name: string;
  divisionId: number;
  budget: number;
  used: number;
  remaining: number;
}

const departments: Department[] = [
  { id: 1, name: '制作局', budget: 20000, used: 5000, remaining: 15000 },
  { id: 2, name: '渉外局', budget: 18000, used: 4000, remaining: 14000 },
  { id: 3, name: '企画局', budget: 22000, used: 6000, remaining: 16000 },
  { id: 4, name: '財務局', budget: 25000, used: 5500, remaining: 19500 },
  { id: 5, name: '情報局', budget: 21000, used: 7000, remaining: 14000 },
  { id: 6, name: '総務局', budget: 23000, used: 4500, remaining: 18500 },
];

const divisions: Division[] = [
  { id: 1, name: '制作部門A', departmentId: 1, budget: 10000, used: 3000, remaining: 7000 },
  { id: 2, name: '制作部門B', departmentId: 1, budget: 10000, used: 2000, remaining: 8000 },
  { id: 3, name: '渉外部門A', departmentId: 2, budget: 9000, used: 4000, remaining: 5000 },
  { id: 4, name: '渉外部門B', departmentId: 2, budget: 9000, used: 0, remaining: 9000 },
  { id: 5, name: '企画部門A', departmentId: 3, budget: 11000, used: 5000, remaining: 6000 },
  { id: 6, name: '企画部門B', departmentId: 3, budget: 11000, used: 1000, remaining: 10000 },
  { id: 7, name: '財務部門A', departmentId: 4, budget: 12500, used: 3000, remaining: 9500 },
  { id: 8, name: '財務部門B', departmentId: 4, budget: 12500, used: 2500, remaining: 10000 },
  { id: 9, name: '情報部門A', departmentId: 5, budget: 10500, used: 4000, remaining: 6500 },
  { id: 10, name: '情報部門B', departmentId: 5, budget: 10500, used: 3000, remaining: 7500 },
  { id: 11, name: '総務部門A', departmentId: 6, budget: 11500, used: 2000, remaining: 9500 },
  { id: 12, name: '総務部門B', departmentId: 6, budget: 11500, used: 2500, remaining: 9000 },
];

const items: Item[] = [
  { id: 1, name: '物品A', divisionId: 1, budget: 5000, used: 1000, remaining: 4000 },
  { id: 2, name: '物品B', divisionId: 1, budget: 5000, used: 500, remaining: 4500 },
  { id: 3, name: '物品C', divisionId: 2, budget: 5000, used: 2000, remaining: 3000 },
  { id: 4, name: '物品D', divisionId: 2, budget: 5000, used: 0, remaining: 5000 },
  { id: 5, name: '物品E', divisionId: 3, budget: 5000, used: 3000, remaining: 2000 },
  { id: 6, name: '物品F', divisionId: 3, budget: 5000, used: 500, remaining: 4500 },
  { id: 7, name: '物品G', divisionId: 4, budget: 5000, used: 2000, remaining: 3000 },
  { id: 8, name: '物品H', divisionId: 4, budget: 5000, used: 1500, remaining: 3500 },
  { id: 9, name: '物品I', divisionId: 5, budget: 5000, used: 4000, remaining: 1000 },
  { id: 10, name: '物品J', divisionId: 5, budget: 5000, used: 3000, remaining: 2000 },
  { id: 11, name: '物品K', divisionId: 6, budget: 5000, used: 1000, remaining: 4000 },
  { id: 12, name: '物品L', divisionId: 6, budget: 5000, used: 1500, remaining: 3500 },
  { id: 13, name: '物品M', divisionId: 7, budget: 5000, used: 3000, remaining: 2000 },
  { id: 14, name: '物品N', divisionId: 7, budget: 5000, used: 2000, remaining: 3000 },
  { id: 15, name: '物品O', divisionId: 8, budget: 5000, used: 1000, remaining: 4000 },
  { id: 16, name: '物品P', divisionId: 8, budget: 5000, used: 2500, remaining: 2500 },
  { id: 17, name: '物品Q', divisionId: 9, budget: 5000, used: 4000, remaining: 1000 },
  { id: 18, name: '物品R', divisionId: 9, budget: 5000, used: 3000, remaining: 2000 },
  { id: 19, name: '物品S', divisionId: 10, budget: 5000, used: 1000, remaining: 4000 },
  { id: 20, name: '物品T', divisionId: 10, budget: 5000, used: 2500, remaining: 2500 },
  { id: 21, name: '物品U', divisionId: 11, budget: 5000, used: 4000, remaining: 1000 },
  { id: 22, name: '物品V', divisionId: 11, budget: 5000, used: 3000, remaining: 2000 },
  { id: 23, name: '物品W', divisionId: 12, budget: 5000, used: 1000, remaining: 4000 },
  { id: 24, name: '物品X', divisionId: 12, budget: 5000, used: 2500, remaining: 2500 },
];

export const fetchDepartments = async (): Promise<Department[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(departments);
    });
  });
};

export const fetchDivisions = async (departmentId: number): Promise<Division[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(divisions.filter((division) => division.departmentId === departmentId));
    });
  });
};

export const fetchItems = async (divisionId: number): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(items.filter((item) => item.divisionId === divisionId));
    });
  });
};
