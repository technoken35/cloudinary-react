import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { Image, CloudinaryContext } from 'cloudinary-react';
import React, { Component } from 'react';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
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
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UndoIcon from '@material-ui/icons/Undo';
import VisibilityIcon from '@material-ui/icons/Visibility';

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

/* handleOpen(){

} */

function ImgModal(props) {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        style={modalStyle}
        open={props.open}
        closeAfterTransition
        //BackdropComponent={Backdrop}
        //BackdropProps={{
        //timeout: 500,
        //}}
      >
        <Fade in={props.open}>
          <div style={{ background: '#FFFFFF' }}>
            <h2 id="transition-modal-title">Transition modal</h2>
            <p id="transition-modal-description">
              react-transition-group animates me.
            </p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default class RecentImages extends Component {
  state = {
    transactions: [],
    user: [],
    imgData: [],
    open: false,
    currentImg: '',
  };

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
    console.log(string, index);
    return correctFormat;
  }

  formatDate(string) {
    let correctFormat = string.slice(0, 10);
    return correctFormat;
  }

  componentDidMount(getAllImgData) {
    this.getAllImgData();
  }

  render() {
    if (this.state.imgData === undefined) {
      return (
        <React.Fragment>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
          <Skeleton width={skeletonWidth} height={skeletonHeight}></Skeleton>
          {console.log(this.state.imgData)}
        </React.Fragment>
      );
    } else {
      return (
        <div>
          <div style={rootStyle}>
            <GridList cols={2} cellHeight={180} style={gridListStyle}>
              <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                <ListSubheader component="div">Recent Images</ListSubheader>
              </GridListTile>
              {this.state.imgData[0] === undefined ? (
                <React.Fragment>
                  <Skeleton
                    width={skeletonWidth}
                    height={skeletonHeight}
                  ></Skeleton>
                  <Skeleton
                    width={skeletonWidth}
                    height={skeletonHeight}
                  ></Skeleton>
                  <Skeleton
                    width={skeletonWidth}
                    height={skeletonHeight}
                  ></Skeleton>
                  <Skeleton
                    width={skeletonWidth}
                    height={skeletonHeight}
                  ></Skeleton>
                  <Skeleton
                    width={skeletonWidth}
                    height={skeletonHeight}
                  ></Skeleton>
                  <Skeleton
                    width={skeletonWidth}
                    height={skeletonHeight}
                  ></Skeleton>
                  {console.log(this.state.imgData)}
                </React.Fragment>
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
                          <React.Fragment>
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
                          </React.Fragment>
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
