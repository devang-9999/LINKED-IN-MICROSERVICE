"use client";

import "./LinkedInLandingPage.css";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Window";
import ArticleIcon from "@mui/icons-material/ArticleOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutline";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import WorkIcon from "@mui/icons-material/WorkOutline";
import ExtensionIcon from "@mui/icons-material/ExtensionOutlined";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { useRouter } from "next/navigation";

const HERO_IMAGE_PATH =
  "https://media.licdn.com/dms/image/v2/D5612AQGEVD1mv1e6RA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1684954432323?e=2147483647&v=beta&t=8YTcE8rRXjCwqy4c_3_jPU1g-vfjY0Jhd2jr_03AjcY";

export default function LinkedInLandingPage() {
  const router = useRouter();

  const goLogin = () => router.push("/authentication/login");
  const goSignup = () => router.push("/authentication/signup");

  const googleAuth = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const microsoftAuth = () => {
    window.location.href = "http://localhost:5000/auth/microsoft";
  };

  return (
    <Box className="page-root">
      <Box className="header-root">
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" py={2}>
            <Typography variant="h6" className="logo-text">
              Linked
              <Box component="span" className="logo-in">
                in
              </Box>
            </Typography>

            <Stack direction="row" alignItems="center" spacing={4}>
              <Stack direction="row" spacing={4}>
                <Stack alignItems="center" spacing={0.5} className="nav-item">
                  <Box className="nav-icon">
                    <ArticleIcon />
                  </Box>
                  <Typography className="nav-label">Articles</Typography>
                </Stack>

                <Stack alignItems="center" spacing={0.5} className="nav-item">
                  <Box className="nav-icon">
                    <PeopleIcon />
                  </Box>
                  <Typography className="nav-label">People</Typography>
                </Stack>

                <Stack alignItems="center" spacing={0.5} className="nav-item">
                  <Box className="nav-icon">
                    <SchoolIcon />
                  </Box>
                  <Typography className="nav-label">Learning</Typography>
                </Stack>

                <Stack alignItems="center" spacing={0.5} className="nav-item">
                  <Box className="nav-icon">
                    <WorkIcon />
                  </Box>
                  <Typography className="nav-label">Jobs</Typography>
                </Stack>

                <Stack alignItems="center" spacing={0.5} className="nav-item">
                  <Box className="nav-icon">
                    <ExtensionIcon />
                  </Box>
                  <Typography className="nav-label">Games</Typography>
                </Stack>

                <Stack alignItems="center" spacing={0.5} className="nav-item">
                  <Box className="nav-icon">
                    <PhoneIphoneIcon />
                  </Box>
                  <Typography className="nav-label">Get the app</Typography>
                </Stack>
              </Stack>

              <Box className="nav-divider" />

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" className="btn-signin" onClick={goLogin}>
                  Sign in
                </Button>
                <Button variant="contained" className="btn-join" onClick={goSignup}>
                  Join now
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container>
        <Grid container alignItems="center" className="hero-root" sx={{ width: "79vw", marginLeft: "-100px" }}>
          <Grid>
            <Box className="hero-left">
              <Typography variant="h4" className="hero-title" sx={{ marginBottom: "3rem" }}>
                Welcome to your professional community
              </Typography>

              <Stack spacing={2}>
                <Button fullWidth startIcon={<GoogleIcon />} variant="contained" className="btn-primary" onClick={googleAuth}>
                  Continue with Google
                </Button>

                <Button fullWidth startIcon={<MicrosoftIcon />} variant="outlined" className="btn-outline" onClick={microsoftAuth}>
                  Continue with Microsoft
                </Button>

                <Button fullWidth variant="outlined" className="btn-outline" sx={{ marginBottom: "3rem" }} onClick={goLogin}>
                  Sign in with email
                </Button>

                <Typography className="terms-text">
                  By clicking Continue to join or sign in, you agree to LinkedIn&apos;s User Agreement, Privacy Policy, and Cookie Policy.
                </Typography>

                <Typography className="join-text">
                  New to LinkedIn?
                  <span className="join-link" style={{ cursor: "pointer" }} onClick={goSignup}>
                    {" "}Join now
                  </span>
                </Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid sx={{ marginLeft: "4rem" }}>
            <Box className="hero-image-wrap">
              <Box component="img" src={HERO_IMAGE_PATH} alt="Hero" className="hero-image" sx={{ width: "60rem" }} />
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box className="feature-section">
        <Container sx={{ justifyContent: "center", maxWidth: "70rem" }}>
          <Grid container alignItems="center" spacing={6} mb={10}>
            <Grid sx={{ marginLeft: "13rem" }}>
              <Typography variant="h6" className="feature-title">
                Let the right people know you are open to work
              </Typography>

              <Typography className="feature-desc">
                With the Open To Work feature, you can privately tell recruiters or publicly share with the LinkedIn community that you are looking for new job opportunities.
              </Typography>
            </Grid>

            <Grid>
              <Box className="feature-image-circle">
                <Box component="img" src="/3.svg" alt="Feature" className="feature-circle-img" />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={6} justifyContent="center">
            <Grid textAlign="center">
              <Box className="feature-illustration">
                <Box component="img" src="/2.svg" alt="Learn" className="feature-img" />
              </Box>
              <Typography className="feature-card-title">
                Connect with people who can help
              </Typography>
              <Button variant="outlined" className="feature-btn">
                Find people you know
              </Button>
            </Grid>

            <Grid textAlign="center">
              <Box className="feature-illustration">
                <Box component="img" src="/1.svg" alt="Connect" className="feature-img" />
              </Box>
              <Typography className="feature-card-title">
                Learn the skills you need to succeed
              </Typography>
              <Button variant="outlined" className="feature-btn">
                Choose a topic to learn about
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box className="join-banner">
        <Container maxWidth="lg">
          <Typography className="join-banner-title">
            Join your colleagues, classmates, and friends on LinkedIn
          </Typography>

          <Button variant="contained" className="join-banner-btn" onClick={goSignup}>
            Get started
          </Button>
        </Container>

        <Box className="city-image-placeholder">
          <Box component="img" src="/Footer.png" alt="City" className="city-banner-img" />
        </Box>
      </Box>

      <Box className="footer-nav">
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ marginLeft: "20rem" }}>
            <Grid>
              <Typography className="footer-title">General</Typography>
              <Typography className="footer-link">Sign Up</Typography>
              <Typography className="footer-link">Help Center</Typography>
              <Typography className="footer-link">About</Typography>
              <Typography className="footer-link">Careers</Typography>
            </Grid>

            <Grid>
              <Typography className="footer-title">Browse LinkedIn</Typography>
              <Typography className="footer-link">Learning</Typography>
              <Typography className="footer-link">Jobs</Typography>
              <Typography className="footer-link">Games</Typography>
            </Grid>

            <Grid>
              <Typography className="footer-title">Business Solutions</Typography>
              <Typography className="footer-link">Talent</Typography>
              <Typography className="footer-link">Marketing</Typography>
              <Typography className="footer-link">Sales</Typography>
            </Grid>

            <Grid>
              <Typography className="footer-title">Directories</Typography>
              <Typography className="footer-link">Members</Typography>
              <Typography className="footer-link">Jobs</Typography>
              <Typography className="footer-link">Companies</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box className="footer-bottom">
        LinkedIn © 2026 · About · Accessibility · User Agreement · Privacy Policy · Cookie Policy
      </Box>
    </Box>
  );
}