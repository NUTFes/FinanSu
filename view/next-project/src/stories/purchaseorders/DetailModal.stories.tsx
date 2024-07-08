import { Meta, StoryFn } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { DetailModal, ModalProps } from '@components/purchaseorders/';

const meta: Meta = {
  title: 'FinanSu/purchaseorders/DetailModal',
  component: DetailModal,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    // 特定のPropsに対する設定が必要な場合はここに追加
  },
};

export default meta;

const Template: StoryFn<typeof ModalProps> = (args) => <DetailModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  id: '123',
  purchaseOrderViewItem: {
    purchaseOrder: {
      id: 123, // 適切なidを設定
      expenseID: 123, // 必要に応じて調整
      userID: 123,
      deadline: '20240907',
      financeCheck: false,
    },
    purchaseItem: [
      {
        id: 123,
        item: 'ポストイット 黄色',
        price: 6000,
        purchaseOrderID: 123,
        quantity: 20,
        detail: '衛生物品仕分けのため',
        url: 'https://www.amazon.co.jp/%E3%83%9D%E3%82%B9%E3%83%88%E3%82%A4%E3%83%83%E3%83%88-%E3%82%A4%E3%82%A8%E3%83%AD%E3%83%BC-75%C3%9775mm-90%E6%9E%9A%C3%9710%E3%83%91%E3%83%83%E3%83%89-6541SS-Y/dp/B09RMQKJL5/ref=sr_1_3?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=D6173OMOUM5T&dib=eyJ2IjoiMSJ9.27UQkXbp5c3HOdcXxqY7y8lurZZ2fWRkOsTe3OnG9yGEzulWe80kR9f3dwtbRl6_CE91H4xyd9cw4A0qjVXWE9aQI65uLFf6162PSTVYxTCbckLGNZPyXrt6Qs62tpZDweOBdMPnxJnOBCeATox63FfN7ax4wTVS2xozWVR473JM-BgA_PEq6nZW9gKeavZv91Gxw4bVVpD9wFZ9AXw_fgI3Ntdvd1EoDyU7BgsWJD0.4_nNNIuZNJGWWjvn8p7uJcf8OKpkc2pj-rnFj15ePl0&dib_tag=se&keywords=%E3%83%9D%E3%82%B9%E3%83%88%E3%82%A4%E3%83%83%E3%83%88+%E9%BB%84%E8%89%B2&qid=1720144913&s=instant-video&sprefix=%E3%83%9D%E3%82%B9%E3%83%88%E3%82%A4%E3%83%83%E3%83%88+%E9%BB%84%E8%89%B2,instant-video,173&sr=1-3',
        financeCheck: false,
      },
      {
        id: 124,
        item: 'ラミネートフィルム',
        price: 3000,
        quantity: 1,
        purchaseOrderID: 123,
        detail: 'ラミネート看板用の予備',
        url: 'https://www.amazon.co.jp/Bonsaii-100%CE%BCm%E3%83%95%E3%82%A3%E3%83%AB%E3%83%A0%E5%AF%BE%E5%BF%9C-%E8%A9%B0%E3%81%BE%E3%82%8A%E9%98%B2%E6%AD%A2%E3%83%AC%E3%83%90%E3%83%BC%E6%90%AD%E8%BC%89-%EF%BC%91%E5%88%86%E9%96%93400mm-%E3%82%AB%E3%83%BC%E3%83%89%E3%82%B5%E3%82%A4%E3%82%BA%E5%AF%BE%E5%BF%9C/dp/B07PHSX45C/ref=sr_1_2?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=1TFXLNS619SWR&dib=eyJ2IjoiMSJ9.mSiLkvsecGF8tVQLpUZmpVkeWWGAf2aCp-ngfpOXY3vIn1D002MPU2kg_LbRpel42f2kowuYQQWH_Jqa12PPmZTtPLa6gQczNGEKIIHcWZCA0ESPm4sCj36lBPcpV30TcQqCw5wFMFse8RzEns8wVOojZU69CHnt8oAapLYKPYFqLtj5nW1RX3Qp8TECj36Nap9b3Aw1yWYDlYOi9_63KkpWwtsRqBHiwJNqb7_vcwY.2krKINDdmAX-06jEu3patfEDv3oPFI32gzXBAwseXHY&dib_tag=se&keywords=%E3%83%A9%E3%83%9F%E3%83%8D%E3%83%BC%E3%83%88&qid=1720145001&s=instant-video&sprefix=%E3%83%A9%E3%83%9F%E3%83%8D%E3%83%BC%E3%83%88,instant-video,175&sr=1-2',
        financeCheck: true,
      },
    ], // 購入項目の配列、必要に応じて詳細を追加
    user: {
      id: 123,
      name: '窪坂駿吾',
      bureauID: 1,
      roleID: 2,
    },
  },
  expenses: [
    {
      id: 123,
      name: '総務局',
      totalPrice: 100,
      yearID: 1,
    },
  ],
  isDelete: false,
};
