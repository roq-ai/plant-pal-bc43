import * as yup from 'yup';

export const reminderValidationSchema = yup.object().shape({
  type: yup.string().required(),
  date: yup.date().required(),
  plant_id: yup.string().nullable().required(),
});
