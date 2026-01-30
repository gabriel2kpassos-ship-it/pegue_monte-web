"use client";

import { useState } from "react";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/lib/cloudinary";

type Props = {
  value?: string;
  onUploaded: (data: { url: string; publicId: string }) => void;
};

export function ImageUploader({ value, onUploaded }: Props) {
  const [loading, setLoading] = useState(false);

  async function upload(file: File) {
    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: form }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Falha no upload");
      }

      onUploaded({
        url: data.secure_url,
        publicId: data.public_id,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {value ? (
        <img
          src={value}
          alt="Prévia"
          className="h-44 w-full rounded-2xl object-cover border"
        />
      ) : (
        <div className="h-44 w-full rounded-2xl border bg-gray-50 flex items-center justify-center text-sm text-gray-500">
          Sem imagem
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        disabled={loading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />

      {loading ? <p className="text-sm text-gray-500">Enviando imagem…</p> : null}
    </div>
  );
}
