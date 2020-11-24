import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import { Image } from 'cloudinary-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Axios from 'axios';
import Skeleton from '@material-ui/lab/Skeleton';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UndoIcon from '@material-ui/icons/Undo';
import VisibilityIcon from '@material-ui/icons/Visibility';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';

const baseUrl = 'https://desolate-everglades-01373.herokuapp.com';

const rootStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
};

const gridListStyle = {
  width: 375,
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle = {
  color: 'rgba(255, 255, 255, 0.54)',
};

const modalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const skeletonWidth = '50%';
const skeletonHeight = '13.125rem';

const transactionsWrapper = {
  //padding: '2rem',
  //marginBottom: '1rem',
  //minHeight: '60vh',
  //gap: '2rem',
};

/* handleOpen(){

} */

export default class RecentImages extends Component {
  state = {
    transactions: [],
    user: [],
    imgData: [],
    open: false,
    currentImg: '',
    dataView: 'Recent',
    folderData: [],
    imgDataTest: [],
  };

  async handleFolders() {
    if (this.state.dataView === 'Recent') {
      this.getAllImgData();
    } else {
      this.folderSearch();
    }
  }

  async folderSearch() {
    console.log('folder search fired');

    try {
      const res = await Axios.get(`${baseUrl}/search`, {
        folder_name: this.state.dataView,
      });
      console.log(await res.request);
      if ((await res.data) === undefined) {
        console.log('undefined no resources');
        console.log(res.data);
      } else {
        this.setState({
          imgData: await res.data,
        });
        console.log(res.data);
      }
    } catch (error) {
      console.log(error.message);
    }
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

  async getAllImgData(cb) {
    try {
      const res = await Axios.get(`${baseUrl}/`);

      //console.log(res.data);
      this.setState({
        imgData: await res.data,
      });
      console.log(this.state);
    } catch (error) {
      console.log(error.message);
    }
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      ...this.state,
      dataView: event.target.value,
    });
    this.handleFolders();
  };

  async deleteImg() {
    try {
      const res = await Axios.post(`${baseUrl}/delete`, {
        publicIDs: this.state.selectedImg,
      });

      this.setState({
        ...this.state,
        showDeletePrompt: false,
      });

      console.log(res.data);
      window.location.reload();
    } catch (error) {
      this.setState({
        ...this.state,
        showDeletePrompt: false,
      });
      alert(error.message);
      window.location.reload();
    }
  }

  formatString(string) {
    let index = string.search('dna-images/');
    // slice from start of dna-images+ 11 characters. Which is the length of dna-images/ substring
    let correctFormat = string.slice(index + 11);
    //console.log(string, index);
    return correctFormat;
  }

  formatDate(string) {
    let correctFormat = string.slice(0, 10);
    return correctFormat;
  }

  componentDidMount(getAllImgData) {
    this.getAllImgData();
    this.getAllFolders();
    //this.handleFolders();
  }

  render() {
    if (this.state.imgData[0] === undefined) {
      return (
        <div>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
        </div>
      );
    } else {
      return (
        <div>
          <div style={rootStyle}>
            <GridList cols={2} cellHeight={180} style={gridListStyle}>
              <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                <div style={transactionsWrapper}>
                  <Box
                    marginTop="1rem"
                    display="flex"
                    justifyContent="flex-end"
                  >
                    <FormControl>
                      <InputLabel
                        shrink
                        id="demo-simple-select-placeholder-label-label"
                      >
                        View
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        value={this.state.dataView}
                        onChange={this.handleChange}
                        displayEmpty
                        defaultValue="All"
                      >
                        <MenuItem value={'Recent'}>Recent Images</MenuItem>
                        {this.state.folderData[0] === undefined ? (
                          <MenuItem>Loading...</MenuItem>
                        ) : (
                          this.state.folderData.map((folder) => (
                            <MenuItem value={folder.path}>
                              {folder.name}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      <FormHelperText>Select History View</FormHelperText>
                    </FormControl>
                  </Box>
                  {this.state.dataView === 'Recent' ? (
                    <p>Recent Images </p>
                  ) : (
                    <p>{this.state.dataView}</p>
                  )}
                </div>
              </GridListTile>
              {this.state.imgData[0] === undefined ? (
                <p></p>
              ) : (
                this.state.imgData.map((cloudinaryImg) => (
                  <React.Fragment>
                    <GridListTile style={{}} key={cloudinaryImg.asset_id}>
                      <Image
                        style={{ height: 'auto', width: 375, margin: '0 auto' }}
                        publicId={cloudinaryImg.public_id}
                        alt={'alt'}
                      />
                      <GridListTileBar
                        title={this.formatString(cloudinaryImg.public_id)}
                        subtitle={this.formatDate(cloudinaryImg.created_at)}
                        actionIcon={
                          <Box component="span">
                            <IconButton
                              aria-label={`info about subtitle`}
                              style={iconStyle}
                              href={cloudinaryImg.secure_url}
                              onClick={() => {
                                this.setState({
                                  ...this.state,
                                  open: true,
                                  currentImg: cloudinaryImg.public_id,
                                });
                                console.log(
                                  this.state.currentImg,
                                  'current image'
                                );

                                console.log(this.props);
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              style={iconStyle}
                              onClick={() => {
                                this.setState({
                                  ...this.state,
                                  showDeletePrompt: true,
                                  selectedImg: cloudinaryImg.public_id,
                                });
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        }
                      />

                      <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        style={modalStyle}
                        open={this.state.open}
                        closeAfterTransition
                        //BackdropComponent={Backdrop}
                        //BackdropProps={{
                        //timeout: 500,
                        //}}
                      >
                        <Fade in={this.state.open}>
                          <div
                            style={{
                              background: `url("${cloudinaryImg.secure_url}") no-repeat center center/cover`,
                              width: '70vw',
                              height: '60vh',
                            }}
                          >
                            <h2 id="transition-modal-title">
                              Transition modal
                            </h2>

                            <Image publicId={cloudinaryImg.public_id}></Image>
                            <p id="transition-modal-description">
                              react-transition-group animates me.
                            </p>
                            <Button
                              onClick={() => {
                                /* this.setState({
                                  ...this.state,
                                  open: false,
                                }); */
                              }}
                            >
                              Close
                            </Button>
                          </div>
                        </Fade>
                      </Modal>
                    </GridListTile>
                    <Dialog
                      aria-labelledby="simple-dialog-title"
                      open={this.state.showDeletePrompt}
                    >
                      <DialogTitle id="simple-dialog-title">
                        Are you sure you want to delete
                      </DialogTitle>
                      <List>
                        <ListItem
                          button
                          onClick={() =>
                            this.setState({
                              ...this.state,
                              showDeletePrompt: false,
                            })
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <UndoIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={'Keep'} />
                        </ListItem>

                        <ListItem
                          autoFocus
                          button
                          onClick={() => {
                            this.deleteImg(this.state.selectedImg);
                            console.log(this.state.selectedImg, 'public id');
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <DeleteForeverIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Delete" />
                        </ListItem>
                      </List>
                    </Dialog>
                  </React.Fragment>
                ))
              )}
            </GridList>
          </div>
        </div>
      );
    }
  }
}

RecentImages.propTypes = {
  jobFolders: PropTypes.array,
};

/* 

<GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                <ListSubheader component="div">Recent Images</ListSubheader>
              </GridListTile>
              {this.state.imgData[0] === undefined ? (
                <p>no data</p>
              ) : (
                this.state.imgData.map((cloudinaryImg) => (
                  <GridListTile key={cloudinaryImg.asset_id}>
                    <Image publicId={cloudinaryImg.public_id} alt={'alt'} />
                    <GridListTileBar
                      title={'title'}
                      subtitle={<span>by: {'subtitle'}</span>}
                      actionIcon={
                        <IconButton
                          aria-label={`info about subtitle`}
                          style={iconStyle}
                        >
                          <InfoIcon />
                        </IconButton>
                      }
                    />
                  </GridListTile>
                ))
              )}


*/
