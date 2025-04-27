declare module 'activecampaign' {
  interface ContactData {
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    [key: string]: any;
  }

  interface TagData {
    tag: string;
  }

  interface ContactTagData {
    contact: string | number;
    tag: string | number;
  }

  interface ContactListData {
    list: number;
    contact: string | number;
    status: number;
  }

  interface ListOptions {
    filters?: {
      email?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  interface RequestOptions {
    api: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
  }

  interface WebhookDeliveryOptions {
    limit?: number;
    event_type?: string;
    webhook_id?: number;
    success?: boolean;
  }

  class ActiveCampaign {
    constructor(options: { url: string; token: string });

    contact: {
      create: (data: ContactData) => Promise<any>;
      edit: (id: string | number, data: ContactData) => Promise<any>;
      listAll: (options?: ListOptions) => Promise<any>;
    };

    tag: {
      create: (data: TagData) => Promise<any>;
      listAll: (options?: any) => Promise<any>;
    };

    contactTag: {
      add: (data: ContactTagData) => Promise<any>;
    };

    contactList: {
      add: (data: ContactListData) => Promise<any>;
    };

    request: (options: RequestOptions) => Promise<any>;
  }

  export default ActiveCampaign;
}