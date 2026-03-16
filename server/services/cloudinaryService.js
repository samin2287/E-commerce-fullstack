const cloudinary = require("cloudinary").v2;
const uploadToCloudinary = async (file, folder) => {
  try {
    const base64String = file.buffer.toString("base64");
    const dataUrl = `data:${file.mimetype};base64,${base64String}`;
    return await cloudinary.uploader.upload(dataUrl, { folder });
  } catch (error) {
    console.log(error);
  }
};
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { uploadToCloudinary, deleteFromCloudinary };
