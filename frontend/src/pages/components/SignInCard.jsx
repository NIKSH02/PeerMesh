import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  margin: theme.spacing(8),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  
  const [username, setUsernaem] = React.useState();
  const [password, setPassword] = React.useState();
  const [name, setName] = React.useState();

  const [formState, setFormState] = React.useState(0); // 0 for signin and 1 for signup

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    if (emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  // const validateInputs = () => {
  //   const email = document.getElementById('email');
  //   const password = document.getElementById('password');

  //   let isValid = true;

  //   if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
  //     setEmailError(true);
  //     setEmailErrorMessage('Please enter a valid email address.');
  //     isValid = false;
  //   } else {
  //     setEmailError(false);
  //     setEmailErrorMessage('');
  //   }

  //   if (!password.value || password.value.length < 6) {
  //     setPasswordError(true);
  //     setPasswordErrorMessage('Password must be at least 6 characters long.');
  //     isValid = false;
  //   } else {
  //     setPasswordError(false);
  //     setPasswordErrorMessage('');
  //   }

  //   return isValid;
  // };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        {formState === 0 ? 'Sign in' : 'Sign up'} 
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        {formState == 1 && <FormControl>
          <FormLabel htmlFor="email">Full Name</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="naem"
            type="name"
            name="name"
            placeholder="John Doe"
            autoComplete="name"
            autoFocus
            required
            fullWidth
            variant="outlined"
            onChange={(e) => setName(e.target.value)}
            color={emailError ? 'error' : 'primary'}
          />
        </FormControl> }
        <FormControl>
          <FormLabel htmlFor="email">Username</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="username"
            type="username"
            name="username"
            placeholder="@john_doe"
            autoComplete="username"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? 'error' : 'primary'}
            onChange={(e) => setUsernaem(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'baseline' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
            color={passwordError ? 'error' : 'primary'}
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        {formState == 0 ? 
          <Button type="submit" fullWidth variant="contained" >
            Sign in
          </Button> 
        :
         <Button type="submit" fullWidth variant="contained" >
            Sign up
          </Button> }
        <Typography sx={{ textAlign: 'center' }}>
          {formState == 0 ? `Don't` : "Already"} have an account?{' '}
          <span>
            <Link
              href="/material-ui/getting-started/templates/sign-in/"
              variant="body2"
              sx={{ alignSelf: 'center' }}
              onClick={(e) => {
                e.preventDefault();
                setFormState((prev) => (prev === 0 ? 1 : 0));
              }}
            >
              {formState == 0 ?  "Sign up" : "Sign In"}
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider></Divider>
      {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Google')}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Facebook')}
          startIcon={<FacebookIcon />}
        >
          Sign in with Facebook
        </Button>
      </Box> */}
    </Card>
  );
}