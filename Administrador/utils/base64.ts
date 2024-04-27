export function toBase64(
  file: File,
): Promise<string | ArrayBuffer | null | undefined> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (success) =>
      resolve((success.target?.result as string).split(";base64,")[1]);
    reader.onerror = (error) => reject(error);
  });
}

export function toBase64Base(
  file: File,
): Promise<string | ArrayBuffer | null | undefined> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (success) => resolve(success.target?.result);
    reader.onerror = (error) => reject(error);
  });
}
