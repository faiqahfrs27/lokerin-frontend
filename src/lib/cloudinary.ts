import axios from "axios";
import { axiosInstance } from "./axios";

export async function uploadToCloudinary(file: File): Promise<string> {
  const sigRes = await axiosInstance.post("/cloudinary/sign");
  const { signature, timestamp, apiKey, cloudName, folder } = sigRes.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData,
  );
  return uploadRes.data.secure_url;
}