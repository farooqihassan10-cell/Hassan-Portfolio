import React, { useEffect, useRef, useState } from "react";
import { 
  Cloud, 
  UploadCloud, 
  Plus, 
  Search, 
  LogOut, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  FileText, 
  FileCode, 
  FileImage, 
  FileSpreadsheet, 
  FileArchive, 
  File, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  FolderOpen
} from "lucide-react";
import gsap from "gsap";
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  listDriveFiles, 
  uploadFileToDrive, 
  createTextFile, 
  deleteDriveFile, 
  DriveFile 
} from "../lib/drive";
import { User } from "firebase/auth";

export default function DriveHub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);

  // Drive API State
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isFilesLoading, setIsFilesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Create File State
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [isCreatingTextFile, setIsCreatingTextFile] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Drag and Drop Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Custom Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Initialize Authentication and Listeners
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setIsAuthLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsAuthLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // 2. Load files once authenticated
  useEffect(() => {
    if (token) {
      fetchFiles();
    } else {
      setFiles([]);
    }
  }, [token]);

  // 3. Scroll Entrance Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              headingRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
            );
            gsap.fromTo(
              contentRef.current,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
            );
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // API Call: Fetch Files
  const fetchFiles = async () => {
    if (!token) return;
    setIsFilesLoading(true);
    setErrorMessage("");
    try {
      const data = await listDriveFiles(token, searchQuery);
      setFiles(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Could not load your Google Drive files. The session might have expired.");
    } finally {
      setIsFilesLoading(false);
    }
  };

  // Trigger search on query change (with custom debounce or manual refresh)
  useEffect(() => {
    if (token) {
      const delayDebounceFn = setTimeout(() => {
        fetchFiles();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery]);

  // Login handler
  const handleLogin = async () => {
    setIsLoginInProgress(true);
    setErrorMessage("");
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Authentication failed. Please verify popup blocker settings.");
    } finally {
      setIsLoginInProgress(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setFiles([]);
    } catch (err) {
      console.error("Sign-out failed", err);
    }
  };

  // Create text file handler
  const handleCreateTextFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newFileName.trim()) return;

    setIsCreatingTextFile(true);
    setErrorMessage("");
    try {
      await createTextFile(token, newFileName, newFileContent);
      setNewFileName("");
      setNewFileContent("");
      setCreateSuccess(true);
      setTimeout(() => setCreateSuccess(false), 4000);
      fetchFiles();
    } catch (err: any) {
      setErrorMessage("Failed to create the document on Google Drive.");
    } finally {
      setIsCreatingTextFile(false);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!token) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      uploadSingleFile(droppedFiles[0]);
    }
  };

  // File Input Change handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token) return;
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      uploadSingleFile(selectedFiles[0]);
    }
  };

  // Upload implementation
  const uploadSingleFile = async (file: File) => {
    if (!token) return;
    setIsUploading(true);
    setErrorMessage("");
    setUploadedFileName(file.name);
    try {
      await uploadFileToDrive(token, file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
      fetchFiles();
    } catch (err: any) {
      setErrorMessage(`Failed to upload "${file.name}" to Google Drive.`);
    } finally {
      setIsUploading(false);
    }
  };

  // Open custom modal for delete confirmation
  const requestDeleteFile = (file: DriveFile) => {
    setFileToDelete(file);
    setDeleteModalOpen(true);
  };

  // Confirm delete handler
  const confirmDeleteFile = async () => {
    if (!token || !fileToDelete) return;
    setIsDeleting(true);
    setErrorMessage("");
    try {
      await deleteDriveFile(token, fileToDelete.id);
      setDeleteModalOpen(false);
      setFileToDelete(null);
      fetchFiles();
    } catch (err: any) {
      setErrorMessage(`Failed to delete "${fileToDelete.name}".`);
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format File Size
  const formatBytes = (bytesStr?: string) => {
    if (!bytesStr) return "N/A";
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return "N/A";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Get responsive icon based on mimeType
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return <FileText className="w-5 h-5 text-rose-400" />;
    if (mimeType.includes("image")) return <FileImage className="w-5 h-5 text-emerald-400" />;
    if (mimeType.includes("javascript") || mimeType.includes("typescript") || mimeType.includes("html") || mimeType.includes("css") || mimeType.includes("json")) {
      return <FileCode className="w-5 h-5 text-cyan-400" />;
    }
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType.includes("csv")) {
      return <FileSpreadsheet className="w-5 h-5 text-teal-400" />;
    }
    if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar") || mimeType.includes("compressed")) {
      return <FileArchive className="w-5 h-5 text-amber-400" />;
    }
    if (mimeType.includes("text")) return <FileText className="w-5 h-5 text-purple-400" />;
    return <File className="w-5 h-5 text-white/50" />;
  };

  return (
    <section
      ref={containerRef}
      id="drive"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 select-none bg-[#050505] overflow-hidden border-t border-white/5"
    >
      {/* Background glow elements */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-900/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        
        {/* Section Heading */}
        <div ref={headingRef} className="flex flex-col items-center text-center mb-16 opacity-0 transform-gpu">
          <span className="font-mono text-[10px] text-purple-400 tracking-[0.4em] uppercase mb-3">
            SECURE INTEGRATION // WORKSPACE_DRIVE
          </span>
          <h3 className="font-serif italic text-white text-3xl md:text-5xl font-light tracking-wide">
            Drive Hub
          </h3>
          <div className="w-12 h-[1px] bg-white/10 mt-4"></div>
          <p className="text-white/40 text-xs tracking-wider mt-4 font-mono max-w-lg leading-relaxed">
            Connect your personal Google Drive to safely upload project briefs, view reference documents, or generate text proposals instantly.
          </p>
        </div>

        {/* Content Container */}
        <div ref={contentRef} className="opacity-0 transform-gpu">
          
          {/* 1. AUTHENTICATION GATE */}
          {isAuthLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-4" />
              <span className="font-mono text-xs text-white/40 tracking-widest uppercase">Connecting to Google Services...</span>
            </div>
          ) : !token ? (
            <div className="glass-panel max-w-xl mx-auto p-8 md:p-12 rounded-[32px] border border-white/10 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white/[0.01] pointer-events-none"></div>
              
              <div className="mx-auto w-16 h-16 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center mb-6">
                <Cloud className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>

              <h4 className="font-serif italic text-white text-xl md:text-2xl font-light tracking-wide mb-3">
                Unlock Secure Asset Vault
              </h4>
              <p className="text-white/50 text-xs sm:text-sm tracking-wide leading-relaxed mb-8 max-w-md mx-auto">
                Sign in with Google to enable secure access to Google Drive. You will be able to store, view, and organize assets directly within this luxury portal.
              </p>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-900/30 flex items-start gap-3 text-left">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-rose-300 font-mono tracking-wide leading-normal">{errorMessage}</span>
                </div>
              )}

              {/* GOOGLE SIGN-IN BUTTON (GSI Style) */}
              <button 
                onClick={handleLogin}
                disabled={isLoginInProgress}
                className="gsi-material-button mx-auto scale-105 active:scale-95 transition-transform"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents font-sans text-xs tracking-wider font-semibold">
                    {isLoginInProgress ? "Initializing pop-up..." : "Sign in with Google"}
                  </span>
                </div>
              </button>

            </div>
          ) : (
            
            /* 2. AUTHENTICATED VAULT INTERFACE */
            <div className="flex flex-col gap-8">
              
              {/* TOP DASHBOARD BAR */}
              <div className="glass-panel p-6 rounded-[24px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || "User"} 
                      className="w-12 h-12 rounded-full border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-serif text-lg font-bold text-purple-400">
                      {user?.displayName?.[0] || "U"}
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] font-mono text-purple-400 tracking-widest uppercase">ACTIVE VAULT CONNECTION</div>
                    <div className="font-serif italic text-white text-lg tracking-wide">
                      {user?.displayName || "Google Drive Connected"}
                    </div>
                    <div className="text-[9px] font-mono text-white/30 tracking-widest mt-0.5">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={fetchFiles}
                    disabled={isFilesLoading}
                    className="p-3 bg-white/[0.02] border border-white/5 hover:border-white/15 text-white/60 hover:text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs font-mono tracking-wider disabled:opacity-50"
                    title="Refresh listing"
                  >
                    <RefreshCw className={`w-4 h-4 ${isFilesLoading ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">REFRESH</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-3 bg-red-950/10 border border-red-900/10 hover:border-red-900/30 text-rose-400 hover:bg-red-950/20 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs font-mono tracking-wider"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>DISCONNECT</span>
                  </button>
                </div>
              </div>

              {/* MAIN INTERACTIVE WORKSPACE GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* LEFT SIDE: CREATIVE TOOLS (Upload + Text Brief Document Creator) */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                  
                  {/* TOOL 1: DESIGN BRIEF / TEXT NOTES CREATOR */}
                  <div className="glass-panel p-6 sm:p-8 rounded-[24px] border border-white/5 relative overflow-hidden">
                    <span className="font-mono text-[9px] text-purple-400 tracking-[0.3em] uppercase block mb-4">
                      CREATOR // NOTE_GENERATOR
                    </span>
                    <h4 className="font-serif italic text-white text-xl font-light tracking-wide mb-2">
                      New Project Brief
                    </h4>
                    <p className="text-white/40 text-[11px] leading-relaxed mb-6 font-mono">
                      Instantly draft custom briefs, technical proposal logs, or references and upload them directly to Google Drive as a clean text file.
                    </p>

                    {createSuccess && (
                      <div className="mb-4 p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 flex items-center gap-2.5 text-left text-emerald-300">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span className="text-[10px] font-mono tracking-wide">Document synced with Drive!</span>
                      </div>
                    )}

                    <form onSubmit={handleCreateTextFile} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Document Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hassan_Farooqi_Brief"
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          className="bg-white/[0.02] border border-white/5 focus:border-white/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all placeholder:text-white/10 font-sans"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Content / Proposal text</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Write the specifications or requirements details here..."
                          value={newFileContent}
                          onChange={(e) => setNewFileContent(e.target.value)}
                          className="bg-white/[0.02] border border-white/5 focus:border-white/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all placeholder:text-white/10 font-sans resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isCreatingTextFile || !newFileName.trim()}
                        className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs tracking-widest font-mono text-white text-center flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                      >
                        {isCreatingTextFile ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <span>CREATE FILE</span>
                            <Plus className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* TOOL 2: DRAG & DROP FILE UPLOADER */}
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`glass-panel p-6 sm:p-8 rounded-[24px] border transition-all duration-300 relative overflow-hidden text-center flex flex-col items-center justify-center ${
                      isDragging 
                        ? "border-purple-500 bg-purple-950/10 scale-[1.02]" 
                        : "border-white/5 hover:border-white/15"
                    }`}
                  >
                    <span className="font-mono text-[9px] text-cyan-400 tracking-[0.3em] uppercase block mb-4 self-start">
                      DRAG_DROP // DROP_BOX
                    </span>

                    {/* Hidden inputs to capture click trigger */}
                    <input
                      type="file"
                      id="drive-file-picker"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4 transition-colors">
                      <UploadCloud className={`w-6 h-6 ${isDragging ? "text-purple-400 scale-110" : "text-white/40"} transition-all`} />
                    </div>

                    <h5 className="font-serif italic text-white text-base tracking-wide mb-1">
                      Upload Assets
                    </h5>
                    <p className="text-white/40 text-[10px] leading-relaxed mb-6 font-mono max-w-xs">
                      Drag files into this box, or click to explore local files and sync securely with Google Drive.
                    </p>

                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2 w-full">
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                        <span className="text-[9px] font-mono text-purple-400 tracking-widest uppercase">
                          UPLOADING: {uploadedFileName.length > 20 ? uploadedFileName.substring(0, 17) + "..." : uploadedFileName}
                        </span>
                      </div>
                    ) : uploadSuccess ? (
                      <div className="flex flex-col items-center gap-1.5 text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-300">
                          SYNCED SUCCESSFULLY
                        </span>
                      </div>
                    ) : (
                      <label 
                        htmlFor="drive-file-picker"
                        className="py-2.5 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] tracking-widest font-mono text-white transition-all cursor-pointer select-none active:scale-95"
                      >
                        BROWSE FILES
                      </label>
                    )}
                  </div>

                </div>

                {/* RIGHT SIDE: DRIVE FILE EXPLORER (Search, list, and delete) */}
                <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-[24px] border border-white/5 flex flex-col min-h-[500px]">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="font-mono text-[9px] text-purple-400 tracking-[0.3em] uppercase block">
                        EXPLORER // ACTIVE_LISTING
                      </span>
                      <h4 className="font-serif italic text-white text-2xl font-light tracking-wide mt-1">
                        Files Vault
                      </h4>
                    </div>

                    {/* SEARCH INPUT */}
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all placeholder:text-white/20 font-sans"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-900/30 flex items-start gap-3 text-left">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-rose-300 font-mono tracking-wide leading-normal">{errorMessage}</span>
                    </div>
                  )}

                  {/* FILE LIST OR LOADING STATE */}
                  {isFilesLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
                      <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase">REFRESHING INDEX...</span>
                    </div>
                  ) : files.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-12 h-12 rounded-full bg-white/[0.01] border border-white/5 flex items-center justify-center mb-4 text-white/20">
                        <FolderOpen className="w-5 h-5" />
                      </div>
                      <h5 className="font-serif italic text-white text-base tracking-wide mb-1">
                        No files detected
                      </h5>
                      <p className="text-white/30 text-[10px] leading-relaxed max-w-xs font-mono">
                        {searchQuery ? "No files match your query. Try a different term." : "Your Google Drive asset vault is empty. Upload design briefs or notes on the left."}
                      </p>
                    </div>
                  ) : (
                    /* FILE LIST SCROLL CONTAINER */
                    <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 flex flex-col gap-2 scrollbar-thin">
                      {files.map((file) => (
                        <div 
                          key={file.id}
                          className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] rounded-2xl transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center">
                              {getFileIcon(file.mimeType)}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-medium text-white/90 tracking-wide block truncate max-w-[180px] sm:max-w-[320px]">
                                {file.name}
                              </span>
                              <div className="flex items-center gap-2 mt-1 font-mono text-[9px] text-white/30 tracking-wider">
                                <span>{formatBytes(file.size)}</span>
                                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                <span>{new Date(file.modifiedTime).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white rounded-xl border border-white/5 hover:border-white/20 transition-all active:scale-90"
                                title="Open in Google Drive"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => requestDeleteFile(file)}
                              className="p-2.5 bg-red-950/5 hover:bg-red-950/20 text-rose-400/60 hover:text-rose-400 rounded-xl border border-red-900/5 hover:border-red-900/30 transition-all active:scale-90"
                              title="Delete File"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-white/20 tracking-widest uppercase">
                    <span>SECURITY STATUS: SECURE (SSL)</span>
                    <span>{files.length} ITEMS DETECTED</span>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* 3. CUSTOM DESTRUCTIVE CONFIRMATION MODAL */}
      {deleteModalOpen && fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 select-none bg-[#050505]/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-8 rounded-[32px] border border-red-900/20 shadow-[0_20px_50px_rgba(239,68,68,0.1)] text-center relative overflow-hidden">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5 text-rose-400">
              <Trash2 className="w-5 h-5 animate-pulse" />
            </div>

            <h4 className="font-serif italic text-white text-xl font-light tracking-wide mb-2">
              Confirm Destruction
            </h4>
            
            <p className="text-white/60 text-xs tracking-wide leading-relaxed mb-6">
              Are you absolutely sure you want to delete <strong className="text-white">"{fileToDelete.name}"</strong> from your Google Drive? This action is permanent and cannot be undone.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setFileToDelete(null);
                }}
                disabled={isDeleting}
                className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] tracking-widest font-mono text-white transition-all cursor-pointer disabled:opacity-50"
              >
                CANCEL
              </button>
              <button
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-[10px] tracking-widest font-mono text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-rose-500/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>CONFIRM DELETE</span>
                    <Trash2 className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
