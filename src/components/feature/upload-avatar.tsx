
"use client";

import { useFormContext } from "react-hook-form";
import UploadFile from "./upload-file";

export function UploadAvatar() {
  const { control } = useFormContext();
  const initialFile = control._defaultValues?.profile_picture?.[0]?.file?.url || null;

  return (
      <UploadFile
        name="profile_picture"
        accept="image/*"
        isAvatar
        initialFileUrl={initialFile}
      />
  );
}