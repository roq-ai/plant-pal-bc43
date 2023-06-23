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
import { createPlant } from 'apiSdk/plants';
import { Error } from 'components/error';
import { plantValidationSchema } from 'validationSchema/plants';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ProviderInterface } from 'interfaces/provider';
import { getProviders } from 'apiSdk/providers';
import { PlantInterface } from 'interfaces/plant';

function PlantCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PlantInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPlant(values);
      resetForm();
      router.push('/plants');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PlantInterface>({
    initialValues: {
      name: '',
      species: '',
      location: '',
      growth_stage: '',
      provider_id: (router.query.provider_id as string) ?? null,
    },
    validationSchema: plantValidationSchema,
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
            Create Plant
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="species" mb="4" isInvalid={!!formik.errors?.species}>
            <FormLabel>Species</FormLabel>
            <Input type="text" name="species" value={formik.values?.species} onChange={formik.handleChange} />
            {formik.errors.species && <FormErrorMessage>{formik.errors?.species}</FormErrorMessage>}
          </FormControl>
          <FormControl id="location" mb="4" isInvalid={!!formik.errors?.location}>
            <FormLabel>Location</FormLabel>
            <Input type="text" name="location" value={formik.values?.location} onChange={formik.handleChange} />
            {formik.errors.location && <FormErrorMessage>{formik.errors?.location}</FormErrorMessage>}
          </FormControl>
          <FormControl id="growth_stage" mb="4" isInvalid={!!formik.errors?.growth_stage}>
            <FormLabel>Growth Stage</FormLabel>
            <Input type="text" name="growth_stage" value={formik.values?.growth_stage} onChange={formik.handleChange} />
            {formik.errors.growth_stage && <FormErrorMessage>{formik.errors?.growth_stage}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ProviderInterface>
            formik={formik}
            name={'provider_id'}
            label={'Select Provider'}
            placeholder={'Select Provider'}
            fetcher={getProviders}
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
  entity: 'plant',
  operation: AccessOperationEnum.CREATE,
})(PlantCreatePage);
