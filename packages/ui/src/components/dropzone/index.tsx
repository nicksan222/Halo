'use client';

import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardFooter } from '@acme/ui/components/card';
import { cn } from '@acme/ui/lib/utils';
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Image as ImageIcon, Trash2, Upload, Video as VideoIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { DropEvent, DropzoneOptions, FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';

// Context remains for compatibility with DropzoneContent/DropzoneEmptyState
// and for consumers that want to read accept/max/min/maxFiles/src.
// It is extended to include an optional onChange when using managed mode.

type DropzoneContextType = {
  src?: File[];
  accept?: DropzoneOptions['accept'];
  maxSize?: DropzoneOptions['maxSize'];
  minSize?: DropzoneOptions['minSize'];
  maxFiles?: DropzoneOptions['maxFiles'];
  onChange?: (files: File[]) => void;
  labels?: Required<DropzoneLabels>;
};

const renderBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)}${units[unitIndex]}`;
};

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined);

export type DropzoneLabels = {
  emptyTitle?: string;
  emptySubtitle?: string;
  acceptsPrefix?: string; // e.g. "Accepts"
  selectedCount?: (count: number) => string; // e.g. "1 item selected" / "N items selected"
  clear?: string;
  selectFiles?: string;
  replaceHint?: string; // e.g. "Drag and drop or click to replace"
};

const defaultLabels: Required<DropzoneLabels> = {
  emptyTitle: 'Drag files to upload',
  emptySubtitle: 'or click to select files',
  acceptsPrefix: 'Accepts',
  selectedCount: (n: number) => `${n} ${n === 1 ? 'item' : 'items'} selected`,
  clear: 'Clear',
  selectFiles: 'Select files',
  replaceHint: 'Drag and drop or click to replace'
};

export type DropzoneProps = Omit<DropzoneOptions, 'onDrop'> & {
  src?: File[];
  className?: string;
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => void;
  onChange?: (files: File[]) => void; // enable managed mode
  labels?: DropzoneLabels;
  children?: ReactNode; // legacy/custom rendering
};

export const Dropzone = ({
  accept,
  maxFiles = 1,
  maxSize,
  minSize,
  onDrop,
  onError,
  disabled,
  src,
  onChange,
  className,
  children,
  labels,
  ...props
}: DropzoneProps) => {
  const resolvedLabels = { ...defaultLabels, ...(labels ?? {}) };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    })
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onError,
    disabled,
    onDrop: (acceptedFiles, fileRejections, event) => {
      if (fileRejections.length > 0) {
        const message = fileRejections.at(0)?.errors.at(0)?.message;
        onError?.(new Error(message));
        return;
      }

      if (onChange) {
        const next = [...(src ?? []), ...acceptedFiles];
        const sliced = next.slice(0, maxFiles ?? next.length);
        onChange(sliced);
      }

      onDrop?.(acceptedFiles, fileRejections, event);
    },
    ...props
  });

  const hasFiles = !!src && src.length > 0;
  const ids = useMemo(() => (src ?? []).map((f, i) => `${i}-${f.name}`), [src]);

  function handleReorder(event: DragEndEvent) {
    if (!onChange || !src) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(src, oldIndex, newIndex));
  }

  function handleRemove(index: number) {
    if (!onChange || !src) return;
    const next = src.filter((_, i) => i !== index);
    onChange(next);
  }

  function handleClear(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    if (!onChange) return;
    onChange([]);
  }

  // Managed WordPress-like layout (when onChange + src provided)
  if (onChange) {
    return (
      <DropzoneContext.Provider
        key={JSON.stringify(src)}
        value={{ src, accept, maxSize, minSize, maxFiles, onChange, labels: resolvedLabels }}
      >
        <Card className={cn('overflow-hidden', className)}>
          <CardContent className="space-y-3 p-4">
            {!hasFiles ? (
              <div
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed py-10 text-center',
                  isDragActive && 'ring-1 ring-ring'
                )}
                {...getRootProps()}
              >
                <input {...getInputProps()} disabled={disabled} />
                <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Upload size={20} />
                </div>
                <p className="m-0 text-sm font-medium">{resolvedLabels.emptyTitle}</p>
                <p className="m-0 text-muted-foreground text-xs">{resolvedLabels.emptySubtitle}</p>
                <DropzoneEmptyState />
              </div>
            ) : (
              <div className="space-y-3">
                {/* Hidden input to ensure open() works even when files are present */}
                <input {...getInputProps()} className="hidden" disabled={disabled} />
                <div className="flex items-center justify-between gap-2">
                  <p className="m-0 text-sm text-muted-foreground">
                    {resolvedLabels.selectedCount(src.length)}
                  </p>
                </div>

                <DndContext sensors={sensors} onDragEnd={handleReorder}>
                  <SortableContext items={ids} strategy={rectSortingStrategy}>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {(src ?? []).map((file, index) => (
                        <DropzoneGridItem
                          key={ids[index]}
                          id={ids[index]}
                          file={file}
                          onRemove={() => handleRemove(index)}
                        />
                      ))}
                      {/* Add more tile */}
                      {(maxFiles === undefined || (src?.length ?? 0) < (maxFiles ?? Infinity)) && (
                        <li>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              open();
                            }}
                            className="flex h-full w-full items-center justify-center rounded-md border border-dashed py-8 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                            aria-label={resolvedLabels.selectFiles}
                            title={resolvedLabels.selectFiles}
                          >
                            <span className="text-2xl leading-none">+</span>
                          </button>
                        </li>
                      )}
                    </ul>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </CardContent>

          {hasFiles && (
            <CardFooter className="flex flex-col items-stretch justify-between gap-2 sm:flex-row">
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleClear}>
                  {resolvedLabels.clear}
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => open()}>
                  {resolvedLabels.selectFiles}
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </DropzoneContext.Provider>
    );
  }

  // Legacy/unmanaged mode preserves previous API: clickable area as a Button with children
  const { getRootProps: legacyRootProps, getInputProps: legacyInputProps } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onError,
    disabled,
    onDrop: (acceptedFiles, fileRejections, event) => {
      if (fileRejections.length > 0) {
        const message = fileRejections.at(0)?.errors.at(0)?.message;
        onError?.(new Error(message));
        return;
      }
      onDrop?.(acceptedFiles, fileRejections, event);
    },
    ...props
  });

  return (
    <DropzoneContext.Provider
      key={JSON.stringify(src)}
      value={{ src, accept, maxSize, minSize, maxFiles }}
    >
      <Button
        className={cn(
          'relative h-auto w-full flex-col overflow-hidden p-8',
          isDragActive && 'outline-none ring-1 ring-ring',
          className
        )}
        disabled={disabled}
        type="button"
        variant="outline"
        {...legacyRootProps()}
      >
        <input {...legacyInputProps()} disabled={disabled} />
        {children}
      </Button>
    </DropzoneContext.Provider>
  );
};

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error('useDropzoneContext must be used within a Dropzone');
  }

  return context;
};

export type DropzoneContentProps = {
  children?: ReactNode;
  className?: string;
};

const maxLabelItems = 3;

export const DropzoneContent = ({ children, className }: DropzoneContentProps) => {
  const { src } = useDropzoneContext();

  if (!src) {
    return null;
  }

  if (children) {
    return children;
  }

  // Check if all files are images
  const allImages = src.every((file) => file.type.startsWith('image/'));

  if (allImages && src.length === 1) {
    // Single image - show preview
    const file = src[0];
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className="relative mb-2">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="h-16 w-16 rounded-md object-cover"
            onLoad={(e) => {
              // Clean up the object URL after the image loads
              URL.revokeObjectURL(e.currentTarget.src);
            }}
          />
        </div>
        <p className="w-full truncate text-wrap text-muted-foreground text-xs">{file.name}</p>
        <p className="w-full text-wrap text-muted-foreground text-xs">
          Drag and drop or click to replace
        </p>
      </div>
    );
  }

  if (allImages && src.length > 1) {
    // Multiple images - show grid of previews
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {src.slice(0, 4).map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-8 w-8 rounded object-cover"
                onLoad={(e) => {
                  URL.revokeObjectURL(e.currentTarget.src);
                }}
              />
              {index === 3 && src.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded text-white text-xs">
                  +{src.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="w-full truncate text-wrap text-muted-foreground text-xs">
          {src.length > maxLabelItems
            ? `${new Intl.ListFormat('en').format(
                src.slice(0, maxLabelItems).map((file) => file.name)
              )} and ${src.length - maxLabelItems} more`
            : new Intl.ListFormat('en').format(src.map((file) => file.name))}
        </p>
        <p className="w-full text-wrap text-muted-foreground text-xs">
          Drag and drop or click to replace
        </p>
      </div>
    );
  }

  // Non-image files - show original text display
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Upload size={16} />
      </div>
      <p className="my-2 w-full truncate font-medium text-sm">
        {src.length > maxLabelItems
          ? `${new Intl.ListFormat('en').format(
              src.slice(0, maxLabelItems).map((file) => file.name)
            )} and ${src.length - maxLabelItems} more`
          : new Intl.ListFormat('en').format(src.map((file) => file.name))}
      </p>
      <p className="w-full text-wrap text-muted-foreground text-xs">{defaultLabels.replaceHint}</p>
    </div>
  );
};

export type DropzoneEmptyStateProps = {
  children?: ReactNode;
  className?: string;
};

export const DropzoneEmptyState = ({ children, className }: DropzoneEmptyStateProps) => {
  const { src, accept, maxSize, minSize, maxFiles, labels } = useDropzoneContext();

  if (src) {
    return null;
  }

  if (children) {
    return children;
  }

  let caption = '';

  if (accept) {
    caption += `${labels?.acceptsPrefix ?? 'Accepts'} `;
    caption += new Intl.ListFormat('en').format(Object.keys(accept));
  }

  if (minSize && maxSize) {
    caption += ` between ${renderBytes(minSize)} and ${renderBytes(maxSize)}`;
  } else if (minSize) {
    caption += ` at least ${renderBytes(minSize)}`;
  } else if (maxSize) {
    caption += ` less than ${renderBytes(maxSize)}`;
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Upload size={16} />
      </div>
      <p className="my-2 w-full truncate text-wrap font-medium text-sm">
        Upload {maxFiles === 1 ? 'a file' : 'files'}
      </p>
      <p className="w-full truncate text-wrap text-muted-foreground text-xs">
        Drag and drop or click to upload
      </p>
      {caption && <p className="text-wrap text-muted-foreground text-xs">{caption}.</p>}
    </div>
  );
};

function DropzoneGridItem({
  id,
  file,
  onRemove
}: {
  id: string;
  file: File;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  } as React.CSSProperties;

  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative aspect-square overflow-hidden rounded-md border bg-muted',
        isDragging && 'z-10 scale-[1.02] opacity-75'
      )}
      {...attributes}
    >
      <div className="absolute left-1 top-1 z-10">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-7 w-7 cursor-grab"
          {...listeners}
          aria-label="Drag to reorder"
          onClick={(e) => {
            // prevent triggering any parent click handlers
            e.stopPropagation();
          }}
        >
          <GripVertical size={14} />
        </Button>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute right-1 top-1 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md bg-background/90 text-foreground shadow-sm ring-1 ring-border transition hover:bg-background"
        aria-label="Remove"
      >
        <Trash2 size={14} />
      </button>

      {isImage && objectUrl ? (
        <img src={objectUrl} alt={file.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
          {isVideo ? <VideoIcon size={24} /> : <ImageIcon size={24} />}
          <span className="line-clamp-2 px-2 text-center text-xs">{file.name}</span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/50 p-2 text-white">
        <p className="m-0 truncate text-xs">{file.name}</p>
      </div>
    </li>
  );
}
