import { Component, SyntheticEvent } from "react";
import { Redirect } from "react-router-dom";
import DestinationsModel from "../../Model/DestinationsModel";
import jwtAxios from "../../Services/JwtAxios";
import "./AddDestination.css";
import Button from '@material-ui/core/Button';

interface AddDestinationState {
    destinationName: string,
    error: any,
    message: string,
    goBack: boolean
}

class AddDestination extends Component<{}, AddDestinationState > { 
    constructor(props: {}) {
        super(props)
        this.state=({ destinationName: "", error:null, message:"", goBack: false })
    }

    private destinationNameChanged = (e: SyntheticEvent) => {
        const destinationName = (e.target as HTMLInputElement).value;
        this.setState({destinationName: destinationName, error: null })
    }

    private addDestination = async () => {
        const destination = new DestinationsModel(0, this.state.destinationName);
        try {
            const response = await jwtAxios.post("http://localhost:4000/vacations/destination", destination);
            this.setState({error: null, message: response.data, goBack: true});           
        } catch (error: any) { 
            if (error.response.status===500) {
                this.setState({ error: error.response.data.message, destinationName: "" });
            }
            else {
                this.setState({ error: error.response.data, destinationName: "" });
            } 
        }
    }

    private goBack = () => {
        this.setState({goBack: true})
    }

    public render(): JSX.Element {
        return (
            <div className="AddDestination">
				<p>
                    <input type="text" placeholder="Add Destinamtion Name" onChange={this.destinationNameChanged} value={this.state.destinationName} />
                    <br/><span className="errorClass">{this.state.error?.destinationName}</span>
                </p>
                <Button variant="outlined" color="primary" onClick={this.addDestination}>Add Destination</Button> &nbsp;
                <Button variant="outlined" color="primary" onClick={this.goBack}>Back</Button> <br />
                <div className="errorClass">{(this.state.error && typeof(this.state.error)==="string") && this.state.error}</div>
                <div className="messageClass">{this.state.message && this.state.message}</div>
                {this.state.goBack && <Redirect to={"/vacation-management"} />}
            </div>
        );
    }
}

export default AddDestination;
