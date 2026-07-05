const ImageKit = require('imagekit');

const imageKit = new ImageKit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT
})


const uploadFile = async (file, fileName) => {
    const result = await imageKit.upload({
        file:file,
        fileName:fileName
    })
    return result;
}

const deleteFile = async (fileId) => {
    try {
        if(!fileId) return null;
        const result = await imageKit.deleteFile(fileId);
        return result
    } catch (error) {
        console.error("ImageKit Deletion Error:", error.message);
        return null
    }
}
module.exports = {
    uploadFile,
    deleteFile
}