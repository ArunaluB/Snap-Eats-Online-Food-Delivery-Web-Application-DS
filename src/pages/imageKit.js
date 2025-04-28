// imageKit.js

import ImageKit from 'imagekit';

const imageKit = new ImageKit({
  publicKey: 'public_pPSo4kEfBmsTnZsqw24ukoa9xa0=',
  privateKey: 'private_kTbg************************',
  urlEndpoint: 'https://ik.imagekit.io/iuqvbuoaa'
});

export const uploadToImageKit = (file) => {
  return new Promise((resolve, reject) => {
    const fileName = `${new Date().getTime()}-${file.name}`;
    const filePath = `/driver-registration/${fileName}`;

    imageKit.upload({
      file,
      fileName,
      folder: '/driver-registration', // or another path
      useUniqueFileName: true,
    }, function(error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result.url);
      }
    });
  });
};
