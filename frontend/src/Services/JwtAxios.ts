import axios from "axios";

const jwtAxios = axios.create();

jwtAxios.interceptors.request.use(request => {

    if (localStorage.loginData) {
        const loginData=JSON.parse(localStorage.loginData)
        request.headers = {
            authorization: "Bearer " + loginData.token
        };        
    }
    
    return request;
});

export default jwtAxios;