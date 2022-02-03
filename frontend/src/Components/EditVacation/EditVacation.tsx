import { Component, SyntheticEvent } from "react";
import { Redirect } from "react-router-dom";
import DestinationsModel from "../../Model/DestinationsModel";
import VacationsModel from "../../Model/VacationsModel";
import jwtAxios from "../../Services/JwtAxios";
import SocketIoService from "../../Services/socket-io-service";
import "./EditVacation.css";
import Button from '@material-ui/core/Button';

interface EditVacationProps {
    match: {params: {id: string}}
}


interface EditVacationState {
    vacationId: number,
    destinations: DestinationsModel[],
    description: string,
    destinationId: number,
    image: any,
    dateStart: string,
    dateEnd: string,
    price: number,
    followers: number,
    error: any,
    message: string,
    goBack: boolean
}

class EditVacation extends Component<EditVacationProps, EditVacationState> {

    private SocketIoService = new SocketIoService();

    constructor(props: EditVacationProps) {
        super(props)
        this.state = ({
            vacationId: +props.match.params.id,
            destinations: [],
            description: "",
            destinationId: -1,
            image: "",
            dateStart: "",
            dateEnd: "",
            price: -1,
            followers: -1,
            error: null,
            message: "",
            goBack: false
        })
    }

    public componentDidMount = async () => {
        this.SocketIoService.connect();
        try {
            const response = await jwtAxios.get<VacationsModel>(`http://localhost:4000/vacations/id/${this.state.vacationId}`);
            const vacation = response.data;
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
            this.setState({
                description: vacation.description, destinationId: vacation.destinationId, image: vacation.image, dateStart: vacation.dateStart,
                dateEnd: vacation.dateEnd, price: vacation.price, followers: vacation.followers, error: null
            });
            

        } catch (error: any) {
            if (error.response.status===500) {
                this.setState({ error: error.response.data.message, message: "" });
            }
            else {
                this.setState({ error: error.response.data, message: "" });
            }
        }
    }
   
    public componentWillUnmount = () => {
        this.SocketIoService.disconnect();
    }

    public componentDidUpdate = async (prevProps: {}, prevState: EditVacationState) => {
        if (this.state.vacationId !== prevState.vacationId) {
            try {
                const response = await jwtAxios.get<VacationsModel>(`http://localhost:4000/vacations/id/${this.state.vacationId}`);
                const vacation = response.data;
                this.setState({
                    description: vacation.description, destinationId: vacation.destinationId, image: vacation.image, dateStart: vacation.dateStart,
                    dateEnd: vacation.dateEnd, price: vacation.price, followers: vacation.followers, error: null
                });

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

    public descriptionChanged = (e: SyntheticEvent) => {
        const description = (e.target as HTMLInputElement).value;
        this.setState({ description: description, error: null }) 
    }
    public destinationIdChanged = (e: SyntheticEvent) => {
        const destinationId = Number((e.target as HTMLInputElement).value);
        this.setState({ destinationId: destinationId, error: null })
    }
    public imageChanged = (e: SyntheticEvent) => {
        const image = (e.target as HTMLInputElement).files;
        this.setState({ image: image, error: null  })
    }
    public dateStartChanged = (e: SyntheticEvent) => {
        const dateStart = (e.target as HTMLInputElement).value;
        this.setState({ dateStart: dateStart, error: null  })
    }
    public dateEndChanged = (e: SyntheticEvent) => {
        const dateEnd = (e.target as HTMLInputElement).value;
        this.setState({ dateEnd: dateEnd, error: null  })
    }
    public priceChanged = (e: SyntheticEvent) => {
        const price = Number((e.target as HTMLInputElement).value);
        this.setState({ price: price, error: null  })
    }
    private addZeroToDate(num: number) {
        return num < 10 ? `0${num}` : num.toString();
    }

    private formatDate(dbDate: string) {
        const date = new Date(dbDate);
        const year = date.getFullYear(); 
        const month = this.addZeroToDate(date.getMonth() +1); 
        const day = this.addZeroToDate(date.getDate()); 
        return `${year}-${month}-${day}`;
    }

    public render(): JSX.Element {
        return (
            <div className="EditVacation">
                <h2>Edit vacation {this.state.vacationId}</h2>
                <p>
                    <p>
                        <input type="text" placeholder="description" onChange={this.descriptionChanged} value={this.state.description} />
                        <br/><span className="errorClass">{this.state.error?.description}</span>
                    </p>
                    <p> 
                        <select onChange={this.destinationIdChanged} value={this.state.destinationId}>
                            {this.state.destinations.map(d =>
                                <option key={d.destinationId} value={d.destinationId}>{d.destinationName}</option>
                            )}
                        </select>
                        <br/><span className="errorClass">{this.state.error?.destinationId && "Please select destination"}</span>
                    </p>
                    <p>
                        <input type="file" name="myImage" onChange={this.imageChanged}/> 
                        <br/><span className="errorClass">{this.state.error?.image}</span>
                    </p>
                    <p>
                        <input type="date" placeholder="dateStart" onChange={this.dateStartChanged} value={this.formatDate(this.state.dateStart)}/> 
                        <br/><span className="errorClass">{this.state.error?.dateStart}</span>
                    </p>
                    <p>
                        <input type="date" placeholder="dateEnd" onChange={this.dateEndChanged} value={this.formatDate(this.state.dateEnd)} />
                        <br/><span className="errorClass">{this.state.error?.dateEnd}</span>
                    </p>
                    <p>
                        <input type="number" placeholder="price" onChange={this.priceChanged} value={this.state.price} />
                        <br/><span className="errorClass">{this.state.error?.price}</span>
                    </p>
                    <Button variant="outlined" color="primary"  onClick={this.saveVacationChanges}>Save</Button> &nbsp;
                    <Button variant="outlined" color="primary"  onClick={this.goBack}>Back</Button> <br />
                    <div className="errorClass"> 
                    {(this.state.error && typeof(this.state.error)==="string") && this.state.error}</div>   
                    <div className="messageClass">{this.state.message && this.state.message}</div>                 
                </p>
                {this.state.goBack && <Redirect to={"/vacation-management"} />} 
            </div>
        );
    }

    private goBack = () => {
        this.setState({goBack: true})
    }

    public saveVacationChanges = async () => {
        if((this.state.dateStart && this.state.dateEnd) && (this.state.dateStart > this.state.dateEnd)){
            this.setState({message: "ERROR: The start date can not be greater than end date", error: null});  
        }
        else {
            const vacation = new VacationsModel(
            this.state.vacationId,
            this.state.description,
            this.state.destinationId,
            this.state.image[0] ? this.state.image[0].name : this.state.image,
            this.state.dateStart,
            this.state.dateEnd,
            this.state.price,
            this.state.followers,
            "");
            
        try {
            const response = await jwtAxios.put(`http://localhost:4000/vacations/${this.state.vacationId}/`, vacation);   
            try {
                let image;
                this.state.image[0] ? image = this.state.image[0] : image = this.state.image
                const myFormData = new FormData();
                myFormData.append("image", image);
                await jwtAxios.post("http://localhost:4000/vacations/image/new", myFormData);            
            } catch (error: any) { 
                if (error.response.status===500) {
                    this.setState({ error: error.response.data.message, message: "" });
                }
                else {
                    this.setState({ error: error.response.data, message: "" });
                }
            }  
            this.SocketIoService.send(vacation); 
            this.setState({message: response.data, error: null, goBack: true});     
                                
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

export default EditVacation;
