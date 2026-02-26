import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { uploadExperiencePicture } from '../../services/pictureService';
import styles from './PhotoUploader.module.css';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  label?: string;
  maxPhotos?: number;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos, onChange, label, maxPhotos = 10,
}) => {
  const { t } = useTranslation('common');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = maxPhotos - photos.length;
    if (remaining <= 0) {
      setError(t('photoUploader.errorMax', { max: maxPhotos }));
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    setError(null);

    try {
      const results = await Promise.all(toUpload.map((file) => uploadExperiencePicture(file)));
      const urls = results.map((r) => r.url);
      onChange([...photos, ...urls]);
    } catch {
      setError(t('photoUploader.errorUpload'));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const canUploadMore = photos.length < maxPhotos;

  return (
    <div className={styles.uploader}>
      <label className={styles.label}>{label ?? t('photoUploader.label')}</label>

      {photos.length > 0 && (
        <div className={styles.grid}>
          {photos.map((url, i) => (
            <div key={url} className={styles.thumb}>
              <img src={url} alt={`Photo ${i + 1}`} />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removePhoto(i)}
                aria-label={t('photoUploader.removePhoto')}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {canUploadMore && (
        <div
          className={`${styles.dropzone}${uploading ? ` ${styles.dropzoneUploading}` : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className={styles.uploadingContent}>
              <span className={styles.spinner} />
              <span>{t('photoUploader.uploading')}</span>
            </div>
          ) : (
            <div className={styles.idleContent}>
              <ImageIcon size={28} strokeWidth={1.5} />
              <p className={styles.dropText}>
                {t('photoUploader.dragDrop')}{' '}
                <span className={styles.dropLink}>{t('photoUploader.browse')}</span>
              </p>
              <p className={styles.dropHint}>
                {t('photoUploader.hint', { current: photos.length, max: maxPhotos })}
              </p>
            </div>
          )}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default PhotoUploader;