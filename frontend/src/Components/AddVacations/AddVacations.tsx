import { Component, SyntheticEvent } from "react";
import { Redirect } from "react-router-dom";
import DestinationsModel from "../../Model/DestinationsModel";
import VacationsModel from "../../Model/VacationsModel";
import jwtAxios from "../../Services/JwtAxios";
import SocketIoService from "../../Services/socket-io-service";
import "./AddVacations.css";
import Button from '@material-ui/core/Button';

interface AddVacationsState {
    description: string,
    destinationId: number,
    image: any,
    dateStart: string,
    dateEnd: string,
    price: number,
    followers: number,
    error: any,
    message: string, 
    destinations: DestinationsModel[],
    goBack: boolean
}

class AddVacations extends Component<{}, AddVacationsState> {

    private SocketIoService = new SocketIoService();

    constructor(props: {}) {
        super(props)
        this.state = ({
            description: "",
            destinationId: -1,
            image: "",
            dateStart: "",
            dateEnd: "",
            price: 0,
            followers: 0,
            error: null,
            message: "",
            destinations: [],
            goBack: false
        })
    }

    public componentDidMount = async () => {
        this.SocketIoService.connect();
        try {
            const response = await jwtAxios.get<DestinationsModel[]>(`http://localhost:4000/vacations/destinations/all`);
            const destinations = response.data;
            this.setState({ destinations: destinations });

        } catch (error: any) {
            if (error.response.status===500) {
                this.setState({ error: error.response.data.message });
            }
            else {
                this.setState({ error: error.response.data });
            }
        }
    }
  
    public componentWillUnmount = () => {
        this.SocketIoService.disconnect();
    }

    public descriptionChanged = (e: SyntheticEvent) => {
        const description = (e.target as HTMLInputElement).value;
        this.setState({ description: description })
    }
    public destinationIdChanged = (e: SyntheticEvent) => {
        const destinationId = Number((e.target as HTMLInputElement).value);
        this.setState({ destinationId: destinationId })
    }
    public imageChanged = (e: SyntheticEvent) => {
        const image = (e.target as HTMLInputElement).files;
        this.setState({ image: image })
    }
    public dateStartChanged = (e: SyntheticEvent) => {
        const dateStart = (e.target as HTMLInputElement).value;
        this.setState({ dateStart: dateStart })
    }
    public dateEndChanged = (e: SyntheticEvent) => {
        const dateEnd = (e.target as HTMLInputElement).value;
        this.setState({ dateEnd: dateEnd })
    }
    public priceChanged = (e: SyntheticEvent) => {
        const price = Number((e.target as HTMLInputElement).value);
        this.setState({ price: price })
    }

    public render(): JSX.Element {
        return (
            <div className="AddVacations">
                <h2>Add new vacation</h2>
                <p>
                    <p>
                        <input type="text" placeholder="description" onChange={this.descriptionChanged} value={this.state.description} /> 
                        <br/><span className="errorClass">{this.state.error?.description}</span>
                    </p>
                    <p>
                        <select onChange={this.destinationIdChanged} value={this.state.destinationId}>
                            <option key={0} value={0}>Select Destination</option>
                            {this.state.destinations.map(d =>
                                <option key={d.destinationId} value={d.destinationId}>{d.destinationName}</option>
                            )}
                        </select> 
                        <br/><span className="errorClass">{this.state.error?.destinationId && "Please select destination"}</span>
                    </p>
                    <p>
                        <input type="file" name="myImage" onChange={this.imageChanged} /> 
                        <br/><span className="errorClass">{this.state.error?.image}</span>
                    </p> 
                    <p>
                        <input type="date" placeholder="dateStart" onChange={this.dateStartChanged} /> 
                        <br/><span className="errorClass">{this.state.error?.dateStart}</span>
                    </p>
                    <p>
                        <input type="date" placeholder="dateEnd" onChange={this.dateEndChanged} /> 
                        <br/><span className="errorClass">{this.state.error?.dateEnd}</span>
                    </p>
                    <p>
                        <input type="number" placeholder="price" onChange={this.priceChanged} value={this.state.price} />  
                        <br/><span className="errorClass">{this.state.error?.price}</span>
                    </p>
                    <Button variant="outlined" color="primary" onClick={this.saveVacationChanges}>Save</Button> &nbsp;
                    <Button variant="outlined" color="primary" onClick={this.goBack}>Back</Button> <br />
                    <div className="errorClass">                        
                        {(this.state.error && typeof(this.state.error)==="string") && this.state.error}
                    </div>
                    <div className="messageClass">{this.state.message && this.state.message}</div>
                </p>
                {this.state.goBack && <Redirect to={"/vacation-management"} />}
            </div>
        );
    }

    public goBack = () => {
        this.setState({goBack: true})
    }

    public saveVacationChanges = async () => {
        if((this.state.dateStart && this.state.dateEnd) && (this.state.dateStart > this.state.dateEnd)){
            this.setState({message: "ERROR: The start date can not be greater than end date", error: null}); 
        }
        else {
        const vacation = new VacationsModel(
            0,
            this.state.description,
            this.state.destinationId,
            this.state.image[0] && this.state.image[0].name,
            this.state.dateStart,
            this.state.dateEnd,
            this.state.price,
            this.state.followers,
            "");
            
        try {
            const response = await jwtAxios.post(`http://localhost:4000/vacations/`, vacation);   
            try {
                const myFormData = new FormData();
                myFormData.append("image", this.state.image[0]);
                await jwtAxios.post("http://localhost:4000/vacations/image/new", myFormData);  
                this.SocketIoService.send(vacation);  
                this.setState({goBack: true})           
            } catch (error: any) {
                if (error.response.status===500) {
                    this.setState({ error: error.response.data.message, message: "" });
                }
                else {
                    this.setState({ error: error.response.data, message: "" });
                }
            }    
            this.setState({message: response.data, error: null});                  
        } catch (error: any) {
            if (error.response.status===500) {
                this.setState({ error: error.response.data.message, message: "" });
            }
            else {
                this.setState({ error: error.response.data, message: "" });
            }  
        }

    }
}
}

export default AddVacations;
