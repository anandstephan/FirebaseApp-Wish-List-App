import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import  firebase from 'firebase'
import { Container, Header, Content, Form, Item, Input, Label,Button, ListItem, List } from 'native-base';
import {firebaseConfig} from './config'
import Constants from 'expo-constants'

if(!firebase.apps.length)
firebase.initializeApp(firebaseConfig)



export default class App extends React.Component {
  
  state={
    text:"",
    mylist:[]
  }
  saveItem(){
    // console.log(this.state.text)
    const mywishes = firebase.database().ref("mywishes");
    mywishes.push().set({
      text:this.state.text,
      time:Date.now()
    })
    this.setState({text:""})
  }

  removeItem(){
  firebase.database().ref("mywishes").remove();
  list = [{"text":"There is no data in the database","time":"0987654321"}];    
  this.setState({"mylist":list})
  }


  componentDidMount(){
    const myitems = firebase.database().ref("mywishes")
  
    myitems.on("value",datasnap => {
      if(datasnap.val())
      this.setState({mylist:Object.values(datasnap.val())
      
    })
    })
  }


  render () {
    const myitems = this.state.mylist.map(item =>{
      return(
        <ListItem style={{justifyContent:"space-between"}} key={item.time}>
          <Text>{item.text}</Text>
          <Text>{new Date(item.time).toDateString()}</Text>
        </ListItem>
      )
    }) 
  return (
      <Container style={styles.container}>
            <Item floatingLabel>
              <Label>Add Items</Label>
              <Input
              value={this.state.text}
              onChangeText={text => this.setState({text})}
              />
              </Item>

              <View style={{flexDirection:"row",padding:20,justifyContent:"space-around"}}>
              <Button 
              rounded 
              success 
              style={styles.mybtn}
              onPress={() => this.saveItem()}
              >
            <Text style={styles.text} >Add</Text>
          </Button>
          <Button 
            rounded
            danger
            style={styles.mybtn}
            onPress={()=>this.removeItem()}
            >
            <Text style={styles.text}>Delete</Text>
          </Button>
          </View>
          <List>
            {myitems}
          </List>
          </Container>
    
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:Constants.statusBarHeight
  },
  mybtn:{
    padding:10,
    width:150,
    justifyContent:"center"
  },
  text:{
    color:"white",
    fontSize:25
  }
});
