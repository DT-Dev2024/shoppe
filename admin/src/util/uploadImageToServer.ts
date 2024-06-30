import axios from "axios";

interface ImageUploadResponse {
  data: {
    url: string;
  };
}

export const uploadImageToCloud = async (
  apiKey: string,
  image: string,
  name: string
): Promise<string> => {
  try {
    const nameImage = Date.now + name;
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", nameImage);

    const response = await axios.post<ImageUploadResponse>(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData
    );

    return response.data.data.url;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};
