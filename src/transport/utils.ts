export function resizeAndCompressImage(file: File) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx: any = canvas.getContext('2d');

      // Set the desired dimensions (example: half the original size)
      canvas.width = img.width / 2;
      canvas.height = img.height / 2;

      // Draw the image onto the canvas with the new dimensions
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a Blob
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/jpeg',
        0.85
      ); // Adjust the format and quality as needed
    };
    img.onerror = reject;
  });
}
