"use client";

import { createContext, useContext } from "react";

export const FormActivityContext = createContext<{ busy: boolean; setUploading: (name: string, uploading: boolean) => void; markChanged: () => void }>({
  busy: false,
  setUploading: () => {},
  markChanged: () => {},
});
export const useFormActivity = () => useContext(FormActivityContext);
