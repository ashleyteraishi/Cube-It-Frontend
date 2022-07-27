import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


class AddTournament extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, tournament: [] };
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handeAdd = () => {
        const tournament = {
            tournamentName: this.state.tournamentName,
            startDate: this.state.startDate,
            endDate: this.date.endDate
        };
        this.props.addTournament(tournament);
        this.handleClose();
    }

    render() {
        return (
            <div>
                <Button variant="outlined" color="primary" style={{ margin: 10 }} onClick={this.handleClickOpen}>
                    Add Tournament
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>Add Assignment</DialogTitle>
                    <DialogContent style={{ paddingTop: 20 }} >
                        <TextField autoFocus fullWidth label="Tournament Name" name="tournamentName" onChange={this.handleChange} style={{ marginTop: 20 }} />
                        <TextField fullWidth label="Start Date" name="startDate" onChange={this.handleChange} style={{ marginTop: 20 }} />
                        <TextField fullWidth label="End Date" name="endDate" onChange={this.handleChange} style={{ marginTop: 20 }} />
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
                        <Button id="Add" color="primary" onClick={this.handleAdd}>Add</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default AddTournament;