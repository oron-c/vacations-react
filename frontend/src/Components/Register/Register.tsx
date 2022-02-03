import axios from "axios";
import { Component, SyntheticEvent } from "react";
import { Redirect } from "react-router-dom";
import RegistersModel from "../../Model/RegisterModel";
import "./Register.css";
import Button from '@material-ui/core/Button';

interface RegisterState {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    error: any,
    message: string,
    goBack: boolean
}

class Register extends Component<{}, RegisterState> {
    constructor(props: {}) {
        super(props);
        this.state = ({firstName: "", lastName: "", username: "", password: "", error: null, message: "", goBack: false})
    }
    
    private fNameChanged = (e: SyntheticEvent) => {
        const firstName = (e.target as HTMLInputElement).value;
        this.setState({ firstName, error: null });
    };

    private lNameChanged = (e: SyntheticEvent) => {
        const lastName = (e.target as HTMLInputElement).value;
        this.setState({ lastName, error: null });
    };
    
    private usernameChanged = (e: SyntheticEvent) => {
        const username = (e.target as HTMLInputElement).value;
        this.setState({ username, error: null });
    };

    private passwordChanged = (e: SyntheticEvent) => {
        const password = (e.target as HTMLInputElement).value;
        this.setState({ password, error: null });
    };

    private register = async () => {
        try {
            const newUser = new RegistersModel(
                this.state.username,
                this.state.password,
                this.state.firstName,
                this.state.lastName
            );           
            await axios.post("http://localhost:4000/users/register", newUser);

            try {
                const response = await axios.post("http://localhost:4000/users/login", { username: this.state.username, password: this.state.password })    
                localStorage["loginData"]= JSON.stringify(response.data);
                this.setState({message: `User ${newUser.username} was added`, error: null, firstName: "", lastName: "", username: "", password: "", goBack: true});          
                
            } catch (error: any) {
                if (error.response.status===500) {
                    this.setState({ error: error.response.data.message, password: "" });
                }
                else {
                    this.setState({ error: error.response.data, password: "" });
                }      
            }
                       
        } catch (error: any) { 
            if (error.response.status===500) { 
                this.setState({ error: error.response.data.message, message: "" });
            }
            else {
                this.setState({ error: error.response.data, message: "" });
            }            
        }
    }

    public render(): JSX.Element {
        return (
            <div className="Register">
                <p>
                    <input placeholder="First Name" onChange={this.fNameChanged} value={this.state.firstName} /> 
                    <br/><span className="errorClass">{this.state.error?.firstName}</span>
                </p>
                <p>
                    <input placeholder="Last Name" onChange={this.lNameChanged} value={this.state.lastName} />
                    <br/><span className="errorClass">{this.state.error?.lastName}</span>
                </p>
                <p>
                    <input placeholder="Username" onChange={this.usernameChanged} value={this.state.username} />
                    <br/><span className="errorClass">{this.state.error?.username}</span>
                </p>
                <p>
                    <input type="password" placeholder="Password" onChange={this.passwordChanged} value={this.state.password} />
                    <br/><span className="errorClass">{this.state.error?.password}</span>
                </p>
                <p>
                    <Button variant="outlined" color="primary" onClick={this.register}>Register</Button> <br /> 
                </p>
                <div className="errorClass">{(this.state.error && typeof(this.state.error)==="string") && this.state.error}</div> 
                <div className="messageClass">{this.state.message && this.state.message + ", please log-in"}</div>

                {this.state.goBack && <Redirect to="/vacations" />}
            </div>
        );
    }
}

export default Register;
