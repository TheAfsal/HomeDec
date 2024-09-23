import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';


const ImageCrop = ({ index, handleAddImageToVariant }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setIsModalOpen(true);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const fileInput = document.getElementById(`imageInput-${index}`);
    setIsModalOpen(false);
    handleAddImageToVariant(index, croppedImage)
    fileInput.value = '';
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setImage(null);
  };

  return (
    <div className="App">
      <input
        id={`imageInput-${index}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />


      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="w-2/3 bg-white p-4 rounded-lg flex flex-col items-center">
            <CropImage
              imageSrc={image}
              onCropComplete={(croppedImg) => setCroppedImage(croppedImg)}
            />
            <div className='flex gap-5'>
              <button
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCrop;



function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      resolve(canvas.toDataURL('image/jpeg'));
    };
  });
}



const CropImage = ({ imageSrc, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(4 / 3);

  const handleCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImage); // Pass cropped image to parent
  }, [imageSrc, onCropComplete]);

  return (
    <div className="w-full h-96 relative">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onCropComplete={handleCropComplete}
        onZoomChange={setZoom}
      />
      <input
        type="range"
        min={1}
        max={3}
        step={0.1}
        value={zoom}
        onChange={(e) => setZoom(e.target.value)}
        className="mt-2"
      />
    </div>
  );
};
