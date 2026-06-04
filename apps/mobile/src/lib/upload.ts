const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

interface PresignResponse {
  uploadUrl: string;
  key: string;
}

interface ConfirmResponse {
  key: string;
  confirmed: boolean;
}

interface DownloadResponse {
  downloadUrl: string;
  key: string;
}

async function getHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Request a pre-signed upload URL from the API.
 */
export async function requestUploadUrl(
  token: string,
  filename: string,
  contentType: string
): Promise<PresignResponse> {
  const res = await fetch(`${API_URL}/uploads/presign`, {
    method: "POST",
    headers: await getHeaders(token),
    body: JSON.stringify({ filename, contentType }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get upload URL: ${res.status}`);
  }

  return res.json();
}

/**
 * Upload a file directly to R2 using the pre-signed URL.
 */
export async function uploadFile(
  uploadUrl: string,
  file: Blob | ArrayBuffer,
  contentType: string
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`);
  }
}

/**
 * Confirm the upload completed and get back the stored key.
 */
export async function confirmUpload(
  token: string,
  key: string
): Promise<ConfirmResponse> {
  const res = await fetch(`${API_URL}/uploads/confirm`, {
    method: "POST",
    headers: await getHeaders(token),
    body: JSON.stringify({ key }),
  });

  if (!res.ok) {
    throw new Error(`Confirm failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Get a pre-signed download URL for a stored file.
 */
export async function getDownloadUrl(
  token: string,
  key: string
): Promise<DownloadResponse> {
  const res = await fetch(`${API_URL}/uploads/${encodeURIComponent(key)}`, {
    method: "GET",
    headers: await getHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`Failed to get download URL: ${res.status}`);
  }

  return res.json();
}

/**
 * Full upload flow: request URL → upload file → confirm.
 */
export async function uploadAndConfirm(
  token: string,
  filename: string,
  contentType: string,
  file: Blob | ArrayBuffer
): Promise<{ key: string }> {
  const { uploadUrl, key } = await requestUploadUrl(token, filename, contentType);
  await uploadFile(uploadUrl, file, contentType);
  await confirmUpload(token, key);
  return { key };
}
