import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCareInstruction } from 'apiSdk/care-instructions';
import { Error } from 'components/error';
import { careInstructionValidationSchema } from 'validationSchema/care-instructions';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlantInterface } from 'interfaces/plant';
import { getPlants } from 'apiSdk/plants';
import { CareInstructionInterface } from 'interfaces/care-instruction';

function CareInstructionCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CareInstructionInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCareInstruction(values);
      resetForm();
      router.push('/care-instructions');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CareInstructionInterface>({
    initialValues: {
      watering_frequency: 0,
      sunlight_requirements: '',
      soil_type: '',
      plant_id: (router.query.plant_id as string) ?? null,
    },
    validationSchema: careInstructionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Care Instruction
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="watering_frequency" mb="4" isInvalid={!!formik.errors?.watering_frequency}>
            <FormLabel>Watering Frequency</FormLabel>
            <NumberInput
              name="watering_frequency"
              value={formik.values?.watering_frequency}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('watering_frequency', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.watering_frequency && (
              <FormErrorMessage>{formik.errors?.watering_frequency}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="sunlight_requirements" mb="4" isInvalid={!!formik.errors?.sunlight_requirements}>
            <FormLabel>Sunlight Requirements</FormLabel>
            <Input
              type="text"
              name="sunlight_requirements"
              value={formik.values?.sunlight_requirements}
              onChange={formik.handleChange}
            />
            {formik.errors.sunlight_requirements && (
              <FormErrorMessage>{formik.errors?.sunlight_requirements}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="soil_type" mb="4" isInvalid={!!formik.errors?.soil_type}>
            <FormLabel>Soil Type</FormLabel>
            <Input type="text" name="soil_type" value={formik.values?.soil_type} onChange={formik.handleChange} />
            {formik.errors.soil_type && <FormErrorMessage>{formik.errors?.soil_type}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<PlantInterface>
            formik={formik}
            name={'plant_id'}
            label={'Select Plant'}
            placeholder={'Select Plant'}
            fetcher={getPlants}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'care_instruction',
  operation: AccessOperationEnum.CREATE,
})(CareInstructionCreatePage);
