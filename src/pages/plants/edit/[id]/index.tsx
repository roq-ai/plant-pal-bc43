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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPlantById, updatePlantById } from 'apiSdk/plants';
import { Error } from 'components/error';
import { plantValidationSchema } from 'validationSchema/plants';
import { PlantInterface } from 'interfaces/plant';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ProviderInterface } from 'interfaces/provider';
import { getProviders } from 'apiSdk/providers';

function PlantEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlantInterface>(
    () => (id ? `/plants/${id}` : null),
    () => getPlantById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PlantInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePlantById(id, values);
      mutate(updated);
      resetForm();
      router.push('/plants');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PlantInterface>({
    initialValues: data,
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
            Edit Plant
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
              <Input
                type="text"
                name="growth_stage"
                value={formik.values?.growth_stage}
                onChange={formik.handleChange}
              />
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'plant',
  operation: AccessOperationEnum.UPDATE,
})(PlantEditPage);
