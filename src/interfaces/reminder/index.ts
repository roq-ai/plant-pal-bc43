import { PlantInterface } from 'interfaces/plant';
import { GetQueryInterface } from 'interfaces';

export interface ReminderInterface {
  id?: string;
  type: string;
  date: any;
  plant_id: string;
  created_at?: any;
  updated_at?: any;

  plant?: PlantInterface;
  _count?: {};
}

export interface ReminderGetQueryInterface extends GetQueryInterface {
  id?: string;
  type?: string;
  plant_id?: string;
}
