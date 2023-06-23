import * as yup from 'yup';

export const careInstructionValidationSchema = yup.object().shape({
  watering_frequency: yup.number().integer().required(),
  sunlight_requirements: yup.string().required(),
  soil_type: yup.string().required(),
  plant_id: yup.string().nullable().required(),
});
