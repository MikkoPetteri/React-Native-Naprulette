import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, PermissionsAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IconBtn from './components/IconBtn';
import NumInput from './components/NumInput';
import ImgGif from './components/ImgViewr';
import Notifications from './components/Notifications';
import DreamData from './components/DreamData';

const napGif = require('./assets/img/napbear.gif');
const idleGif = require('./assets/img/wannaplaydog.gif');
const wakeGif = require('./assets/img/wakecock.gif');
const abortGif = require('./assets/img/cancel.gif');

export default function App() {

  const {regstatus, requestPermission} = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  if (regstatus === null) {
    requestPermission();
  };

  const {chkstatus, checkPermission} = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  if (chkstatus === null) {
    checkPermission();
  };
  
  const [showHistory, setShowHistory] = useState(false);
  const [showNap, setShowNap] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [inputValMinHr, setInputValMinHr] = useState(""); 
  const [inputValMinMin, setInputValMinMin] = useState(""); 
  const [inputValMaxHr, setInputValMaxHr] = useState(""); 
  const [inputValMaxMin, setInputValMaxMin] = useState("");
  
  const NapData = {
    minhr: inputValMinHr,
    minmin: inputValMinMin,
    maxhr: inputValMaxHr,
    maxmin: inputValMaxMin
  };

  const lookHistory = () => {
    setShowHistory(true);
    setShowNap(false);
    setShowSettings(false);
  };
  const playNap = () => {
    setShowHistory(false);
    setShowNap(true);
    setShowSettings(false);
  };
  const setSet = () => {
    setShowHistory(false);
    setShowNap(false);
    setShowSettings(true);
  };

  const handleChangeMinHr = (text) => { 
    const numericValue = text.replace(/[^0-9]/g, ""); // Only numbers 
    setInputValMinHr(numericValue); 
  }; 
  const handleChangeMinMin = (text) => { 
    const numericValue = text.replace(/[^0-9]/g, ""); 
    setInputValMinMin(numericValue); 
  }; 
  const handleChangeMaxHr = (text) => { 
    const numericValue = text.replace(/[^0-9]/g, ""); 
    setInputValMaxHr(numericValue); 
  }; 
  const handleChangeMaxMin = (text) => { 
    const numericValue = text.replace(/[^0-9]/g, ""); 
    setInputValMaxMin(numericValue); 
  }; 

  const clearNapdata = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Nap Data cleared!');
      setInputValMinHr(''); 
      setInputValMinMin('');
      setInputValMaxHr('');
      setInputValMaxMin('');
    } catch (error) {
      console.log(error);
    }
  };
  const setNapData = async () => {
    try {
      await AsyncStorage.setItem("napdata", JSON.stringify(NapData));
      console.log('Nap Data Saved!');
    } catch (error) {
      console.log(error);
    }
  };
  const getNapData = async () => {
    try {
      const savedNapData = JSON.parse(await AsyncStorage.getItem("napdata"))
      if( savedNapData !== null){
        //console.log(savedNapData);
        setInputValMinHr((savedNapData.minhr.replace(/[^0-9]/g, ""))); 
        setInputValMinMin((savedNapData.minmin.replace(/[^0-9]/g, ""))); 
        setInputValMaxHr((savedNapData.maxhr.replace(/[^0-9]/g, ""))); 
        setInputValMaxMin((savedNapData.maxmin.replace(/[^0-9]/g, ""))); 
      }
      else{
        console.log('No Nap Data');
      }
    } catch (error) {
     console.log(error); 
    }
  };
  getNapData();

  const getRandomNap = () => {
    console.log(inputValMinHr);
    const minNapVal = Number(inputValMinMin) + Number((60 * inputValMinHr));
    const maxNapVal = Number(inputValMaxMin) + Number((60 * inputValMaxHr));
    const rndmNap = Math.floor((Math.random() * (maxNapVal-minNapVal+1)) + minNapVal);
    console.log(' Min %d, Max %d, Rndm %d', minNapVal, maxNapVal, rndmNap); 

    const now = Date.now()+(120*60000); 
    var nowStr = new Date(now).toISOString();
    const target = now + (rndmNap*60000);
    var napTag = new Date(target).toISOString();
    console.log(' Now %d / %s -> Target %d / %s', now, nowStr, target, napTag);

    Notifications.schduleNotification(new Date(Date.now() + 5*1000));

  };
  const abortNap = () => {
    Notifications.setClearAndCancelAll();
  };

  var napIdling = true;
  var napNapping = false;
  var napWaking = false;
  var napAborting = false;

  const checkstate = () => {
    useEffect(() => {

      const napState = DreamData.getNapState();
      console.log(napState);
      if(napState.localeCompare('Idle')==0 || napState.localeCompare('None')==0)
      {
        napIdling = true;
        napNapping = false;
        napWaking = false;
        napAborting = false;
      }
      else if(napState.localeCompare('Nap')==0){
        napIdling = false;
        napNapping = true;
        napWaking = false;
        napAborting = false;
      }
      else if(napState.localeCompare('Wake')==0){
        napIdling = false;
        napNapping = false;
        napWaking = true;
        napAborting = false;
      }
      else if(napState.localeCompare('Abort')==0){
        napIdling = false;
        napNapping = false;
        napWaking = false;
        napAborting = true;
      }
      else{
        console.error('FAIL!')
      }
    });

  };
  checkstate();

  const napPlay = () => {
    getRandomNap();
  };
  const napCancel = () => {
    abortNap();
    setTimeout(napIdle, 5000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        { showHistory ? (
          <View style={styles.cntContainer}>
            <Text style={{ color: '#fff' }}>Written to history!</Text>
            <Text style={{ color: '#fff' }}> ... WIP ... </Text>
          </View>
          ) : 
          showNap ? (
            <View style={styles.cntContainer}>
              
              <Text style={{ color: '#fff' }}>Lets Play Nap Rulette!</Text>
              { napNapping ? (
                  <ImgGif imgSrc={napGif}></ImgGif>
                ) :
                napWaking ? (
                  <View>
                  <ImgGif imgSrc={wakeGif}></ImgGif>
                  </View>
                ) : 
                napIdling ? (
                  <ImgGif imgSrc={idleGif}></ImgGif>
                ) :
                napAborting ? (
                  <ImgGif imgSrc={abortGif}></ImgGif>
                ) :
                (<ImgGif imgSrc={idleGif}></ImgGif>)
              }

              <View style={styles.playBtnContainer}>
                <View style={styles.playBtnRow}>
                <IconBtn icon="play-arrow" label="Lets Nap!" onPress={napPlay} />
                <IconBtn icon="cancel" label="No Nap!" onPress={napCancel} />
                </View>
              </View>
            </View>
          ) :
          showSettings ? (
            <View style={styles.cntContainer}>
              <Text style={{ color: '#fff' }}>Setting Settings...</Text>
      
              <View style={styles.settingContainer}>
              <Text style={{ color: '#fff' }}>Minium hours of nap: </Text>
              <NumInput label="Min Hr" inputValue={inputValMinHr} handleChange={handleChangeMinHr} />
              </View>
              
              <View style={styles.settingContainer}>
              <Text style={{ color: '#fff' }}>Minium minutes of nap: </Text>
              <NumInput label="Min Min" inputValue={inputValMinMin} handleChange={handleChangeMinMin} />
              </View>
                  
              <View style={styles.settingContainer}>
              <Text style={{ color: '#fff' }}>Maximum hours of nap: </Text>
              <NumInput label="Max Hr" inputValue={inputValMaxHr} handleChange={handleChangeMaxHr} />
              </View>
              
              <View style={styles.settingContainer}>
              <Text style={{ color: '#fff' }}>Maximum minutes of nap: </Text>
              <NumInput label="Max Min" inputValue={inputValMaxMin} handleChange={handleChangeMaxMin} />
              </View>

              <View style={styles.settingBtnContainer}>
                <View style={styles.settingBtnRow}>
                <IconBtn icon="save" label="Save" onPress={setNapData} />
                <IconBtn icon="clear" label="Clear" onPress={clearNapdata} />
                </View>
              </View>
            </View>
          ) : 
          (<Text style={{ color: '#fff' }}>LOL Noob!</Text>)
        }

      </View>

      <View style={styles.modalContainer}>
          <View style={styles.modalRow}>
            <IconBtn icon="history" label="" onPress={lookHistory} />
            <IconBtn icon="alarm" label="" onPress={playNap} />
            <IconBtn icon="settings" label="" onPress={setSet} />
          </View>
      </View>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    paddingTop: 30,
  },
  cntContainer: {
    flexGrow: 1,
    paddingTop: 20,
    alignItems: 'center',
    alignContent: 'center,'
  },
  settingContainer: {
    paddingTop: 20,
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 10,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 50,
  },
  modalRow: {
    alignItems: 'center',
    gap: 50,
    flexDirection: 'row',
  },
  settingBtnContainer: {
    paddingTop: 30,
  },
  settingBtnRow: {
    alignItems: 'center',
    gap: 50,
    flexDirection: 'row',
  },
  playBtnContainer: {
    paddingTop: 30,
  },
  playBtnRow: {
    alignItems: 'center',
    gap: 50,
    flexDirection: 'row',
  },

});
