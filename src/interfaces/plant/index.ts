import { CareInstructionInterface } from 'interfaces/care-instruction';
import { ReminderInterface } from 'interfaces/reminder';
import { ProviderInterface } from 'interfaces/provider';
import { GetQueryInterface } from 'interfaces';

export interface PlantInterface {
  id?: string;
  name: string;
  species: string;
  location?: string;
  growth_stage?: string;
  provider_id: string;
  created_at?: any;
  updated_at?: any;
  care_instruction?: CareInstructionInterface[];
  reminder?: ReminderInterface[];
  provider?: ProviderInterface;
  _count?: {
    care_instruction?: number;
    reminder?: number;
  };
}

export interface PlantGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  species?: string;
  location?: string;
  growth_stage?: string;
  provider_id?: string;
}
