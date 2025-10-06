"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UploadAvatar } from "@/components/feature/upload-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useUpdateProfile } from "@/http/use-update-profile";

const MAXLENGTH = 180;

const profileSchema = z.object({
	name: z.string().min(1, "O nome é obrigatório."),
	bio: z
		.string()
		.max(MAXLENGTH, "A biografia deve ter no máximo 180 caracteres.")
		.optional(),
	profile_picture: z.any().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
	const { data: sessionData, update: updateSession } = useSession();
	const { mutateAsync: updateprofileFn } = useUpdateProfile()

	const {
		characterCount,
		handleChange,
		maxLength: limit,
	} = useCharacterLimit({
		maxLength: MAXLENGTH,
		initialValue: sessionData?.user.bio || "",
	});

	const form = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: sessionData?.user.name || "",
			bio: sessionData?.user.bio || "",
			profile_picture: sessionData?.user.profilePicture
		},
	});

	const {
		handleSubmit,
		formState: { isSubmitting },
		control,
	} = form;
	const onSubmit = async (data: ProfileFormData) => {
		let profilePictureUrl: string | undefined;
		console.log(data)
		try {
			const hasProfilePicture = data.profile_picture?.[0].file instanceof File

			if (hasProfilePicture) {
				const imageFile = data.profile_picture[0].file
				toast.info("Fazendo upload da imagem...");
				const uploadResponse = await fetch(
					`/api/upload?filename=${encodeURIComponent(imageFile.name)}`,
					{
						method: "POST",
						body: imageFile,
					},
				);
				const blobResult = await uploadResponse.json();
				if (!uploadResponse.ok)
					throw new Error(
						blobResult.error || "Falha ao fazer upload da imagem.",
					);
				profilePictureUrl = blobResult.url;
			}

			const {profile_picture: _, ...dataWithoutFile} = data

			const updatedUser = await updateprofileFn({profilePicture: profilePictureUrl, ...dataWithoutFile})

			updateSession({
				user: {
					name: updatedUser.name,
					email: updatedUser.email,
					profilePicture: updatedUser.profilePicture,
					bio: updatedUser.bio,
				},
			});
		} catch (error) {
		}
		await updateprofileFn(data)
	}

	if (!sessionData?.user) {
		return null;
	}

	return (
		<main className="w-full">
			<div className="absolute top-[-180px] left-[400px] z-10 h-[150px] w-[400px] rotate-[0deg] transform rounded-full bg-gradient-to-tl from-slate-800 via-cyan-500 to-zinc-400 blur-[150px]"></div>
			<div className="relative mx-auto z-30 ">
				<div className="py-10">
					<div className="">
						<Form {...form}>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="">
					<UploadAvatar />
				</div>
								<FormField
									control={control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nome</FormLabel>
											<FormControl>
												<Input {...field} placeholder="Seu nome completo" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={control}
									name="bio"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Bio</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Fale um pouco sobre você (opcional)"
													{...field}
													maxLength={MAXLENGTH}
													onChange={(e) => {
														field.onChange(e);
														handleChange(e);
													}}
												/>
											</FormControl>
											<div className="text-muted-foreground mt-2 text-right text-xs">
												<span className="tabular-nums">
													{limit - characterCount}
												</span>{" "}
												caracteres restantes
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" disabled={isSubmitting} className="text-white">
									Salvar
								</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>

		</main>
	);
}
