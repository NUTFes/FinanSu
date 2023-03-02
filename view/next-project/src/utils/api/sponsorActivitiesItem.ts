import { SponsorActivitiesItem } from "../../type/common";

export const post = async (url: string, data: SponsorActivitiesItem) => {
    const sponsorID: number = data.sponsorID;
    const sponsorStyleID: number = data.sponsorStyleID;
    const userID: number = data.userID;
    const isDone: boolean = data.isDone;
    const postUrl =
        url +
        '?sponsorID=' +
        sponsorID +
        '&sponsorStyleID=' +
        sponsorStyleID +
        '&userID=' +
        userID +
        '&isDone=' +
        isDone;
    const res = await fetch(postUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
    return res;
};

export const put = async (url: string, data: SponsorActivitiesItem) => {
    const sponsorID: number = data.sponsorID;
    const sponsorStyleID: number = data.sponsorStyleID;
    const userID: number = data.userID;
    const isDone: boolean = data.isDone;
    const postUrl =
        url +
        '?sponsorID=' +
        sponsorID +
        '&sponsorStyleID=' +
        sponsorStyleID +
        '&userID=' +
        userID +
        '&isDone=' +
        isDone;
    const res = await fetch(postUrl, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
    return res;
};
