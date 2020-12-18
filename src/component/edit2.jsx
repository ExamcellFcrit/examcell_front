import React, { Component } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { MyCommandCell } from './myCommandCell.jsx';
import { toast } from 'react-toastify';
import { logout } from '../actions/auth'
import 'react-toastify/dist/ReactToastify.css';
import { orderBy } from '@progress/kendo-data-query'
import { sampleProducts } from './sample-products.jsx';
import { insertItem, getItems, updateItem, deleteItem } from "./services.jsx";
import { connect } from 'react-redux'
import {serverip} from '../actions/serverip'
import PropTypes from 'prop-types';

let toastId = null;
const loading = () => toastId = toast("Loading...", { autoClose: false, position: toast.POSITION.BOTTOM_RIGHT });

export class edit extends Component {
    editField = "inEdit";
    CommandCell;

    static propTypes = {
        logout: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            credentials: { branch: sessionStorage.getItem("branch"), semester: sessionStorage.getItem("semester"), revscheme: sessionStorage.getItem("scheme") },
            sort: [
                { field: 'id', dir: 'asc' }
            ]
        };
    }

    CommandCell = props => (
        <MyCommandCell
            {...props}
            edit={this.enterEdit}
            remove={this.remove}
            add={this.add}
            discard={this.discard}
            update={this.update}
            cancel={this.cancel}
            editField={this.editField}
        />
    );

    componentDidMount = async () => {
        var branch = sessionStorage.getItem("branch")
        var semester = sessionStorage.getItem("semester")
        var scheme = sessionStorage.getItem("scheme")
        const api_call = await fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course`, {
            headers: {
                'Authorization': `Token ${this.props.auth.token}`
            }
        });
        const response = await api_call.json();
        this.setState({
            data: response,
            initial: response,
        })
    }

    enterEdit = (dataItem) => {
        this.setState({
            data: this.state.data.map(item =>
                item.code === dataItem.code ?
                    { ...item, inEdit: true } : item
            )
        });
    }

    add = (dataItem) => {
        loading()
        dataItem.inEdit = undefined;
        console.log(dataItem)
        this.setState({
            data: [...this.state.data]
        });
        console.log(this.state.data[0])
        const semester = this.state.credentials.semester;
        const branch = this.state.credentials.branch;
        const scheme = this.state.credentials.revscheme;
        const code = dataItem.code;
        console.log(code)
        dataItem.id = semester + branch + scheme + code;
        fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/`, {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${this.props.auth.token}` },
        }).then((res) => {
            console.log(res.status)
            if (res.status == 404 || res.status == 200) {
                fetch(`${serverip}/scheme/${scheme}/branch/`, {
                    method: 'Post',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${this.props.auth.token}` },
                    body: JSON.stringify(
                        {
                            "id": `${branch}${scheme}`,
                            "branch": `${branch}`,
                            "scheme": `${scheme}`
                        }
                    )
                })
                    .then(() => {
                        fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/`, {
                            method: 'Get',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${this.props.auth.token}` },
                        }).then((res) => {
                            console.log(res.status)
                            if (res.status == 404 || res.status == 200) {
                                fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/`, {
                                    method: 'Post',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${this.props.auth.token}` },
                                    body: JSON.stringify(
                                        {
                                            "id": `${semester}${branch}${scheme}`,
                                            "branch": `${branch}${scheme}`,
                                            "semester": `${semester}`
                                        }
                                    )
                                })
                                    .then(() => {
                                        fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/`, {
                                            method: 'Post',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${this.props.auth.token}` },
                                            body: JSON.stringify(dataItem)
                                        })
                                            .then(data => data.json())
                                            .then(
                                                data => {
                                                    this.setState({
                                                        error: data
                                                    })
                                                    if (data.id) {
                                                        const error = () => toast.update(toastId, { type: toast.TYPE.SUCCESS, autoClose: 2000, render: `${data.course} is added` });
                                                        { error() }

                                                    }
                                                    else if (data.date || data.ktdate) {
                                                        const error = () => toast.update(toastId, { type: toast.TYPE.ERROR, autoClose: 2000, render: `${data.date}` });
                                                        { error() }
                                                        { this.discard(dataItem) }
                                                    }

                                                }
                                            ).catch(error => {
                                                console.log(error)
                                                const success = () => toast.update(toastId, { type: toast.TYPE.SUCCESS, autoClose: 2000, render: `${dataItem.course} Added!` });
                                                { success() }
                                            })
                                    })
                            }

                        })

                    })
            }
            else {
                fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/`, {
                    method: 'Post',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${this.props.auth.token}` },
                    body: JSON.stringify(dataItem)
                })
                    .then(data => data.json())
                    .then(
                        data => {
                            this.setState({
                                error: data
                            })
                            console.log(data.date[0])
                            if (isNaN(data.date[0])) {
                                const failed = () => toast.update(toastId, { type: toast.TYPE.ERROR, autoClose: 2000, render: `${data.date}` });
                                { failed() }
                                { this.discard(dataItem) }
                            }
                            else {
                                const success = () => toast.update(toastId, { type: toast.TYPE.SUCCESS, autoClose: 2000, render: `${dataItem.course} Added!` });
                                { success() }

                            }

                        }
                    ).catch(error => {
                        console.log(error)
                        const failed = () => toast.update(toastId, { type: toast.TYPE.INFO, autoClose: 2000, render: `${dataItem.course} is already added!` });
                        { failed() }
                    })
            }
        })
    }


    update = (dataItem) => {
        { loading() }
        const data = [...this.state.data];
        const updatedItem = { ...dataItem, inEdit: undefined }
        this.updateItem(data, updatedItem);
        this.setState({ data });
        if (dataItem.start_time == "") {
            dataItem.start_time = null
        }
        if (dataItem.end_time == "") {
            dataItem.end_time = null
        }
        if (dataItem.date == "" || dataItem.ktdate=="") {
            dataItem.date = null
            dataItem.ktdate = null
        }
        const semester = this.state.credentials.semester;
        const branch = this.state.credentials.branch;
        const scheme = this.state.credentials.revscheme;
        const id = dataItem.id;
        const error = this.state.error
        console.log("Id is: ", id)
        fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/${id}/`, {
            method: "Put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
            body: JSON.stringify(dataItem)
        })
            .then(data => data.json())
            .then(
                data => {
                    this.setState({
                        error: data
                    })
                   
                        const success = () => toast.update(toastId, { type: toast.TYPE.SUCCESS, autoClose: 2000, render: `${dataItem.course} Updated!` });
                        { success() }
                   
                    this.checkTime(dataItem.end_time, dataItem.start_time, dataItem.course, dataItem)

                }
            ).catch(error => console.log(error))
    }

    updateItem = (data, item) => {
        let index = data.findIndex(p => p === item || (item.code && p.code === item.code));
        if (index >= 0) {
            data[index] = { ...item };
        }
    }

    cancel = (dataItem) => {
        const originalItem = this.state.initial.find(p => p.id === dataItem.id);
        const data = this.state.data.map(item => item.id === originalItem.id ? originalItem : item);

        this.setState({ data });
    }

    discard = (dataItem) => {
        const data = [...this.state.data];
        this.removeItem(data, dataItem);

        this.setState({ data });
    }

    remove = (dataItem) => {
        { loading() }
        const data = [...this.state.data];
        this.setState({ data });
        const semester = this.state.credentials.semester;
        const branch = this.state.credentials.branch;
        const scheme = this.state.credentials.revscheme;
        const id = dataItem.id;

        fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/${id}/`, {
            method: 'Delete',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${this.props.auth.token}` },
        }).then(msg => {
            const success = () => toast.update(toastId, { type: toast.TYPE.ERROR, autoClose: 2000, render: `${dataItem.course} Deleted!` });
            { success() }
        }).then(async () => {
            const semester = this.state.credentials.semester;
            const branch = this.state.credentials.branch;
            const scheme = this.state.credentials.revscheme;
            const api_call = await fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course`, {
                headers: {
                    'Authorization': `Token ${this.props.auth.token}`
                }
            });
            const response = await api_call.json();
            this.setState({
                data: response,
            })
        })
    }

    itemChange = (event) => {
        const data = this.state.data.map(item =>
            item.code === event.dataItem.code ?
                { ...item, [event.field]: event.value } : item
        );

        this.setState({ data });
    }

    addNew = () => {
        const newDataItem = {
            inEdit: true,
            isElective: false,
            isInternal:false,
            branch: `${this.state.credentials.branch}${this.state.credentials.revscheme}`,
            semester: `${this.state.credentials.semester}${this.state.credentials.branch}${this.state.credentials.revscheme}`,
            scheme: this.state.credentials.revscheme
        };

        this.setState({
            data: [newDataItem, ...this.state.data]
        });
    }

    cancelCurrentChanges = () => {
        this.setState({ data: [...sampleProducts] });
    }


    handleChange = async (e) => {
        const cred = this.state.credentials
        cred[e.target.name] = e.target.value;
        this.setState({
            credentials: cred
        })
        console.log(cred)

        var semester = this.state.credentials.semester;
        var branch = this.state.credentials.branch;
        var scheme = this.state.credentials.revscheme;
        sessionStorage.setItem("branch", branch)
        sessionStorage.setItem("scheme", scheme)
        sessionStorage.setItem("semester", semester)
        const api_call = await fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course`, {
            headers: {
                'Authorization': `Token ${this.props.auth.token}`
            }
        });
        const response = await api_call.json();
        this.setState({
            data: response,
            initial: response,
        })
        console.log(this.state.data.sort())

    }




    rowRender(trElement, props) {
        const isElective = props.dataItem.isElective;
        const isInternal = props.dataItem.isInternal;
        const green = { backgroundColor: "rgb(55, 180, 0,0.32)" };
        const blue = { backgroundColor: "rgba(0, 255 ,255, 0.20)" };
        const none = { backgroundColor: "rgba(255, 255 ,255, 0.20)" };
        const trProps = { style: isElective ? green : isInternal ? blue : none };
        return React.cloneElement(trElement, { ...trProps }, trElement.props.children);
    }


    render() {
        const { data } = this.state;
        const hasEditedItem = data.some(p => p.inEdit);
        return (
            <div >
                <div className="hero" >
                    <div className="section-small">
                        <div className="columns" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <div className="column">

                                <div className="field" style={{ margin: '0px' }}>
                                    <label className="has-text-white">Scheme</label>
                                    <div className="select">
                                        <select name="revscheme" onChange={this.handleChange} value={sessionStorage.getItem("scheme")}>
                                            <option>Select Scheme</option>
                                            <option>2012</option>
                                            <option>2016</option>
                                            <option>2019</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="field" style={{ margin: '0px' }}>
                                    <label className="has-text-white">Branch</label>
                                    <div className="select">
                                        <select name="branch" onChange={this.handleChange} value={sessionStorage.getItem("branch")}>
                                            <option>Select Branch</option>
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
                                    <label className="has-text-white">Semester</label>
                                    <div className="select is-hoverable" >
                                        <select name="semester" onChange={this.handleChange} value={sessionStorage.getItem("semester")}>
                                            <option>Select Semester</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section">
                        <div className="container  box" style={{ margin: '0 auto', padding: '10px', width: '100%' }}>
                            {this.state.credentials.semester && this.state.credentials.branch ? (
                                <div className="title">{`${this.state.credentials.branch}, Semester ${this.state.credentials.semester}`} <span className="tag" style={{ backgroundColor: "rgb(55, 180, 0,0.32)" }}>Elective</span>
                                    <span className="tag ml-2" style={{ backgroundColor: "rgba(0, 255 ,255, 0.20)" }}>Internals</span></div>
                            ) : null}
                            <div className="is-flex">

                            </div>
                            <Grid
                                data={orderBy(data, this.state.sort)}
                                sortable={{ allowUnsort: true }}
                                sort={this.state.sort}
                                onSortChange={(e) => {
                                    this.setState({
                                        sort: e.sort
                                    });
                                }}
                                style={{ boxShadow: '0 0px 3em rgba(0,0,0,0.09)', margin: '0 auto', }}
                                onItemChange={this.itemChange}
                                rowRender={this.rowRender}
                                editField={this.editField}
                                resizable
                            >
                                <GridToolbar>
                                    <button
                                        title="Add new"
                                        className="k-button k-primary"
                                        onClick={this.addNew}>Add new</button>

                                    <button
                                        title="Refresh"
                                        className="k-button k-info"
                                        onClick={this.handleChange}><span className="material-icons">
                                            refresh
                                        </span>Refresh</button>
                                    <button title="ResetTime" className="k-button k-info" onClick={this.resetTime}>Reset Time</button>
                                    <p className="help" style={{ animation: 'none' }}>Double click Delete to remove a course</p>

                                </GridToolbar>
                                <Column field="code" title="Code" width="100%" />
                                <Column field="course" title="Course" />
                                <Column field="isElective" title="Elective" width="100%" editor='boolean' />
                                <Column field="isInternal" title="Internal" width="100%" editor="boolean" />
                                <Column field="date" title="Date" editor='text' width="100%" />
                                <Column field="ktdate" title="KT Date" editor='text' width="100%" />
                                <Column field="start_time" title="Start Time" width="100%" editor="text" />
                                <Column field="end_time" title="End Time" width="100%" editor="text" />

                                <Column cell={this.CommandCell} title="Actions" />

                            </Grid>

                        </div>
                    </div>
                </div>
            </div>
        );
    }


    removeItem(data, item) {
        let index = data.findIndex(p => p === item || (item.id && p.id === item.id));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

}

const mapStateToProps = state => ({
    auth: state.auth
});


export default connect(mapStateToProps, { logout })(edit);