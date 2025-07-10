import { Routes, Route } from "react-router-dom";
import SignUpForm from "./components/SignUpForm"
import SignInForm from "./components/SignInForm"

function App() {


  return (
  <Routes>
    <Route path="/" element={<SignUpForm />} />
    <Route path="/signIn" element={<SignInForm />} />
  </Routes>
  )
}

export default App
