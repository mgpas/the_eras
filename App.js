import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image, ScrollView, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import dataTaylor from './dataTaylor.json';

const MyImage = require('./assets/Taylor.png');

const App = () => {
  const [showDate, setShowDate] = useState("");
  const [showData, setShowData] = useState(null);
  const [location, setLocation] = useState(null);
 
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);
 
  const handleSearch = () => {
    if (showDate.trim() === "") {
      Alert.alert('Aviso', 'Por favor, insira uma data de show válida.');
      return;
    }
 
    // Procurar o show correspondente na lista
    const foundShow = dataTaylor.find(show => show.dia === showDate);
 
    if (foundShow) {
      setShowData(foundShow);
    } else {
      Alert.alert('Erro', 'Show não encontrado. Verifique a data e tente novamente.');
    }
  };
 
  return (
    <ScrollView       
    contentContainerStyle={{ flexGrow: 1 }}
    keyboardShouldPersistTaps="handled"
    style={{ flex: 1, backgroundColor: '#020923' }}>
      <StatusBar
        backgroundColor="#77262b" // Defina a cor desejada para a barra de status
        barStyle="light-content" // Defina o estilo do texto na barra de status (light ou dark)
      />
<View style={{ flex: 1, padding: 20, backgroundColor: '#020923', justifyContent: 'center'}}>
<Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 20, color: '#F1E4C7' }}>
        Busca de Shows da Taylor Swift
</Text>
<TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        backgroundColor="#9caeb3"
        placeholder="Digite a data do show (ex: 17/03)"
        value={showDate}
        onChangeText={(text) => setShowDate(text)}
      />
<Button style={{ borderWidth: 1 }} 
color="#aa7266"
title="Buscar Show" 
onPress={handleSearch} />
      {showData && (
<View style={{ marginVertical: 20 }}>
<Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1E4C7' }}>Data: {showData.dia}</Text>
<Text style={{ color: '#F1E4C7' }}>Local: {showData.local}</Text>
<Text style={{ color: '#F1E4C7' }}>Músicas Surpresa:</Text>
          {showData.musicas.map((musica, index) => (
<Text style={{ color: '#F1E4C7' }} key={index}>- {musica}</Text>
          ))}
</View>
      )}
      {location && showData && (
        <MapView
          style={{ width: '100%', height: 200, marginVertical: 20 }}
          initialRegion={{
            latitude: showData.latitude || location.coords.latitude, // Usar latitude do show se disponível, senão usar a latitude atual
            longitude: showData.longitude || location.coords.longitude, // Usar longitude do show se disponível, senão usar a longitude atual
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: showData.latitude || location.coords.latitude, // Usar latitude do show se disponível, senão usar a latitude atual
              longitude: showData.longitude || location.coords.latitude, // Usar longitude do show se disponível, senão usar a longitude atual
            }}
            title="Localização do show"
          />
</MapView>
      )}
      {showData && (
<View style={{ marginVertical: 20 }}>
<Text style={{ fontSize: 16, color: '#F1E4C7' }}>Localização do show:</Text>
<Text style={{ color: '#F1E4C7' }}>Latitude: {showData.latitude}</Text>
<Text style={{ color: '#F1E4C7' }}>Longitude: {showData.longitude}</Text>
</View>
      )}
  {location && (
<View style={{ marginVertical: 20 }}>
<Text style={{ fontSize: 16, color: '#F1E4C7' }}>Sua localização atual:</Text>
<Text style={{ color: '#F1E4C7' }}>Latitude: {location.coords.latitude}</Text>
<Text style={{ color: '#F1E4C7' }}>Longitude: {location.coords.longitude}</Text>
</View>
      )}
      </View>
      <Image source={MyImage} style={{ width: 256, height: 185.6, position: 'absolute', bottom: 1, right: 0 }} />
</ScrollView>
  );
}
 
export default App;