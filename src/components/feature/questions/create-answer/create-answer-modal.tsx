"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
// import UploadFile from "@/components/ui/upload-file";
import { useCreateAnswer } from "@/http/use-create-answer";
import Tiptap from "../../tiptap";

const createAnswerSchema = z.object({
	content: z
		.string()
		.min(1, "O conteúdo é obrigatório.")
		.max(5000, "O conteúdo deve ter no máximo 5000 caracteres."),
	file: z.any().optional(),
});

type CreateAnswerFormData = z.infer<typeof createAnswerSchema>;

type CreateAnswerModalProps = {
	questionId: string;
};

export default function CreateAnswerModal({
	questionId,
}: CreateAnswerModalProps) {
	const { mutateAsync: createanswerFn, isPending } = useCreateAnswer();
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		if (window.location.hash === "#answer") {
			setIsModalOpen(true);
		}
	}, []);

	const handleChangeModal = (open: boolean) => {
		if (!open) {
			const url = new URL(window.location.href);
			url.hash = "";
			window.history.replaceState(null, "", url.toString());

			setIsModalOpen(false);
		}
	};

	const form = useForm<CreateAnswerFormData>({
		resolver: zodResolver(createAnswerSchema),
		defaultValues: { content: "" },
	});

	const {
		formState: { errors },
	} = form;

	console.log("ERROS FORMULÁRIO", errors);

	const onSubmit = async (data: CreateAnswerFormData) => {
		console.log("ENVIANDO DADOS");

		let fileUrl: string | undefined;
		// const imageFile = data.file?.[0]?.file;
		try {
			//   if (imageFile && imageFile instanceof File) {
			//     toast.info("Fazendo upload do anexo...");
			//     const uploadResponse = await fetch(`/api/upload?filename=${encodeURIComponent(imageFile.name)}`, {
			//       method: 'POST',
			//       body: imageFile,
			//     });
			//     const blobResult = await uploadResponse.json();
			//     if (!uploadResponse.ok) throw new Error(blobResult.error || 'Falha ao fazer upload da imagem.');
			//     fileUrl = blobResult.url;
			//   }

			//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { file: _, ...answerData } = data;

			const promise = createanswerFn({
				...answerData,
				file: fileUrl,
				questionId,
			});

			console.log("PROMISE", promise);
		} catch (error) {
			console.error("Falha ao criar pergunta:", error);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleChangeModal}>
			<DialogContent className="sm:max-w-7xl ">
				<DialogHeader>
					<DialogTitle>Responder pergunta</DialogTitle>
					<DialogDescription>
						Ajude a comunidade respondendo a pergunta
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<Controller
							name="content"
							control={form.control}
							render={({ field }) => (
								<Tiptap content={field.value} onChange={field.onChange} />
							)}
						/>

						{/* <UploadFile /> */}

						<DialogFooter>
							<Button
								type="submit"
								className={`font-bold text-white cursor-pointer ${isPending && "cursor-not-allowed"}`}
								disabled={isPending}
							>
								{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Enviar resposta
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
