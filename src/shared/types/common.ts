export enum ButtonActions {
  MAKE_ORDER = 'ORDER',
  CANCEL_ORDER = 'CANCEL_ORDER',
  EDIT_ORDER = 'EDIT_ORDER',
  CONFIRM_ORDER = 'CONFIRM_ORDER',
  CANCEL_CURRENT_ORDER = 'CANCEL_CURRENT_ORDER',
  LOGIN_CLIENT = 'LOGIN_CLIENT',
  LOGIN_BUSINESS = 'LOGIN_BUSINESS',
  DESTROY_DATABASE = 'DESTROY_DATABASE',
  GET_CLIENT_ORDER_LIST = 'GET_CLIENT_ORDER_LIST',
  CLEAR_SESSION = 'CLEAR_SESSION',
  GET_TODAY_ORDER_LIST = 'GET_TODAY_ORDER_LIST',
  REGISTER_BUSINESS = 'REGISTER_BUSINESS',
  SELECT_ORDERS_TO_CANCEL = 'SELECT_ORDERS_TO_CANCEL',
  GET_CLIENT_ID = 'GET_CLIENT_ID',
  USER_EXIT = 'USER_EXIT',
  GET_NEXT_WORKDAY_ORDER_LIST = 'GET_NEXT_WORKDAY_ORDER_LIST',
  DEACTIVATE_BUSINESS = 'DEACTIVATE_BUSINESS',
  ACTIVATE_BUSINESS = 'ACTIVATE_BUSINESS',
  DELETE_BUSINESS = 'DELETE_BUSINESS',
  CREATE_TODAY_MENU = 'CREATE_TODAY_MENU',
  CREATE_NEXT_WORKDAY_MENU = 'CREATE_NEXT_WORKDAY_MENU',
}

export const RegexCallbacks = {
  ORDER: /^order-(\d+)$/,
  BUSINESS: /^business-(\d+)/,
  DELETE_BUSINESS: /^delete-business-(\d+)/,
  DEACTIVATE_BUSINESS: /^deactivate-business-(\d+)/,
  ACTIVATE_BUSINESS: /^activate-business-(\d+)/,
  GET_RECEIPT_BY_DATE:
    /^get-receipt-by-date-[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/,
};

export const RegexCallbacksKey = {
  ORDER: 'order-',
  BUSINESS: 'business-',
  DELETE_BUSINESS: 'delete-business-',
  DEACTIVATE_BUSINESS: 'deactivate-business-',
  ACTIVATE_BUSINESS: 'activate-business-',
  GET_RECEIPT_BY_DATE: 'get-receipt-by-date-',
};

export interface ContextSession {
  order: ContextOrder;
  login: ContextLogin;
  message: ContextMessage;
  menu: ContextMenu;
}

export interface OrderData {
  company: OrderCompany;
  food: string;
  date: string;
  photo: string;
}

export type OrderStep = 'company' | 'food' | 'date' | 'photo';

export interface OrderCompany {
  id: number | null;
  name: string;
}

export interface ContextOrder {
  data: OrderData;
  step: OrderStep | null;
}

export type LoginType = 'business' | 'business_register' | 'client';
export type LoginStep = 'name' | 'username' | 'password';
export interface LoginUser {
  id: string;
  name: string;
  password?: string;
}

export interface ContextLogin {
  type: LoginType | null;
  step: LoginStep | null;
  user: LoginUser;
  isUserLoggedIn: boolean;
}

export interface ContextPhotoMessage {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
}

export const availableCommands = <const>['start', 'list'];
export type AvailableCommands = (typeof availableCommands)[number];

export interface ContextMessage {
  id: number | null;
}

interface MenuData {
  text: string;
  date: string;
}

type MenuStep = 'text';
type MenuType = 'today' | 'nextWorkday';

export interface ContextMenu {
  data: MenuData;
  step: MenuStep | null;
  type: MenuType | null;
}
