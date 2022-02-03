import { Component } from "react";
import { Card } from "react-bootstrap";
import DestinationsModel from "../../Model/DestinationsModel";
import VacationsModel from "../../Model/VacationsModel";
import jwtAxios from "../../Services/JwtAxios";
import "./VacationManagement.css";
import SocketIoService from "../../Services/socket-io-service";
import { Redirect } from "react-router-dom";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { Grid } from "@material-ui/core";
import Button from '@material-ui/core/Button';

interface VacationsManagementState {
    vacation: VacationsModel[],
    response: string,
    error: [],
    changes: number,
    idToEdit: number,
    vacationId: number,
    description: string,
    destinationId: number,
    image: string,
    dateStart: Date,
    dateEnd: Date,
    price: number,
    followers: number,
    addVacation: number,
    addDestination: number,
    destinations: DestinationsModel[],
    goToGraph: number
}

class VacationManagement extends Component<{}, VacationsManagementState> {

    private SocketIoService = new SocketIoService();

    constructor(props: {}) {
        super(props)
        this.state = ({
            vacation: [], response: "", error: [], changes: 0, idToEdit: 0, vacationId: 0, description: "",
            destinationId: 0, image: "", dateStart: new Date('1900-01-01'), dateEnd: new Date('1900-01-01'), price: 0, followers: -1, addVacation: 0, addDestination: 0, destinations: [], goToGraph: 0
        })
    }

    public componentDidMount = async () => {
        this.SocketIoService.connect();
        this.SocketIoService.socket?.on("msg-from-server", vacationId => {
            this.setState({ changes: 1 })
        });
        try {
            const response = await jwtAxios.get<VacationsModel[]>("http://localhost:4000/vacations/all");
            const destinations = await jwtAxios.get<DestinationsModel[]>("http://localhost:4000/vacations/destinations/all")
            this.setState({ vacation: response.data, error: [], destinations: destinations.data });
        } catch (error: any) {
            if (error.response.status===500) {
                this.setState({ error: error.response.data.message, vacation: [] });
            }
            else {
                this.setState({ error: error.response.data, vacation: [] });
            }
        }
    }

    public componentWillUnmount = () => {
        this.SocketIoService.disconnect();
    }

    public componentDidUpdate = async (prevProps: {}, prevState: VacationsManagementState) => {
        if (this.state.changes !== prevState.changes && this.state.changes !== 0) {
            try {
                const response = await jwtAxios.get<VacationsModel[]>("http://localhost:4000/vacations/all");
                this.setState({ vacation: response.data, error: [] });
            } catch (error: any) {
                if (error.response.status===500) {
                    this.setState({ error: error.response.data.message, vacation: [] });
                }
                else {
                    this.setState({ error: error.response.data, vacation: [] });
                }
            }
            this.setState({ changes: 0 })
        }
    }

    public edit = (vacationId: number) => {
        this.setState({ idToEdit: vacationId, addVacation: 0, addDestination: 0 });
    }

    public remove = async (vacationId: number) => {
        try {
            const response = await jwtAxios.delete(`http://localhost:4000/vacations/${vacationId}`);
            this.setState({ response: response.data, changes: 1 });
            alert(this.state.response);

            const deleteThisVacation = this.state.vacation.find(v => v.vacationId === vacationId);
            if (deleteThisVacation) {
                this.SocketIoService.send(deleteThisVacation);
            }
            this.reRender();
        } catch (error: any) {
            if (error.response.status===500) {
                this.setState({ error: error.response.data.message, vacation: [], changes: 0 });
            }
            else {
                this.setState({ error: error.response.data, vacation: [], changes: 0 });
            }
        }
    }

    private addZeroToDate(num: number) {
        return num < 10 ? `0${num}` : num.toString();
    }

    private formatDate(dbDate: string) {
        const date = new Date(dbDate);
        const year = date.getFullYear();
        const month = this.addZeroToDate(date.getMonth() + 1);
        const day = this.addZeroToDate(date.getDate());
        return `${day}/${month}/${year}`;
    }

    public render(): JSX.Element {
        return (
            <div className="VacationManagement">
                <h2>Welcome Admin!</h2>
                
                {this.state.error.length > 0 ?
                    <p className="errorClass">{this.state.error}</p> :
                

                <div>
                <p className="goToGraph">
                    <Button variant="outlined" color="primary" onClick={this.addVacation}>Add Vacation</Button> 
                    <Button variant="outlined" color="primary" onClick={this.addDestination}>Add Destination</Button> 
                    <Button variant="outlined" color="primary" onClick={()=>{this.setState( {goToGraph: 1 })}}>Go to Graph</Button>
                </p> 

                {this.state.vacation &&
                    <Grid container className="grid-container">
                        {this.state.vacation.map(v =>
                            <Card className="cardManagement" key={v.vacationId}>
                                <Card.Header>
                                    {v.destinationName}
                                </Card.Header>
                                <Card.Title>{this.formatDate(v.dateStart)} - {this.formatDate(v.dateEnd)}</Card.Title>
                                <Card.Text className="cardText">
                                    {v.description}   
                                </Card.Text>
                                ${v.price} <br />
                                Followers: {v.followers}
                                <img src={`http://localhost:4000/vacations/image/${v.image}`} alt={"Destination view"}/> 
                                <div className="buttonsDiv">
                                    <CreateIcon onClick={() => this.edit(v.vacationId)} /> &nbsp; &nbsp;
                                    <DeleteIcon onClick={() => this.remove(v.vacationId)} />
                                </div>
                            </Card>)}
                    </Grid>
                }

                {this.state.goToGraph === 1 && <Redirect to={"/vacation-management-graph"} /> } 

                </div>
            }

                {this.state.idToEdit > 0 &&
                    <Redirect to={`/edit-vacation/${this.state.idToEdit}`} />}
                {this.state.addVacation > 0 &&
                    <Redirect to={"/add-vacation"} />}
                {this.state.addDestination > 0 &&
                    <Redirect to={"/add-destination"} />}
            </div>
        );
    }

    public addVacation = () => {
        this.setState({ addVacation: 1, addDestination: 0, idToEdit: 0 })
    }

    public addDestination = () => {
        this.setState({ addDestination: 1, addVacation: 0, idToEdit: 0 })
    }

    public reRender = () => {
        this.setState({ changes: 1 });
        setTimeout(() => {
            this.setState({ addVacation: 0, addDestination: 0, idToEdit: 0 });
        }, 500)

    }
}

export default VacationManagement;
