"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z4 from "zod/v4";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { UploadAvatar } from "../upload-avatar";

const MAXLENGTH = 180;

const createAccountFormSchema = z4.object({
	name: z4.string("Seu nome").min(1, "Informe o nome completo"),
	email: z4.string().min(1, "Informe o nome de usuário"),
	profile_picture: z4.url().optional(),
	bio: z4.string().max(180, "Bio deve ter no máximo 180 caracteres").optional(),
	password: z4
		.string()
		.nonempty("Este campo é obrigatório")
		.min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type CreateAccountFormData = z4.infer<typeof createAccountFormSchema>;

export default function Register() {
	const {
		characterCount,
		handleChange,
		maxLength: limit,
	} = useCharacterLimit({
		maxLength: MAXLENGTH,
		initialValue:
			"Insira uma breve descrição sobre você. Este campo é opcional.",
	});

	const {
		handleSubmit,
		register,
		setError,
		formState: { isSubmitting },
	} = useForm<CreateAccountFormData>({
		resolver: zodResolver(createAccountFormSchema),
	});

	async function handleCreateAccount(credentials: CreateAccountFormData) {
		try {
			const responseData = await fetch("api/auth/user/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(credentials),
			});

			const response = await responseData.json();

			if (!responseData.ok) {
				if (response.status === 409) {
					setError("email", { message: response.error });
				}

				throw new Error(response.message || "Erro ao criar conta");
			}

			toast.success("Seu cadastro foi concluido", {
				description: "Você vai ser redirecionado para a página inicial.",
				action: {
					label: "Fechar",
					onClick: () => console.log("Fechar"),
				},
			});
		} catch (error) {
			toast.error("Por favor, tente novamente mais tarde.", {
				description:
					`Erro: ${(error instanceof Error ? error.message : String(error))}`,
				action: {
					label: "Fechar",
					onClick: () => console.log("Fechar"),
				},
			});
			console.log("Error creating account:", error);
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Registrar</Button>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
				<form
					className="space-y-4"
					onSubmit={handleSubmit(handleCreateAccount)}
				>
					<DialogHeader className="contents space-y-0 text-left">
						<DialogTitle className="border-b px-6 py-4 text-base">
							Cria conta
						</DialogTitle>
					</DialogHeader>
					<DialogDescription className="sr-only">
						Crie uma conta para acessar todos os recursos.
					</DialogDescription>
					<div className="overflow-y-auto">
						<ProfileBg />
						<UploadAvatar />
						<div className="px-6 pt-4 pb-6">
							<div className="flex flex-col gap-4 sm:flex-row">
								<div className="flex-1 space-y-2">
									<Label htmlFor={`first-name`}>Nome</Label>
									<Input {...register("name", { required: true })} />
								</div>
							</div>
							<div className="mt-2">
								<Label htmlFor={`email`}>Email</Label>
								<div className="relative">
									<Input
										{...register("email", { required: true })}
										type="email"
									/>
								</div>
							</div>
							<div className="mt-2">
								<Label htmlFor={`website`}>Senha</Label>
								<div className="flex rounded-md shadow-xs">
									<Input
										{...register("password", { required: true })}
										type="password"
									/>
								</div>
							</div>
							<div className="mt-2">
								<Label htmlFor={`bio`}>Bio</Label>
								<Textarea
									{...register("bio", { required: false })}
									maxLength={MAXLENGTH}
									onChange={handleChange}
								/>
								{/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
								<p
									id={`description`}
									className="text-muted-foreground mt-2 text-right text-xs"
									role="status"
									aria-live="polite"
								>
									<span className="tabular-nums">{limit - characterCount}</span>{" "}
									caracteres restantes
								</p>
							</div>
						</div>
					</div>
					<DialogFooter className="border-t px-6 py-4">
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isSubmitting} className="text-slate-50 font-medium">
							{isSubmitting ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : null}
							Registrar
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function ProfileBg() {

	return (
		<div className="h-32">
			<div className="bg-muted relative flex size-full items-center justify-center overflow-hidden">
				{/* <div className="absolute inset-0 flex items-center justify-center gap-2">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
            onClick={openFileDialog}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div> */}
			</div>
		</div>
	);
}
