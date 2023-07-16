export interface BillAllStr extends BillAttrDTO {
  id: number;
  recipientName: string;
  lotId: number;
  value: number;
  barcode: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BillDTO extends BillAttrDTO {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BillAttrDTO {
  recipientName: string;
  lotId: number;
  value: number;
  barcode: string;
  active: boolean;
}
