import axios from "axios";

const URL = "http://localhost:8080";

export const loginApi = async (email, password) => {


    const response = await axios.post(`${URL}/api/auth/login`, { email: email, password: password });
    console.log(response)
    return response.data;
  }