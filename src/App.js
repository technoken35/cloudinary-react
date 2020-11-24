import React, { Component } from 'react';
import './App.css';
import Axios from 'axios';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import RecentImages from './components/RecentImages';
import CloudinaryContext from 'cloudinary-react/lib/components/CloudinaryContext';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#F3F4F9',
    },
    primary: {
      light: 'ff867a',
      main: '#ef534e',
      dark: '#b61825',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffff',
      main: '#f5f5f5',
      dark: '#c2c2c2',
      contrastText: '#000',
    },
  },
});

const cloudinary = window.cloudinary;

const baseUrl = 'https://desolate-everglades-01373.herokuapp.com';

export default class App extends Component {
  state = {
    value: [],
    inputValue: [],
    folderData: [],
    newFolderInput: '',
    newFolderFailure: false,
    noInputOnSubmit: false,
  };

  showUploadWidget() {
    cloudinary.openUploadWidget(
      {
        cloudName: 'dna-hvac',
        uploadPreset: 'oy9pw0ss',
        maxFiles: 10,
        sources: [
          'local',
          'url',
          'camera',
          'google_drive',
          'facebook',
          'dropbox',
          'instagram',
          'shutterstock',
          'image_search',
        ],

        //publicId: 'testId',
        folder: `${this.state.value.path}`,
        googleApiKey: '<image_search_google_api_key>',
        showAdvancedOptions: true,
        cropping: false,
        multiple: true,
        defaultSource: 'local',
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#C52A3A',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#C52A3A',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1',
          },
          fonts: {
            default: null,
            "'IBM Plex Sans', sans-serif": {
              url: 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans',
              active: true,
            },
          },
        },
      },
      (err, info) => {
        if (!err) {
          console.log('Upload Widget event - ', info);

          // window.location.reload();
        } else {
          alert(err);
        }
      }
    );
  }

  async getAllFolders(cb) {
    try {
      const res = await Axios.get(`${baseUrl}/folders`);

      //console.log(res.data);
      this.setState({
        ...this.state,
        folderData: await res.data.folders,
      });
      console.log(this.state);
      return await res.data.folders;
    } catch (error) {
      console.log(error.message);
    }
  }

  handleFolderInput(event) {
    this.setState({
      ...this.state,
      newFolderInput: event.target.value,
    });
  }

  async handleNewFolderSubmit() {
    const res = await Axios.post(`${baseUrl}/new-folder`, {
      new_folder_name: this.state.newFolderInput,
    });

    console.log(res.data);
    if (res.data.success) {
      this.setState({
        ...this.state,
        newFolderSuccess: await res.data.success,
      });

      setTimeout(() => {
        this.setState({
          ...this.state,
          newFolderSuccess: false,
        });
        this.forceUpdate();
      }, 3000);
    } else {
      this.setState({
        ...this.state,
        newFolderFailure: true,
      });

      setTimeout(() => {
        this.setState({
          ...this.state,
          newFolderFailure: false,
        });
        this.forceUpdate();
      }, 3000);
    }
  }

  componentDidMount(getAllFolders) {
    this.getAllFolders();
  }

  render() {
    /* if (this.state.fileData === undefined) {
      return <CircularProgress color="inherit" />;
    } else { */
    return (
      <ThemeProvider theme={theme}>
        <CloudinaryContext cloudName="dna-hvac">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <h1 style={{ textAlign: 'center' }}>DNA Media Managment</h1>

            <Box marginBottom="1rem">
              <form
                style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={(event) => {
                  event.preventDefault();
                  this.handleNewFolderSubmit();
                }}
              >
                <TextField
                  id="outlined-secondary"
                  label="Enter New Folder Name"
                  variant="outlined"
                  color="primary"
                  style={{ paddingBottom: '1rem', width: '18.5rem' }}
                  onChange={(event) => {
                    this.handleFolderInput(event);
                  }}
                />
                {this.state.newFolderInput === '' ? (
                  <React.Fragment />
                ) : (
                  <Button variant="contained" color="secondary" type="submit">
                    <AddCircleOutlineIcon
                      color="primary"
                      style={{ paddingRight: '0.5rem' }}
                    />{' '}
                    Add New Folder To Library
                  </Button>
                )}
              </form>
            </Box>

            <Autocomplete
              options={this.state.folderData}
              value={this.state.value}
              onChange={(event, newValue) => {
                this.setState({
                  ...this.state,
                  value: newValue,
                  inputValue: newValue,
                });
              }}
              inputValue={this.state.inputValue}
              onInputChange={(event, newInputValue) => {
                this.setState({ ...this.state, inputValue: newInputValue });
              }}
              id="controllable-states-demo"
              getOptionLabel={(option) => option.name}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Folder"
                  variant="outlined"
                />
              )}
            />
            <Button
              id="myId"
              variant="contained"
              color="primary"
              style={{ margin: '2rem 0 2rem 0' }}
              onClick={() => {
                this.state.inputValue === ''
                  ? this.setState({
                      ...this.state,
                      noInputOnSubmit: true,
                    })
                  : this.showUploadWidget(this.state.inputValue);

                setTimeout(() => {
                  this.setState({
                    ...this.state,
                    noInputOnSubmit: false,
                  });
                }, 3000);
                console.log(
                  this.state.inputValue,
                  'upload component being called'
                );
              }}
            >
              <CloudUploadIcon style={{ paddingRight: '0.5rem' }} /> Upload
            </Button>
            <Box marginBottom="5rem">
              <RecentImages jobFolders={this.state.folderData} />
            </Box>
          </Box>
          <Snackbar open={this.state.newFolderSuccess} autoHideDuration={6000}>
            <MuiAlert elevation={6} variant="filled" severity="success">
              New Folder Created
            </MuiAlert>
          </Snackbar>
          <Snackbar open={this.state.newFolderFailure} autoHideDuration={6000}>
            <MuiAlert elevation={6} variant="filled" severity="error">
              New Folder Creation Failed
            </MuiAlert>
          </Snackbar>
          <Snackbar open={this.state.noInputOnSubmit} autoHideDuration={6000}>
            <MuiAlert elevation={6} variant="filled" severity="warning">
              You Must Choose A Folder
            </MuiAlert>
          </Snackbar>
        </CloudinaryContext>
      </ThemeProvider>
    );
  }
  //}
}
