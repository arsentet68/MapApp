
export interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  imageIds: string[]; // массив id изображений, связанных с маркером
}

export interface ImageData {
  id: string;
  uri: string;
}
