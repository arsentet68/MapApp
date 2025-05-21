import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { LongPressEvent, Marker } from 'react-native-maps';
import { useMarkers } from '../context/MarkerContext';
import { MarkerData } from '../types';

export default function MapScreen() {
  const router = useRouter();
    // Храним список маркеров в контексте
  const { markers, addMarker } = useMarkers();
//отладочный вывод, потом удалить
      useEffect(() => {
    console.log('📌 [MapScreen] Текущий список маркеров:', markers);
  }, [markers]);

    // Эта функция срабатывает при долгом нажатии на карту
  const handleLongPress = (event: LongPressEvent) => {
    const { coordinate } = event.nativeEvent;
    const newMarker: MarkerData = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      id: Date.now().toString(), // генерируем уникальный id
      imageIds: []
    };
    addMarker(newMarker); // добавляем новый маркер в список
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onLongPress={handleLongPress} // назначаем обработчик
        initialRegion={{
          latitude: 55.751244,
          longitude: 37.618423,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => router.push(`/marker/${marker.id}`)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
