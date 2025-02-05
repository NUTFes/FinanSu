// pages/mypage/mockData.ts
export type Status = '確認中...' | '封詰め' | '清算完了' | null;

export interface Item {
  name: string;
  budget: number | null;
  used: number;
  remaining: number | null;
  reporter: string | null;
  purchase_date: string | null;
  status: Status;
  subitems?: Item[];
}

export interface Department {
  department: string;
  items: Item[];
}

const mockData: Department[] = [
  {
    department: 'ビンゴ部門',
    items: [
      {
        name: 'ビンゴ景品',
        budget: 20000,
        used: 2000,
        remaining: 18000,
        reporter: null,
        purchase_date: null,
        status: null,
        subitems: [
          {
            name: 'ダンボール',
            budget: 15000,
            used: 2000,
            remaining: 13500,
            reporter: '技大太郎',
            purchase_date: '1/13',
            status: '確認中...',
          },
          {
            name: '景品',
            budget: 5000,
            used: 2000,
            remaining: 4500,
            reporter: '技大太郎',
            purchase_date: '1/13',
            status: '封詰め',
          },
          {
            name: '段ボール',
            budget: 5000,
            used: 2000,
            remaining: 4500,
            reporter: '技大太郎',
            purchase_date: '1/13',
            status: '清算完了',
          },
        ],
      },
      {
        name: '景品',
        budget: 50000,
        used: 4000,
        remaining: 46000,
        reporter: null,
        purchase_date: null,
        status: null,
        subitems: [
          {
            name: 'お菓子セット',
            budget: 30000,
            used: 2000,
            remaining: 28000,
            reporter: '技大太郎',
            purchase_date: '1/13',
            status: '清算完了',
          },
          {
            name: '文具セット',
            budget: 20000,
            used: 2000,
            remaining: 18000,
            reporter: '技大太郎',
            purchase_date: '1/13',
            status: '封詰め',
          },
        ],
      },
    ],
  },
  {
    department: 'ごはん部門',
    items: [
      {
        name: '食材',
        budget: 50000,
        used: 2000,
        remaining: 48000,
        reporter: null,
        purchase_date: null,
        status: null,
        subitems: [
          {
            name: 'お弁当',
            budget: 30000,
            used: 1500,
            remaining: 28500,
            reporter: '技大次郎',
            purchase_date: '1/14',
            status: '確認中...',
          },
          {
            name: 'お茶',
            budget: 20000,
            used: 500,
            remaining: 19500,
            reporter: '技大次郎',
            purchase_date: '1/14',
            status: '確認中...',
          },
        ],
      },
    ],
  },
];

export default mockData;
