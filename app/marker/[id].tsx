import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMarkers } from '../../context/MarkerContext';
import { ImageData } from '../../types';

export default function MarkerDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { markers, updateMarker, images, addImage, removeImage } = useMarkers();

    console.log("🔍 Полученный id из параметров:", id);
    console.log("📍 Список маркеров:", markers);

    const marker = markers.find((m) => m.id === id);
    console.log("✅ Найденный маркер:", marker);

    if (!marker) {
        return (
            <View style={styles.container}>
                <Text>Маркер не найден</Text>
                <Button title="Назад" onPress={() => router.back()} />
            </View>
        );
    }

    // берём только изображения, относящиеся к этому маркеру
    const markerImages = (marker.imageIds || [])
        .map((id) => images.find((img) => img.id === id))
        .filter((img): img is ImageData => img !== undefined);

    // Функция выбора изображения
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                // создаём объект изображения и получаем его id
                const imageId = addImage(uri);
                // добавляем imageId в текущий маркер
                updateMarker(marker.id, {
                    imageIds: [...(marker.imageIds || []), imageId],
                });
            }
        } catch (error) {
            alert('Ошибка при выборе изображения');
        }
    };
    
    // Функция удаления изображения и обновления маркера
    const deleteImage = (imageId: string) => {
        Alert.alert(
            "Удаление изображения",
            "Вы уверены, что хотите удалить это изображение?",
            [
                {
                    text: "Отмена",
                    style: "cancel",
                },
                {
                    text: "Удалить",
                    style: "destructive",
                    onPress: () => {
                        removeImage(imageId);
                        updateMarker(marker.id, {
                            imageIds: marker.imageIds.filter((id) => id !== imageId),
                        });
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Маркер ID: {id}</Text>
            <Text>Широта: {marker.latitude}</Text>
            <Text>Долгота: {marker.longitude}</Text>
            <Button title="Добавить изображение" onPress={pickImage} />
            <FlatList
                data={markerImages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onLongPress={() => deleteImage(item.id)}>
                        <Image source={{ uri: item.uri }} style={styles.image} />
                    </TouchableOpacity>
                )
                }
                horizontal
                showsHorizontalScrollIndicator={false}
            />
            <Button title="Назад к карте" onPress={() => router.back()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10,
    },
});