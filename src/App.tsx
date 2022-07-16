import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Enrollment from "./components/Enrollment/Enrollment";
import { Container } from "@mui/material";

function App() {
  return (
    <div className="App">
      <header>
        <h1>MultiPass</h1>
      </header>
      <main>
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
          }}
        >
          <Enrollment></Enrollment>
        </Container>
      </main>
    </div>
  );
}

export default App;
