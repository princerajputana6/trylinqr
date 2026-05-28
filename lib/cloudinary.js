import { v2 as cloudinary } from 'cloudinary';

// Accept either of two common env naming conventions:
//   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
//   CLOUDINARY_NAME                   / CLOUDINARY_API_KEY / CLOUDINARY_SECRET_KEY
export const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  '';
export const API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const API_SECRET =
  process.env.CLOUDINARY_API_SECRET ||
  process.env.CLOUDINARY_SECRET_KEY ||
  '';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export function cloudinaryConfigured() {
  return Boolean(CLOUD_NAME && API_KEY && API_SECRET);
}

export function signUpload(paramsToSign) {
  return cloudinary.utils.api_sign_request(paramsToSign, API_SECRET);
}

export default cloudinary;
