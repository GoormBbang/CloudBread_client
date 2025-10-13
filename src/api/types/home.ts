export interface UserInfoType {
  id: number;
  nickname: string;
  dueDate: number | null;
  profileImageUrl?: string;
}

export interface ThisWeekTipsType {
tips: ThisWeekTipType[];
week_number: number;
}

export interface ThisWeekTipType {
id:number;
kind:string;
title:string;
description:string;
}

