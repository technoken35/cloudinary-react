import React, { Component } from 'react';
import './App.css';
import Axios from 'axios';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import RecentImages from './components/RecentImages';
import CloudinaryContext from 'cloudinary-react/lib/components/CloudinaryContext';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '3rem',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

  root: {
    display: 'flex',
    // flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

const baseUrl = 'https://desolate-everglades-01373.herokuapp.com';

export default class App extends Component {
  state = {
    value: top100Films[0].title,
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
                  style={{ paddingBottom: '1rem' }}
                  onChange={(event) => {
                    this.handleFolderInput(event);
                  }}
                />
                {this.state.newFolderInput === '' ? (
                  <React.Fragment />
                ) : (
                  <Button variant="contained" color="secondary" type="submit">
                    <AddCircleOutlineIcon style={{ paddingRight: '0.5rem' }} />{' '}
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

                console.log(this.state.inputValue, 'input value');
                console.log(this.state.newValue, 'new value');
              }}
              inputValue={this.state.inputValue}
              onInputChange={(event, newInputValue) => {
                this.setState({ ...this.state, inputValue: newInputValue });
                console.log(this.state.inputValue);
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
              <RecentImages />
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

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  {
    title:
      'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];
