export async function uploadFileToS3(
  url: string,
  fields: Record<string, string>,
  file: File,
) {
  const formData = new FormData();
  Object.keys(fields).forEach((key) => {
    if (fields[key]) formData.append(key, fields[key]!);
  });
  formData.append("Content-Type", file.type);
  formData.append("file", file);
  await fetch(url, {
    method: "POST",
    body: formData,
  });
}
