// material
import { Box, Container, Typography } from "@mui/material";
// components
import Grid from '@mui/material/Grid';

import Page from "../../components/app/Page";

// ----------------------------------------------------------------------

export default function Dashboard() {
  return (
    <Page title="Condor app - admin">
      <Container maxWidth="xl"> 
        <Grid
          container
          spacing={32}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
        > 
          <Grid item xs={3}>
            <Box sx={{ pb: 8, m:8, mt:0, mb:0}}>
              <img src="/static/condor_p_a.png" width="1400" height="800"/>                        
            </Box> 
          </Grid>   
        </Grid> 
      </Container>
    </Page>
  );
}
