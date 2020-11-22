
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';

import { sampleProducts } from './sample-products.jsx';
import { MyCommandCell } from './myCommandCell.jsx';

class main extends React.Component {
    editField = "inEdit";
    CommandCell;

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
        console.log(this.state.data)


    }

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            error:{branch:'',semester:'',scheme:'',date:'',code:'',course:''}
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

    enterEdit = (dataItem) => {
        this.setState({
            data: this.state.data.map(item =>
                item.code === dataItem.code ?
                    { ...item, inEdit: true } : item
            )
        });
    }

    remove = (dataItem) => {
        const semester = this.props.semester;
        const branch = this.props.branch;
        const scheme = this.props.scheme;
        const code = this.state.editID;
        const index = this.getIndex(code)
        console.log(index)

       
            fetch(`http://192.168.29.168:8000/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/${code}/`, {
            method: 'Delete',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
            if(response.status === 204) {
              console.log("deleted")
            } else {
               console.log("not dleted")
            }
         })
            
    }

    add = (dataItem) => {
        dataItem.inEdit = undefined;


        sampleProducts.unshift(dataItem);
        this.setState({
            data: [...this.state.data]
        });
    }

    discard = (dataItem) => {
        const data = [...this.state.data];
        this.removeItem(data, dataItem);

        this.setState({ data });
    }

    update = (dataItem) => {
        const data = [...this.state.data];
        const updatedItem = { ...dataItem, inEdit: undefined };

        this.updateItem(data, updatedItem);
        this.updateItem(sampleProducts, updatedItem);

        this.setState({ data });
    }

    cancel = (dataItem) => {
        const originalItem = sampleProducts.find(p => p.code === dataItem.code);
        const data = this.state.data.map(item => item.code === originalItem.code ? originalItem : item);

        this.setState({ data });
    }

    updateItem = (data, item) => {
        let index = data.findIndex(p => p === item || (item.code && p.code === item.code));
        if (index >= 0) {
            data[index] = { ...item };
        }
    }

    itemChange = (event) => {
        const data = this.state.data.map(item =>
            item.code === event.dataItem.code ?
                { ...item, [event.field]: event.value } : item
        );

        this.setState({ data });
    }

    addNew = () => {
        const newDataItem = { inEdit: true,branch:`${this.props.branch}${this.props.scheme}`,semester:`${this.props.semester}${this.props.branch}${this.props.scheme}`,scheme:this.props.scheme,isElective:true};

        this.setState({
            data: [newDataItem, ...this.state.data]
        });
    }

    cancelCurrentChanges = () => {
        this.setState({ data: [...this.state.data] });
    }

    
    getIndex(name) {
        for (var i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].code === name) {
                return i;
            }
        }
        return 0;
    }

    rowClick = (event) => {
        this.setState({
            editID: event.dataItem.code,
            id: event.dataItem.id
        });
        console.log(this.state.editID)
       
    };

    upload = async(event) => {
        event.preventDefault();
        const semester = this.props.semester;
        const branch = this.props.branch;
        const scheme = this.props.scheme;
        const code = this.state.editID;
        const data=this.state.data;
        const index = this.getIndex(code)
        console.log(index)

       
            fetch(`http://192.168.29.168:8000/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/`, {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data[index])
        })
            .then(data => data.json())
            .then(
                data => {
                    this.setState({
                        error: data
                    })
                    console.log(data)
                }
            ).catch(error => console.log(error))
       
    }

    render() {
        const { data } = this.state;
        const hasEditedItem = data.some(p => p.inEdit);
        return (
            <div>
               
                <Grid
                    style={{ boxShadow: '0 0px 3em rgba(0,0,0,0.09)',maxWidth:"800px", margin: '0 auto' }}
                    data={data}
                    onRowClick={this.rowClick}
                    onItemChange={this.itemChange}
                    editField={this.editField}
                >
                    <GridToolbar>
                        <button
                            title="Add new"
                            className="k-button k-primary"
                            onClick={this.addNew}
                        >
                            Add new
                    </button>
                      
                    </GridToolbar>
                    <Column field="code" title="Code"/>
                    <Column field="course" title="Course" editor="text" />
                    <Column field="date" name='date'  value={this.state.data.date} title="Date" editor='text' />
                    <Column cell={this.CommandCell} />
                </Grid>

                <div className="field is-grouped is-grouped-centered">
                <button className="button is-s" onClick={this.upload}>Upload</button>
                </div>
                
               
            </div>
        );
    }

    generateId = data => data.reduce((acc, current) => Math.max(acc, current.code), 0) + 1;

    removeItem(data, item) {
        let index = data.findIndex(p => p === item || item.code && p.code === item.code);
        if (index >= 0) {
            data.splice(index, 1);
        }
    }
}

export default main;