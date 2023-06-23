import { PlantInterface } from 'interfaces/plant';
import { GetQueryInterface } from 'interfaces';

export interface CareInstructionInterface {
  id?: string;
  watering_frequency: number;
  sunlight_requirements: string;
  soil_type: string;
  plant_id: string;
  created_at?: any;
  updated_at?: any;

  plant?: PlantInterface;
  _count?: {};
}

export interface CareInstructionGetQueryInterface extends GetQueryInterface {
  id?: string;
  sunlight_requirements?: string;
  soil_type?: string;
  plant_id?: string;
}
