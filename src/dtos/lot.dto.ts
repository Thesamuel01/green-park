export interface LotDTO extends LotAttrDTO {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LotAttrDTO {
  name: string;
  active: boolean;
}
