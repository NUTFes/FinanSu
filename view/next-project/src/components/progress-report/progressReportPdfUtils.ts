import type { SponsorshipActivity } from '@/generated/model';
import type {
  ActivityStyle,
  Invoice,
  InvoiceSponsorStyle,
  SponsorActivityView,
  SponsorStyle,
  SponsorStyleDetail,
} from '@/type/common';

const formatInvoiceStyleName = (style?: SponsorStyle) => {
  if (!style) return '協賛内容';
  return style.feature ? `${style.style}(${style.feature})` : style.style;
};

export const getActivityAmountFromApi = (activity: SponsorshipActivity): number => {
  return (
    activity.sponsorStyles
      ?.filter((link) => link.category === 'money')
      .reduce((sum, link) => sum + (link.style?.price ?? 0), 0) ?? 0
  );
};

const toCommonSponsorStyle = (activity: SponsorshipActivity, sponsorStyleId: number): SponsorStyle => {
  const matchedStyle = activity.sponsorStyles?.find((link) => link.sponsorStyleId === sponsorStyleId)?.style;

  return {
    id: matchedStyle?.id ?? sponsorStyleId,
    style: matchedStyle?.style ?? '協賛内容',
    feature: matchedStyle?.feature ?? '',
    price: matchedStyle?.price ?? 0,
  };
};

export const buildLegacySponsorActivityView = (
  activity: SponsorshipActivity,
): SponsorActivityView => {
  const styleDetail: SponsorStyleDetail[] = (activity.sponsorStyles ?? [])
    .filter((link) => link.category === 'money')
    .map((link, index) => {
    const sponsorStyleId = link.sponsorStyleId ?? index;
    const activityStyle: ActivityStyle = {
      id: link.id ?? index,
      activityID: activity.id ?? 0,
      sponsorStyleID: sponsorStyleId,
    };

    return {
      activityStyle,
      sponsorStyle: toCommonSponsorStyle(activity, sponsorStyleId),
    };
  });

  return {
    user: {
      id: activity.user?.id ?? 0,
      name: activity.user?.name ?? '',
      bureauID: activity.user?.bureauID ?? 0,
      roleID: activity.user?.roleID ?? 0,
      createdAt: activity.user?.createdAt ?? '',
      updatedAt: activity.user?.updatedAt ?? '',
    },
    sponsor: {
      id: activity.sponsor?.id ?? 0,
      name: activity.sponsor?.name ?? '',
      tel: activity.sponsor?.tel ?? '',
      email: activity.sponsor?.email ?? '',
      address: activity.sponsor?.address ?? '',
      representative: activity.sponsor?.representative ?? '',
    },
    sponsorActivity: {
      id: activity.id ?? 0,
      sponsorID: activity.sponsorId ?? activity.sponsor?.id ?? 0,
      userID: activity.userId ?? activity.user?.id ?? 0,
      isDone: false,
      feature: '',
      expense: 0,
      remark: activity.remarks ?? '',
      design: 0,
      url: '',
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    },
    styleDetail,
  };
};

export const buildInvoiceFromActivity = (activity: SponsorshipActivity): Invoice => {
  const invoiceSponsorStyle: InvoiceSponsorStyle[] = (activity.sponsorStyles ?? [])
    .filter((link) => link.category === 'money')
    .map((link) => ({
    styleName: formatInvoiceStyleName(
      link.style
        ? {
            id: link.style.id,
            style: link.style.style,
            feature: link.style.feature,
            price: link.style.price,
          }
        : undefined,
    ),
    price: link.style?.price ?? 0,
    quantity: 1,
    unitPrice: link.style?.price ?? 0,
  }));

  const totalPrice = getActivityAmountFromApi(activity);

  return {
    sponsorName: activity.sponsor?.name ?? '',
    managerName: activity.sponsor?.representative ?? '',
    totalPrice,
    fesStuffName: activity.user?.name ?? '',
    invoiceSponsorStyle,
    issuedDate: '',
    deadline: '',
    remark: '',
    subject: '技大祭企業協賛',
  };
};
