import React, { useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Crop, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { addProductImage } from '@/api/administrator/productManagement';

const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginRight: '10px',
    backgroundColor: '#ffffff',
    cursor: 'grab',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const ImageCrop = ({ variant, setVariants, index }) => {




  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState({ src: "", index: 0 });
  const [croppedImage, setCroppedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage({ src: reader.result, index: -1 });
      setIsModalOpen(true);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    handleAddImageToVariant(index, croppedImage, image.index);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setImage({ src: "", index: 0 });
  };

  const OpenCropper = (imageSrc, imgIndex) => {
    setImage({ src: imageSrc, index: imgIndex });
    setIsModalOpen(true);
  };

  const handleAddImageToVariant = async (variantIndex, imageDataUrl, croppedIndex) => {
    const blob = dataURLtoBlob(imageDataUrl);

    setVariants((prev) => {
      const updated = [...prev];
      const newId = Date.now() + Math.random();

      if (croppedIndex === -1) {
        updated[variantIndex].images.push({
          id: newId,
          imageUrl: imageDataUrl,
          blob,
          progress: 0
        });
      } else {
        updated[variantIndex].images[croppedIndex].blob = blob;
      }

      const formData = new FormData();
      formData.append('image', blob, `image-${Date.now()}.png`);
      formData.append('filename', newId);

      try {
        addProductImage(formData, variantIndex, updated[variantIndex].images.length - 1, setVariants)
          .catch((error) => {


          })

      } catch (error) {

      }

      return updated;
    });

  };


  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleRemoveImageFromVariant = (variantIndex, imageIndex) => {

    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex].images.splice(imageIndex, 1);
      return updated;
    });
  };

  const handleDrop = useCallback((index, e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(index, files);
  }, []);

  const handleFiles = (index, files) => {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataUrl = e.target.result;
          handleAddImageToVariant(index, imageDataUrl, -1);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = variant.images.findIndex(img => img.imageUrl === active.id);
      const newIndex = variant.images.findIndex(img => img.imageUrl === over.id);
      const updatedItems = [...variant.images];

      updatedItems.splice(oldIndex, 1);
      updatedItems.splice(newIndex, 0, variant.images[oldIndex]);

      setVariants((prev) => {
        const updatedVariants = [...prev];
        updatedVariants[index].images = updatedItems;
        return updatedVariants;
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex flex-wrap w-96 gap-4 mt-2 p-4 border-2 border-dashed rounded-md justify-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(index, e)}
      >
        {/* <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={variant?.images.map(img => img?.imageUrl)}
            strategy={horizontalListSortingStrategy}
            className="p-0 shadow-none"
          > */}
        <label className="w-full h-24 flex items-center justify-center rounded-md cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFiles(index, e.target.files)}
            multiple
          />
          <p className="text-sm text-gray-500 mt-2">Drag and drop images here or click to select files</p>
        </label>
        {/* </SortableContext>
        </DndContext> */}
      </div>

      <div className='flex flex-wrap mt-4 gap-2'>
        {variant.images.map((img, imgIndex) => (
          // <SortableItem key={img?.imageUrl} id={img?.imageUrl} className="p-0 shadow-none">
          <div key={imgIndex} className="relative h-24 w-24">
            <img
              src={img?.blob ? URL.createObjectURL(img.blob) : img?.imageUrl}
              alt="product"
              className="w-24 h-24 object-cover rounded-md"
              style={{ clipPath: `inset(${100 - img.progress}% 0 0 0)` }}
            />

            {/* Overlay for Cropper */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-slate-200 bg-opacity-25 cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();

                OpenCropper(img?.imageUrl, imgIndex);
              }}
            >
              <Crop className="h-6 w-6 text-white opacity-100 hover:text-slate-200" />
            </div>

            {/* Remove Button */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 z-10"
              onClick={(e) => {
                e.stopPropagation(); // Prevents the event from bubbling up
                handleRemoveImageFromVariant(index, imgIndex);
              }}

            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          // </SortableItem>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-full bg-white p-4 rounded-lg flex flex-col items-center">
            <CropImage
              imageSrc={image.src}
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

const CropImage = ({ imageSrc, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(4 / 3);

  const handleCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImage);
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

export default ImageCrop;
