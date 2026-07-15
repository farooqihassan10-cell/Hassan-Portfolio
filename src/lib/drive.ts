import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Add Google Drive scopes as requested by the user and configured in OAuth setup
provider.addScope("https://www.googleapis.com/auth/drive");
provider.addScope("https://www.googleapis.com/auth/drive.file");

// Flag indicating active login popup state
let isSigningIn = false;
// Cache the access token in memory
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get access token from Google Auth");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// ==========================================
// GOOGLE DRIVE API FUNCTIONS
// ==========================================

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink?: string;
  iconLink?: string;
}

/**
 * List files from user's Google Drive
 */
export const listDriveFiles = async (accessToken: string, querySearch: string = ""): Promise<DriveFile[]> => {
  let q = "trashed = false";
  if (querySearch) {
    // Sanitize query string
    const escapedQuery = querySearch.replace(/'/g, "\\'");
    q += ` and (name contains '${escapedQuery}' or mimeType contains '${escapedQuery}')`;
  }

  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    q
  )}&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink)&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Drive list API error:", errText);
    throw new Error(`Failed to list files: ${response.statusText}`);
  }

  const data = await response.json();
  return data.files || [];
};

/**
 * Upload any File object to Google Drive (Multipart)
 */
export const uploadFileToDrive = async (accessToken: string, file: File): Promise<DriveFile> => {
  const metadata = {
    name: file.name,
    mimeType: file.type || "application/octet-stream",
  };

  const formData = new FormData();
  formData.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  formData.append("file", file);

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink,iconLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Drive upload API error:", errText);
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Create a simple Text Document in Google Drive
 */
export const createTextFile = async (
  accessToken: string,
  name: string,
  content: string
): Promise<DriveFile> => {
  const metadata = {
    name: name.endsWith(".txt") ? name : `${name}.txt`,
    mimeType: "text/plain",
  };

  const formData = new FormData();
  formData.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  formData.append("file", new Blob([content], { type: "text/plain" }));

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink,iconLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Drive text creation error:", errText);
    throw new Error(`Failed to create file: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Delete a file in Google Drive (Destructive: Needs confirmation in UI)
 */
export const deleteDriveFile = async (accessToken: string, fileId: string): Promise<boolean> => {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Drive delete API error:", errText);
    throw new Error(`Failed to delete file: ${response.statusText}`);
  }

  return true;
};
