import React, { Component } from 'react';
import Header from '../pages/Header';
import './styles/styles.css'
import axios from 'axios';
import { logout } from '../actions/auth'
import CsvDownload from 'react-json-to-csv'
import CsvParse from '@vtex/react-csv-parse'
import CSVReader from 'react-csv-reader'
import { connect } from 'react-redux'
import ReactFileReader from 'react-file-reader';
import {serverip} from '../actions/serverip'
import { MyCommandCell } from './other.jsx';
import $ from "jquery"
import PropTypes from 'prop-types';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { toast } from 'react-toastify';



export class hallticket extends Component {
    editField = "inEdit";
    CommandCell;
    static propTypes = {
        logout: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            load: false,
            final:[],
            filled: [],
            dup_filled: [],
            notfilled: [],
            csv_filled_data: [],
            filledcount: null,
            notfilledcount: null,
            data: [],
            csvdata: [],
            credentials: { branch: '', semester: '', starting_seatno: undefined },

        };

        this.CommandCell = MyCommandCell({
            edit: this.enterEdit,
            remove: this.remove,

            add: this.add,
            discard: this.discard,

            update: this.update,
            cancel: this.cancel,

            editField: this.editField
        });

    }

    uploadSheet=()=>{
        const branch=this.state.credentials.branch;
        const semester=this.state.credentials.semester;

        const formdata=new FormData();
        formdata.append('id',`${branch}${semester}`)
        formdata.append('file',this.state.selectedSheet)
        formdata.append('branch',branch);
        formdata.append('semester',semester);
        console.log(formdata)
        fetch(`${serverip}/api/file/`,{
            method:'Post',
            headers: {
                /* 'Content-Type': 'multipart/form-data', */
                'Authorization': `Token ${this.props.auth.token}`
            },
            body:formdata
        })
    }

    componentDidMount=()=>{
        const branch=this.state.credentials.branch;
        const semester=this.state.credentials.semester;
        
    }

    handleData = data => {

        console.log(data)
        this.setState({ csvdata: data })
        console.log(this.state.csvdata)
        let not_filled = {}
        not_filled = this.state.csvdata.filter(f =>
            !this.state.data.some(d => d.rollno == f.rollno)
        );
        this.setState({
            notfilled: not_filled,
            notfilledcount: not_filled.length
        })

        //get filled form students data in input csv file sequence
        var csv_filled_data=[]
        console.log(not_filled);
        data.forEach(e=>{
            this.state.filled.some(x=>{
                if(x.rollno==e.rollno){
                    csv_filled_data.push(x)
                    this.setState({
                        csv_filled_data:csv_filled_data
                    })
                }
            })    
        })
        let final=[...csv_filled_data,...this.state.ktfilled]
        console.log(final)
        this.setState({final})
      
    }

    handleSeatNo = (e) => {
        const cred = this.state.credentials
        cred[e.target.name] = e.target.value;
        this.setState({
            credentials: cred,
        })
        let i = 0, fl = this.state.final.length;
        for (i; i < fl; i++) {
            this.state.data[i].seatNo = parseFloat(this.state.credentials.starting_seatno) + parseFloat(i);
            this.state.final[i].seatNo = parseFloat(this.state.credentials.starting_seatno) + parseFloat(i);
        }
        console.log(this.state.final)
    }
    handleChange = async (e) => {

        const cred = this.state.credentials
        cred[e.target.name] = e.target.value;
        this.setState({
            credentials: cred,
        })


        fetch(`${serverip}/api/file/${this.state.credentials.branch}${this.state.credentials.semester}`,{
            method:'Get',
            headers: {
                /* 'Content-Type': 'multipart/form-data', */
                'Authorization': `Token ${this.props.auth.token}`
            },
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            this.setState({
                csvdata:data.file
            })
        })
        

        console.log(cred)
        const api_call = await fetch(`${serverip}/student/?branch=${this.state.credentials.branch}&semester=${this.state.credentials.semester[0]}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            }
        });
        const response = await api_call.json();
        this.setState({
            data: response
        })

        let rollarr = {}
        rollarr = this.state.data.map(function (r) {

            return {
                rollno: r["rollno"],
                studentname: r['studentname'],
                studentType: r['studentType'],
                elective: r['elective'],
                surname: r['surname'],
                seatNo: r['seatNo'],
                studentphone:r['studentphone']
            }
        })

        rollarr.sort(function (a, b) {
            if (a.studentType > b.studentType) return -1;
            if (a.studentType < b.studentType) return 1;

            if (a.elective > b.elective) return 1;
            if (a.elective < b.elective) return -1;

            if (a.rollno > b.rollno) return 1;
            if (a.rollno < b.rollno) return -1;
        });

        this.setState({
            filled: rollarr,
            filledcount: rollarr.length
        })
        console.log(rollarr)
        
        //get KT students who have filled form
        let ktfilled=[]
        rollarr.forEach((e)=>{
            if(e.studentType==="KT"){
                ktfilled.push(e)
            }
        })
        console.log(ktfilled)
        this.setState({ktfilled})
    }

    enterEdit = (dataItem) => {
        this.setState({
            final: this.state.final.map(item =>
                item.studentname === dataItem.studentname ?
                    { ...item, inEdit: true } : item
            )
        });
    }
    add = (dataItem) => {
        dataItem.inEdit = undefined;
        dataItem.studentname = this.generateId(this.state.csv_filled_data);

        this.state.filled.unshift(dataItem);
        this.setState({
            data: [...this.state.data]
        });
    }




    update = (dataItem) => {
         //check for duplicate seatno entries
         /* var currentSeatNo=dataItem.seatNo
         var currentRollno=dataItem.rollno
         var csvdata=this.state.filled
         console.log(currentSeatNo,csvdata)
         for(let i=0;i<csvdata.length;i++){
             if(csvdata[i].seatNo==currentSeatNo  && currentRollno!=csvdata[i].rollno){
                 toast.error(`Duplicate Seat number!`, {
                     autoClose: false,
                     position: toast.POSITION.BOTTOM_RIGHT,
                 })
                 return
             }
         } */
         //update seatnos if not any error
         const data = [...this.state.data];
         const updatedItem = { ...dataItem, inEdit: undefined };
 
         this.updateItem(data, updatedItem);
         this.updateItem(this.state.final, updatedItem);
 
         this.setState({ data });
    }

    updateItem = (data, item) => {
        let index = data.findIndex(p => p === item || (item.studentname && p.studentname === item.studentname));
        if (index >= 0) {
            data[index] = { ...item };
        }
    }

    cancel = (dataItem) => {
        const originalItem = this.state.data.find(p => p.rollno === dataItem.rollno);
        console.log(originalItem)
        const data = this.state.final.map(item => item.rollno === originalItem.rollno ? originalItem : item);

        this.setState({ final:data });
    }

    discard = (dataItem) => {
        const data = [...this.state.data];
        this.removeItem(data, dataItem);

        this.setState({ data });
    }

    remove = (dataItem) => {
        const data = [...this.state.data];
        this.removeItem(this.state.final, dataItem);

        this.setState({ data });
    }

    removeItem(data, item) {
        let index = data.findIndex(p => p === item || (item.studentname && p.studentname === item.studentname));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    itemChange = (event) => {
        const data = this.state.final.map(item =>
            item.studentname === event.dataItem.studentname ?
                { ...item, [event.field]: event.value } : item
        );

        this.setState({ final: data });
    }


    getIndex(name) {
        for (var i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].code === name) {
                return i;
            }
        }
        return 1;
    }

    generate = () => {
        this.setState({
            filled: this.state.filled
        })
    }



    updateSeatNo = () => {

        for (var i = 0; i < this.state.final.length; i++) {
            const rollno = this.state.final[i].rollno;
            fetch(`${serverip}/student/${rollno}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.props.auth.token}`
                },
                body: JSON.stringify({ "seatNo": this.state.final[i].seatNo })
            })
                .then(data => data.json())
                .then(
                    data => {
                        this.setState({
                            error: data
                        })
                        console.log(data)
                    }
                ).catch(error =>{ 
                    console.log(error)
                })
        }
        toast.success(`Updated!`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
        })
       

    }

    onChangeHandler=(event)=>{
        console.log(event.target.files[0])
        this.setState({
            selectedSheet:event.target.files[0],
            loaded:0
        })
    }

    resetSeatNo = () => {
        this.setState({
            filled: this.state.dup_filled
        })
    }

    onInputClick = (event) => {
        console.log(event.target.files[0])
        event.target.value = ''
    }


    exportPDFWithComponent = () => {
        this.pdfExportComponent.save();
    }

    refreshFinal=()=>{
        let data=this.state.csvdata
        console.log(this.state.csvdata)
        let not_filled = {}
        not_filled = this.state.csvdata.filter(f =>
            !this.state.data.some(d => d.rollno == f.rollno)
        );
        this.setState({
            notfilled: not_filled,
            notfilledcount: not_filled.length
        })

        //get filled form students data in input csv file sequence
        var csv_filled_data=[]
        console.log(not_filled);
        data.forEach(e=>{
            this.state.filled.some(x=>{
                if(x.rollno==e.rollno){
                    csv_filled_data.push(x)
                    this.setState({
                        csv_filled_data:csv_filled_data
                    })
                }
            })    
        })
        let final=[...csv_filled_data,...this.state.ktfilled]
        console.log(final)
        this.setState({final})
    }

    render() {

        const keys = [
            "rollno",
            "studentname",
        ]
        $('#update').removeClass('is-loading');

        const filled = this.state.csv_filled_data;
        const notfilled = this.state.notfilled;
        const csvdata = this.state.csvdata;

        const hasEditedItem = filled.some(p => p.inEdit);
        return (
            <div>
                <div className="columns">
                    <div className="column is-one-fifth" >

                        <div className="section-small"  >
                            <div className="field" >
                                <label className="has-text-white">Branch</label>
                                <div className="select">
                                    <select name="branch" onChange={this.handleChange}>
                                        <option>Select Branch</option>
                                        <option>Computer</option>
                                        <option >Mechanical</option>
                                        <option >Electrical</option>
                                        <option >Extc</option>
                                        <option >IT</option>
                                    </select>
                                </div>
                            </div>


                            <div className="field" >
                                <label className="has-text-white">Semester</label>
                                <div className="select is-hoverable" >
                                    <select name="semester" onChange={this.handleChange}>
                                        <option>Select Semester</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                    </select>
                                </div>
                            </div>

                            <div className="field">
                                <CsvParse
                                    keys={keys}
                                    onDataUploaded={this.handleData}
                                    onError={this.handleError}
                                    render={onChange=>
                                        <input type="file" id='file' className="inputfile" onChange={onChange
                                        } onClick={this.onInputClick} />
                                
                                    }
                                    
                                    />

                                <input type="file" onChange={this.onChangeHandler} name="file"/>
                                <button className="button" onClick={this.uploadSheet}>Upload Sheet</button>

                                <label for="file" class="has-text-white" /* onClick={this.handleData} */>Check status</label>
                                {/* <button className="button" onClick={this.refresh}>Refresh List</button> */}

                            </div>


                        </div>

                    </div>

                    <div className="column" style={{ margin: "0px" }} >
                        <div className="hero" style={{ padding: '0px', height: 'fit-content' }}>
                            <div className="section-small" style={{ padding: '24px 0' }} >
                                <div className="container" style={{ width: '100%' }}>
                                    <div className="title has-text-white">Status</div>
                                    {this.state.credentials.semester && this.state.credentials.branch ? <div className="subtitle has-text-white">{this.state.credentials.branch},Semester {this.state.credentials.semester} <button
                                                    title="Refresh"
                                                    className="k-button k-primary"
                                                    onClick={this.handleChange}><span className="material-icons">refresh</span>Refresh</button> </div> : null}
                                        
                                    <div className="box" style={{ padding: '12px 0' }}>
                                        <div className="columns ">
                                            <div className="column is-two-thirds">
        
                                                <div className="subtitle" style={{ marginBottom: "0px", color: '#34a85c', display: 'flex', alignItems: 'center' }}>Filled Roll numbers<span><i class="material-icons"> check_circle</i> {this.state.filledcount}</span></div>
                                                {this.state.credentials.branch && this.state.credentials.semester ?
                                                    <div>

                                                        <Grid
                                                            style={{ height: '300px', margin: '0 auto' }}
                                                            data={this.state.filled.map((item) =>
                                                                ({ ...item, inEdit: item.code === this.state.editID })
                                                            )}>
                                                            <Column field="studentname" title="Name" editable={false} />
                                                            <Column field="rollno" title="Roll number" editable={false} />
                                                            <Column field="elective" title="Elective" editable={false} />
                                                            <Column field="studentType" title="Type" editable={false} />
                                                            <Column field="studentphone" title="Phone no." editable={false} />
                                                        </Grid>
                                                    </div>
                                                    : null}
                                                {/*  </table> */}

                                            </div>
                                            <div className="column">
                                                {/*  <div className="box" style={{ padding: "10px" }}> */}
                                                <span style={{ display: 'flex' }}><div className="subtitle" style={{ marginBottom: "0px", color: '#e62626', display: 'flex', alignItems: 'center' }}>Pending <span><i class="material-icons"> warning</i> {this.state.notfilledcount}</span> </div></span>
                                                <CsvDownload data={this.state.notfilled} filename={`${this.state.credentials.branch}${this.state.credentials.semester}_Pending.csv`}>Download pending list</CsvDownload>
                                                <table style={{ fontSize: '14px', width: '100%' }}>
                                                    {this.state.credentials.branch && this.state.credentials.semester ?
                                                        <Grid
                                                            style={{ maxWidth: '800px', margin: '0 auto', height: '300px' }}
                                                            data={this.state.notfilled.map((item) =>
                                                                ({ ...item })
                                                            )}>
                                                            <Column field="studentname" title="Name" editable={false} />
                                                            <Column field="rollno" title="Roll number" editable={false} />

                                                        </Grid>

                                                        : null}
                                                </table>
                                                {/*  </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <div className="hero">

                    <div className="columns" style={{ marginBottom: "0px" }}>

                        <div className="column is-one-fifth">
                            <div className="section-small" /* style={{ borderRight: '1px solid #efefef' }} */>
                                <div className="field">
                                    <label htmlFor="" className="has-text-white">Starting Seat number</label>
                                    <input type="number" onChange={this.handleSeatNo} value={this.state.credentials.starting_seatno} name="starting_seatno" className="input" placeholder="Enter starting rollnumber" />
                                    <button className="button is-success" onClick={this.generate}>Generate</button>
                                </div>

                            </div>
                        </div>
                        <div className="column">
                            <div className="hero">
                                <div className="section-small" style={{ padding: '24px 0' }}>
                                    <div className="container">
                                        <div className="title has-text-white">Generate seat numbers</div>
                                        <div className="box">
                                            <GridToolbar>
                                            <button
                                                    title="Refresh"
                                                    className="k-button k-primary"
                                                    onClick={this.refreshFinal}><span className="material-icons">refresh</span>Refresh</button> 

                                            </GridToolbar>
                                            <Grid
                                                resizable
                                                style={{ margin: '0 auto' }}
                                                onItemChange={this.itemChange}
                                                editField={this.editField}
                                                data={this.state.final.map((item) =>
                                                    ({ ...item })
                                                )}>
                                                <Column field="rollno" title="Roll no" editable={false}/>
                                                <Column field="studentname" title="Name" editable={false} />
                                                <Column field="seatNo" title="Seat number"editor="numeric" />
                                                <Column field="elective" title="Elective" editable={false} />
                                                <Column cell={this.CommandCell} title="Actions" />
                                            </Grid>
                                        </div>
                                    </div>
                                    <div className="field is-grouped is-grouped-centered">
                                        <button className="button is-success" id="update" onClick={this.updateSeatNo}>Update</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(hallticket);