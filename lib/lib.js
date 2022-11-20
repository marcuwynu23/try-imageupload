
require('dotenv').config()


const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require("path")


function imageuploader(filename, imageName, folderName) {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET
	});
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(filename, {
			folder: "kalapatids/" + folderName,
			public_id: imageName,
			overwrite: true,
			unique_filename: false,
			use_filename: true
		})
			.then(uploadResult => {
				resolve(uploadResult.url);
			})
			.catch(error => {
				reject(error);
			});
	})
}


function uploadCloudImage(file, options = { rootDir: "", tempFolder: "temp", imageName: "img1", folderName: "" }) {
	return new Promise((resolve, reject) => {
		fs.mkdir(path.join(options.rootDir, "public", options.tempFolder), { recursive: true }, (err) => {
			if (err) throw err;
			file.mv(path.join(options.rootDir, "public", options.tempFolder, file.name), function (err) {
				if (err) {
					reject(err);
				}
				imageuploader(path.join(options.rootDir, "public", options.tempFolder, file.name), options.imageName, options.folderName).then((url) => {
					resolve(url);
				}).catch((err) => {
					reject(err);
				})
			});
		});
	})
}

module.exports.imageuploader = imageuploader
module.exports.uploadCloudImage = uploadCloudImage