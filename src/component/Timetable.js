import React, { Component } from 'react';
import { connect } from 'react-redux'
import { logout } from '../actions/auth'
import { orderBy } from '@progress/kendo-data-query'
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';

export class Timetable extends Component {
    constructor(props) {
        super(props);
        this.state = {
        profile: this.props.profile,
        data:this.props.data,
        credentials: { branch: props.profile.branch, semester: props.profile.semester, revscheme:props.profile.scheme },
        sort: [
            { field: 'code', dir: 'asc' }
          ]
        }
      }

      componentDidMount=async()=>{
        const semester = this.state.credentials.semester;
        const branch = this.state.credentials.branch;
        const scheme = this.state.credentials.revscheme;
    
        const api_call = await fetch(`http://192.168.29.101:8000/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/`, {
          headers: {
            'Authorization': `Token ${this.props.auth.token}`
          }
        });
        const response = await api_call.json();
        this.setState({
          data: response,
        })
        console.log(this.state.data.sort())
      }

      handleChange = async (e) => {
        const cred = this.state.credentials
        cred[e.target.name] = e.target.value;
        this.setState({
          credentials: cred
        })
        console.log(cred)
    
        const semester = this.state.credentials.semester;
        const branch = this.state.credentials.branch;
        const scheme = this.state.credentials.revscheme;
    
        const api_call = await fetch(`http://192.168.29.101:8000/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course`, {
          headers: {
            'Authorization': `Token ${this.props.auth.token}`
          }
        });
        const response = await api_call.json();
        this.setState({
          data: response,
        })
        console.log(this.state.data.sort())
      }

    render() {
        const profile=this.props.profile;
        const data =this.state.data;
        return (
            
                <div className="box">
                    <div className="columns" style={{ margin: '0 auto' }}>
                        <div className="column">
                            <div className="field" style={{ margin: '0px' }}>
                                <label className="label">Scheme</label>
                                <div className="select">
                                    <select name="revscheme" onChange={this.handleChange}>
                                        <option>{profile ? profile.scheme : `Select Scheme`}</option>
                                        <option>2012</option>
                                        <option>2016</option>
                                        <option>2019</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="column">
                            <div className="field" style={{ margin: '0px' }}>
                                <label className="label">Branch</label>
                                <div className="select">
                                    <select name="branch" onChange={this.handleChange} >
                                        <option>{profile ? profile.branch : `Select Branch`}</option>
                                        <option>Computer</option>
                                        <option >Mechanical</option>
                                        <option >Electrical</option>
                                        <option >Extc</option>
                                        <option >IT</option>

                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="field" style={{ margin: '0px' }}>
                                <label className="label">Semester</label>
                                <div className="select is-hoverable" >
                                    <select name="semester" onChange={this.handleChange}>
                                        <option>{profile ? profile.semester : `Select Semester`}</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Grid
                        data={orderBy(data, this.state.sort)}
                        sort={this.state.sort}
                        onSortChange={(e) => {
                            this.setState({
                                sort: e.sort
                            });
                        }}
                        style={{ boxShadow: '0 0px 3em rgba(0,0,0,0.09)', maxWidth: "1000px", margin: '0 auto' }}
                        onItemChange={this.itemChange}
                        editField={this.editField}
                        resizable
                    >
                        <Column field="code" title="Code" width="100%" editable={false} />
                        <Column field="course" title="Course" editable={false} />
                        <Column field="date" title="Date" width="150px" editable={false} />

                    </Grid>
                </div>
           
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { logout})(Timetable);
