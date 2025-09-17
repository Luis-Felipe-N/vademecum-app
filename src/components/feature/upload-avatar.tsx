import { ImagePlusIcon } from "lucide-react";
import Image from "next/image";
import { useFileUpload } from "@/hooks/use-file-upload";

export function UploadAvatar() {
	const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
		accept: "image/*",
	});

	const currentImage = files[0]?.preview || null;

	return (
		<div className="-mt-10 px-6">
			<div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
				{currentImage && (
					<Image
						src={currentImage}
						className="size-full object-cover"
						width={80}
						height={80}
						alt="Profile image"
					/>
				)}
				<button
					type="button"
					className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
					onClick={openFileDialog}
					aria-label="Change profile picture"
				>
					<ImagePlusIcon size={16} aria-hidden="true" />
				</button>
				<input
					{...getInputProps()}
					name="profile_picture"
					className="sr-only"
					aria-label="Upload profile picture"
				/>
			</div>
		</div>
	);
}
