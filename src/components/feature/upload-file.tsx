"use client";

import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { useFileUpload } from "@/hooks/use-file-upload";

type UploadFileProps = {
	name: string;
	maxSizeMB?: number;
	accept?: string;
	label?: string;
	initialFileUrl?: string;
	isAvatar?: boolean;
};

export default function UploadFile({
	name,
	maxSizeMB = 5,
	accept = "image/*",
	label = "Arraste e solte ou clique para enviar",
	initialFileUrl,
	isAvatar = false,
}: UploadFileProps) {
	const { control } = useFormContext();
	const { field } = useController({ name, control });

	const maxSize = maxSizeMB * 1024 * 1024;

	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		accept,
		maxSize,
		initialFiles: initialFileUrl
			? [
					{
						url: initialFileUrl,
						name: "initial",
						size: 0,
						type: "image",
						id: "initial",
					},
				]
			: [],
		onFilesChange: (newFiles) => {
			field.onChange(newFiles);
		},
	});

	const previewUrl = files[0]?.preview || null;

	useEffect(() => {
		if (initialFileUrl) {
			field.onChange([
				{
					file: {
						url: initialFileUrl,
						name: "initial",
						size: 0,
						type: "image",
						id: "initial",
					},
					id: "initial",
					preview: initialFileUrl,
				},
			]);
		}
	}, [initialFileUrl, field]);

	const containerClasses = isAvatar
		? "border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10"
		: "border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]";

	const buttonClasses = isAvatar
		? "focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
		: "absolute top-4 right-4 focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]";

	const imageSize = isAvatar ? 80 : 1000;

	return (
		<div className="flex flex-col gap-2">
			<div className="relative">
				<button
          type="button"
					onClick={openFileDialog}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					data-dragging={isDragging || undefined}
					className={containerClasses}
				>
					<input
						{...getInputProps()}
						name={name}
						className="sr-only"
						aria-label="Upload file"
					/>
					{previewUrl ? (
						<div className="absolute inset-0">
							<Image
								width={imageSize}
								height={imageSize}
								src={previewUrl}
								alt={files[0]?.file?.name || "Uploaded image"}
								className="size-full object-cover"
							/>
						</div>
					) : (
						!isAvatar && (
							<div className="flex flex-col items-center justify-center px-4 py-3 text-center">
								<div
									className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
									aria-hidden="true"
								>
									<ImageUpIcon className="size-4 opacity-60" />
								</div>
								<p className="mb-1.5 text-sm font-medium">{label}</p>
								<p className="text-muted-foreground text-xs">
									Tamanho máximo: {maxSizeMB}MB
								</p>
							</div>
						)
					)}
				</button>
				{previewUrl && (
					<div className={buttonClasses}>
						<button
							type="button"
							className="z-50 flex size-full items-center justify-center rounded-full"
							onClick={() => {
								removeFile(files[0]?.id);
								field.onChange([]);
							}}
							aria-label="Remove image"
						>
							<XIcon className="size-4" aria-hidden="true" />
						</button>
					</div>
				)}
			</div>

			{errors.length > 0 && (
				<div
					className="text-destructive flex items-center gap-1 text-xs"
					role="alert"
				>
					<AlertCircleIcon className="size-3 shrink-0" />
					<span>{errors[0]}</span>
				</div>
			)}
		</div>
	);
}
