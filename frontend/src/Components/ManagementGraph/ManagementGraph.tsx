import { Component } from "react";
import { Redirect } from "react-router-dom";
import * as V from 'victory';
import VacationsAndFollowsModel from "../../Model/VacationsAndFollowsModel";
import jwtAxios from "../../Services/JwtAxios";
import "./ManagementGraph.css"
import Button from '@material-ui/core/Button';

interface ManagementGraphState {
    data: VacationsAndFollowsModel[];
    error: [],
    goToManagement: number;
}

class ManagementGraph extends Component<{}, ManagementGraphState> {

    constructor(props: {}) {
        super(props);
        this.state = ({ data: [], error: [], goToManagement: 0 });
    }

    componentDidMount = async () => {
        try {
            const response = await jwtAxios.get<VacationsAndFollowsModel[]>("http://localhost:4000/vacations/vacations-and-followers"); 
            this.setState({ data: response.data });

        } catch (error: any) {
            if (error.response.status===500) {
                this.setState({ error: error.response.data.message, data: [] });
            }
            else {
                this.setState({ error: error.response.data, data: [] });
            } 
        }
    }

    public render(): JSX.Element {
        return (
            <div className="ManagementGraph">
                {this.state.error && <div className="errorClass">{this.state.error}<br/><br/></div>} 
                {/* <V.VictoryAxis tickValues={this.state.data.map(v => v.vacationId)} tickFormat={[this.state.data.map(v => v.followers)]} />  */}
                <V.VictoryChart domainPadding={15}
                theme={V.VictoryTheme.material}>
                    <V.VictoryAxis
                        tickValues={this.state.data.map(v => v.vacationId)}  
                        tickFormat={this.state.data.map(v => `${v.vacationId}`)}
                    />
                    <V.VictoryAxis
                        dependentAxis
                        tickValues={this.state.data.map(v => v.followers)}
                        tickFormat={this.state.data.map(v => v.followers)}
                    />

                    <V.VictoryBar
                        data={this.state.data}
                        x="vacationId"
                        y="followers"
                    />
                </V.VictoryChart>
                <br /> 
                <Button variant="outlined" color="primary"  onClick={()=>{this.setState({goToManagement: 1})}}>Go back to Vacations Management</Button>
                {this.state.goToManagement === 1 && <Redirect to={"/vacation-management"} />}
            </div>
        );
    }
}

export default ManagementGraph;
