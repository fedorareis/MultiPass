import { Stack, Button, TextField } from "@mui/material";
import React from "react";
import { generateKeys } from "../../lib/generate";

function Enrollment() {
  return (
    <Stack
      component="form"
      alignItems="center"
      spacing={2}
      sx={{
        "& .MuiTextField-root": {
          m: 1.5,
          width: "25ch",
        },
        "& h2": {
          mt: 0,
          mb: 2,
        },
        "& h2, button": {
          m: 1,
        },
        gridRow: "1",
        gridColumn: "3 / 5",
        border: 1,
        p: 5,
        pt: 3,
        borderRadius: 10,
      }}
      autoComplete="on"
    >
      <h2>Register</h2>
      <TextField required id="name" label="Name" autoComplete="name" />
      <TextField
        required
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
      />
      <TextField
        required
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
      />
      <TextField
        required
        id="verify-password"
        label="Verify Password"
        type="password"
        autoComplete="new-password"
      />
      <Button
        variant="outlined"
        sx={{ display: "inline" }}
        onClick={async () => {
          console.debug(await generateKeys("password"));
        }}
      >
        Submit
      </Button>
    </Stack>
  );
}

export default Enrollment;
