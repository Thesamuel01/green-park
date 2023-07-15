import { type LotDTO, type LotAttrDTO } from '../dtos';
import { type Repository } from '.';
import { type Lot } from '../database/models/Lot.model';

export type LotKeys = keyof Lot & keyof LotAttrDTO;

export interface LotRepositoryInterface
  extends Repository<LotAttrDTO, LotDTO, LotKeys> {}
