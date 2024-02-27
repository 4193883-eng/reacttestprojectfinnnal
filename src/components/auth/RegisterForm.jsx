import {
    Stack,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Wrap,
    Alert,
    AlertIcon,
    ButtonGroup, useToast,
} from '@chakra-ui/react';
import {Link, useNavigate} from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { loginAction } from '../../redux/auth/authActions';
import { registerService } from '../../services/authServices';
import { useState } from 'react';
import InputField from '../InputField.jsx';

const validationSchema = yup.object().shape({
  username: yup
      .string()
      .min(3)
      .max(50, 'Username cannot be longer than 50')
      .required('Username is required'),
  password: yup.string().min(8).max(255).required('Password is required'),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

function RegisterForm() {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      setError(null);

      registerService(values)
          .then((data) => {
              dispatch(loginAction(data));
              navigate('/feed');
              toast({
                  title: 'Register successful!',
                  status: 'success',
              });
          })
          .catch((err) => setError(err.response.data.message))
          .finally(() => setIsLoading(false));
    },
  });

  return (
      <Stack as="form" onSubmit={formik.handleSubmit}>
        <InputField
            meta={formik.getFieldMeta('username')}
            label={'Username'}
            placeholder={'Username'}
            required={true}
            {...formik.getFieldProps('username')}
        />
        <InputField
            meta={formik.getFieldMeta('password')}
            label={'Password'}
            placeholder={'Password'}
            required={true}
            type={'password'}
            {...formik.getFieldProps('password')}
        />
        <ButtonGroup>
          <InputField
              meta={formik.getFieldMeta('firstName')}
              label={'First Name'}
              placeholder={'First Name'}
              required={true}
              {...formik.getFieldProps('firstName')}
          />
          <InputField
              meta={formik.getFieldMeta('lastName')}
              label={'Last Name'}
              placeholder={'Last Name'}
              required={true}
              {...formik.getFieldProps('lastName')}
          />
        </ButtonGroup>
        {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
        )}

        <Wrap>
          <Button colorScheme="blue" type="submit" isLoading={isLoading}>
            Register
          </Button>
          <Button as={Link} to="/login" variant="ghost">
            Login
          </Button>
        </Wrap>
      </Stack>
  );
}

export default RegisterForm;
