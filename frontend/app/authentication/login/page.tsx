/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import "./Login.css";

import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Snackbar,
} from "@mui/material";
import MicrosoftIcon from "@mui/icons-material/Window";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import z from "zod";
import { useAppDispatch } from "@/utils/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/redux/authentication/auth.slice";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(8, "Password should be of 8 characters"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LinkedInSigninPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const showSnackbar = (message: string) => {
    setSnackbar({ open: true, message });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleLogin = async (data: LoginFormData) => {
    try {
      const { email, password } = data;

      const userData = {
        email: email,
        password: password,
      };

      const result = await dispatch(loginUser(userData)).unwrap();
      console.log(result);
      showSnackbar("User Logged In Successfully");

      setTimeout(() => router.push("/feed"), 500);
    } catch (e) {
      showSnackbar("Invalid Username Or Password");
    }
  };

  return (
    <>
      <Box className="signin-page-root">
        <Box className="top-logo">
          <Typography variant="h5" fontWeight="bold" className="signin-logo">
            Linked
            <span className="signin-logo-in">in</span>
          </Typography>
        </Box>

        <Container maxWidth="sm" sx={{ width: "30rem" }}>
          <Stack alignItems="center">
            <Box className="signin-card">
              <Stack spacing={2}>
                <Typography
                  variant="h4"
                  className="signin-title"
                  textAlign="center"
                >
                  Sign in
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<MicrosoftIcon />}
                  className="social-btn"
                >
                  Sign in with Microsoft
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FaApple />}
                  className="social-btn"
                >
                  Sign in with Apple
                </Button>

                <Typography className="terms-text">
                  By clicking Continue, you agree to LinkedIn’s
                  <span className="blue-link"> User Agreement</span>,
                  <span className="blue-link"> Privacy Policy</span>, and
                  <span className="blue-link"> Cookie Policy</span>.
                </Typography>

                <Divider>or</Divider>

                <form onSubmit={handleSubmit(handleLogin)}>
                  <Box>
                    <TextField
                      label="Email or phone"
                      fullWidth
                      variant="outlined"
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />

                    <Box sx={{ marginTop: "1.5rem" }}>
                      <FormControl fullWidth error={!!errors.password}>
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((p) => !p)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <FormHelperText>
                          {errors.password?.message}
                        </FormHelperText>
                      </FormControl>
                    </Box>

                    <Typography
                      sx={{ marginTop: "1.5rem" }}
                      className="blue-link"
                    >
                      Forgot password?
                    </Typography>

                    <FormControlLabel
                      sx={{ marginTop: "1rem" }}
                      control={<Checkbox defaultChecked />}
                      label="Keep me logged in"
                    />

                    <Button
                      sx={{ marginTop: "1rem" }}
                      type="submit"
                      fullWidth
                      variant="contained"
                      className="signin-btn"
                    >
                      Sign in
                    </Button>
                  </Box>
                </form>

                <Typography className="signin-text">
                  Don&apos;t have an Account?
                  <span
                    className="blue-link"
                    onClick={() => {
                      router.push("/authentication/signup");
                    }}
                  >
                    {" "}
                    Sign Up
                  </span>
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbar.message}
      />
    </>
  );
}
