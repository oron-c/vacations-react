import axios from "axios";
import { Component, SyntheticEvent } from "react";
import { Redirect } from "react-router-dom";
import "./Login.css";
import Button from '@material-ui/core/Button';

interface LoginViewState {
    username:string;
    password:string;
    permission: string;
    userId: number,
    error: any
}

class Login extends Component<{}, LoginViewState> {

    constructor(props:{}) {
        super(props);
        this.state={username:"", password:"", permission:"", userId: 0, error: null};
    }

    public render(): JSX.Element {
        return (
            <div className="Login">
                <div className="LoginDiv">
                    <p>
                        <input placeholder="Username" onChange={this.usernameChanged} value={this.state.username} />
                        <br/><span className="errorClass">{this.state.error?.username}</span>
                    </p>
                    <p>
                        <input type="password" placeholder="Password" onChange={this.passwordChanged} value={this.state.password} />
                        <br/><span className="errorClass">{this.state.error?.password}</span>
                    </p>
                    <p>
                        <Button variant="outlined" color="primary" onClick={this.login}>Login</Button> <br />
                    </p>
                    <div className="errorClass">{(this.state.error && typeof(this.state.error)==="string") && this.state.error}</div>
                </div>
                {this.state.permission==='"admin"' && <Redirect to={"/vacation-management"}  /> } 
                {this.state.permission==='"user"' && <Redirect to={"/vacations"} /> }
            </div>
        );
    }

    private usernameChanged = (e: SyntheticEvent) => {
        const username = (e.target as HTMLInputElement).value;
        this.setState({ username, error: null });
    };

    private passwordChanged = (e: SyntheticEvent) => {
        const password = (e.target as HTMLInputElement).value;
        this.setState({ password, error: null });
    };

    private login = async (e: SyntheticEvent) => {
        
        try {
            const response = await axios.post("http://localhost:4000/users/login", { username: this.state.username, password: this.state.password })    
            localStorage["loginData"]= JSON.stringify(response.data);
            const permission = JSON.stringify(response.data.permission);
            this.setState({permission: permission, userId: response.data.userId, password: ""});             
            
        } catch (error: any) {
            if (error.response.status===500) {
                this.setState({ error: error.response.data.message, password: "" });
            }
            else {
                this.setState({ error: error.response.data, password: "" });
            }     
        }
        

    }
}

export default Login;
