// config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dopoyie4z', // Replace with your actual cloud name
  api_key: '125663332979577', // Replace with your actual API key
  api_secret: 'iQ-o7o4s6iFlk4u9h2plw00-RbE', // Replace with your actual API secret
});

export default cloudinary;
