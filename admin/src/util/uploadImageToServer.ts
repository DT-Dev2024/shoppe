import { requestUploadImage } from "../service/network/Api";

interface ImageUploadResponse {
  filename: string;
  path: string;
  url: string;
}
export const uploadImageToServer = async (
  file: any
): Promise<ImageUploadResponse> => {
  try {
    const dataImage = new FormData();
    dataImage.append("file", file?.originFileObj);
    const resUploadImage = await requestUploadImage(dataImage);
    return resUploadImage.data as ImageUploadResponse;
  } catch (error) {
    throw error;
  }
};
