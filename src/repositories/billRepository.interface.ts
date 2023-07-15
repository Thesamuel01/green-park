import { type Bill } from '../database/models/Bill.model';
import { type BillDTO, type BillAttrDTO } from '../dtos';
import { type Repository } from '.';

export type BillKeys = keyof Bill & keyof BillAttrDTO;

export interface BillRepositoryInterface
  extends Repository<BillAttrDTO, BillDTO, BillKeys> {}
