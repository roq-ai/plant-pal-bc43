import * as yup from 'yup';

export const plantValidationSchema = yup.object().shape({
  name: yup.string().required(),
  species: yup.string().required(),
  location: yup.string(),
  growth_stage: yup.string(),
  provider_id: yup.string().nullable().required(),
});
