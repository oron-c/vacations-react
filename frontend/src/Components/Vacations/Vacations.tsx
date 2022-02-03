import { Grid } from "@material-ui/core";
import { Component } from "react";
import { Card } from "react-bootstrap";
import FollowsModel from "../../Model/FollowsModel";
import VacationsModel from "../../Model/VacationsModel";
import jwtAxios from "../../Services/JwtAxios";
import SocketIoService from "../../Services/socket-io-service";
import "./Vacations.css";
import Button from '@material-ui/core/Button';


interface VacationsState {
    vacation: VacationsModel[],
    error: [],
    myError: string,
    follows: FollowsModel[],
    followsError: [],
    reRenderVacation: boolean,
    reRenderFollows: boolean,
    userId: number,
    username: string
}

class Vacations extends Component<{}, VacationsState> {

    private user = JSON.parse(localStorage["loginData"]);

    private SocketIoService = new SocketIoService(); 

    constructor(props: {}) {
        super(props)
        this.state = ({ vacation: [], error: [], follows: [], followsError: [], reRenderVacation: false, reRenderFollows: false, myError: "", userId: this.user.userId, username: this.user.userName })
    }

    public componentDidMount = async () => {
        this.SocketIoService.connect();
        this.SocketIoService.socket?.on("msg-from-server", vacation => {
            let vacationsList = [...this.state.vacation];
            let found = false;
            let i = vacationsList.findIndex(vac => vac.vacationId === vacation.vacationId)
            if (i > -1) {
                vacationsList[i] = vacation;
                found = true;
            }
            if (!found) {
                vacationsList.push(vacation);
            }
            this.setState({ vacation: vacationsList, reRenderVacation: true })


        });
        if (this.state.vacation.length === 0) {
            if (this.user.userId) {
                try {
                    const response = await jwtAxios.get<VacationsModel[]>(`http://localhost:4000/vacations/all/${this.user.userId}`);
                    this.setState({ vacation: response.data, error: [] });
                    try {
                        const followersRes = await jwtAxios.get<FollowsModel[]>(`http://localhost:4000/vacations/follows/${this.user.userId}`)
                        this.setState({ follows: followersRes.data })
                    } catch (error: any) {
                        if (error.response.status===500) {
                            this.setState({ followsError: error.response.data.message, vacation: [], myError: "" });
                        }
                        else {
                            this.setState({ followsError: error.response.data, vacation: [], myError: "" });
                        }
                    }
                } catch (error: any) {
                    if (error.response.status===500) {
                        this.setState({ error: error.response.data.message, vacation: [], myError: "" });
                    }
                    else {
                        this.setState({ error: error.response.data, vacation: [], myError: "" });
                    }
                }
            }
            else {
               this.setState({myError: "You are not logged in!"});
            }
        }        
    };

    
    public componentWillUnmount = () => {
        this.SocketIoService.disconnect();
    }

    public componentDidUpdate = async (prevProps: {}, prevState: VacationsState) => {
        if (this.state.reRenderVacation !== prevState.reRenderVacation) {
            try {
                const response = await jwtAxios.get<VacationsModel[]>(`http://localhost:4000/vacations/all/${this.user.userId}`);
                this.setState({ vacation: response.data, error: [], reRenderVacation: false });
            } catch (error: any) {
                if (error.response.status===500) {
                    this.setState({ error: error.response.data.message, vacation: [], myError: "", reRenderVacation: false  });
                }
                else {
                    this.setState({ error: error.response.data, vacation: [], myError: "", reRenderVacation: false  });
                }
            }
        }
        if (this.state.reRenderFollows !== prevState.reRenderFollows) {
            try {
                const followersRes = await jwtAxios.get<FollowsModel[]>(`http://localhost:4000/vacations/follows/${this.user.userId}`)
                this.setState({ follows: followersRes.data, reRenderFollows: false });
            } catch (error: any) {
                if (error.response.status===500) {
                    this.setState({ followsError: error.response.data.message, vacation: [], myError: "", reRenderFollows: false  });
                }
                else {
                    this.setState({ followsError: error.response.data, vacation: [], myError: "", reRenderFollows: false  });
                }
            }
        }
    }


    public followVacation = async (vacationId: number, userId: number) => {
        let isFollow = [...this.state.follows].find(f => f.vacationId === vacationId && f.userId === userId);
        if (isFollow) {
            try {
                await jwtAxios.delete(`http://localhost:4000/vacations/follows/unfollow/${userId}/${vacationId}`)
                this.setFollowers(vacationId, "-")
            } catch (error: any) {
                if (error.response.status===500) {
                    this.setState({ followsError: error.response.data.message });
                }
                else {
                    this.setState({ followsError: error.response.data });
                }
            }
        }
        else {
            try {
                this.setFollowers(vacationId, "+");
                await jwtAxios.post(`http://localhost:4000/vacations/follows/follow/${userId}/${vacationId}`)

            } catch (error: any) {
                if (error.response.status===500) {
                    this.setState({ followsError: error.response.data.message });
                }
                else {
                    this.setState({ followsError: error.response.data });
                }
            }
        }
        this.setState({ reRenderFollows: true, reRenderVacation: true });

        const thisVacation = this.state.vacation.find(v => v.vacationId === vacationId)
        if (thisVacation) {
            this.SocketIoService.send(thisVacation);
        }
    };

    private setFollowers = async (vacationId: number, operator: string) => {
        try {
            await jwtAxios.patch(`http://localhost:4000/vacations/followers/${vacationId}/${operator}`)
        } catch (error: any) {
            if (error.response.status===500) {
                this.setState({ followsError: error.response.data.message });
            }
            else {
                this.setState({ followsError: error.response.data });
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
            <div className="Vacations">
                <h2>Hello, {this.state.username}!</h2>

                {this.state.vacation && this.state.error.length === 0 && !this.state.myError && 
                    <Grid container className="grid-container"> 
                        {this.state.vacation.map(v =>
                            <Card className="card" key={v.vacationId}>
                                <Card.Header>{v.destinationName}</Card.Header>
                                <Card.Title>{this.formatDate(v.dateStart)} - {this.formatDate(v.dateEnd)}</Card.Title>
                                <Card.Text className="cardText">
                                    {v.description}
                                </Card.Text>
                                ${v.price} <br />
                                <img src={`http://localhost:4000/vacations/image/${v.image}`} alt={"Destination view"} /> Followers: {v.followers}
                                <div>{this.state.follows.find(f => f.vacationId === v.vacationId) ?
                                    <Button variant="outlined" color="primary" onClick={() => this.followVacation(v.vacationId, this.user.userId)}>Unfollow</Button> :
                                    <Button variant="outlined" color="primary" onClick={() => this.followVacation(v.vacationId, this.user.userId)}>Follow</Button>}
                                </div>

                            </Card>)}

                    </Grid>
                }
                {this.state.error &&
                    <p className="errorClass">{this.state.error}</p>
                }
                {this.state.myError &&
                    <p className="errorClass">{this.state.myError}</p>
                }
                {(this.state.followsError && !this.state.error) &&
                    <p className="errorClass">{this.state.followsError}</p> 
                }
            </div>
        );
    }
}

export default Vacations;
