"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { HelpCircleIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import UploadFile from "@/components/ui/upload-file";
import { useCreateQuestion } from "@/http/use-create-question";
import { getAvailableSubjects } from "@/server/get-available-subjects";

const createQuestionSchema = z.object({
	title: z
		.string()
		.min(1, "O título é obrigatório.")
		.max(150, "O título deve ter no máximo 150 caracteres."),
	content: z
		.string()
		.min(1, "O conteúdo é obrigatório.")
		.max(5000, "O conteúdo deve ter no máximo 5000 caracteres."),
	subjectId: z.string("Selecione uma matéria."),
	file: z.any().optional(),
});

type CreateQuestionFormData = z.infer<typeof createQuestionSchema>;

export default function CreateQuestionModal() {
	const { mutateAsync: createQuestionFn, isPending } = useCreateQuestion();

	const form = useForm<CreateQuestionFormData>({
		resolver: zodResolver(createQuestionSchema),
		defaultValues: { title: "", content: "", subjectId: "" },
	});

	const { data: availableSubjects, isLoading: isLoadingSubjects } = useQuery({
		queryKey: ["subjects"],
		queryFn: getAvailableSubjects,
	});

	const onSubmit = async (data: CreateQuestionFormData) => {
		let fileUrl: string | undefined;
		const imageFile = data.file?.[0]?.file;

		try {
			if (imageFile && imageFile instanceof File) {
				toast.info("Fazendo upload do anexo...");
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
				fileUrl = blobResult.url;
			}

			const { file: _, ...questionData } = data;

			const promise = createQuestionFn({ ...questionData, file: fileUrl });

			toast.promise(promise, {
				loading: "Publicando sua pergunta...",
				success: () => {
					return "Pergunta publicada com sucesso!";
				},
				error: (err) => `Erro: ${err.message}`,
			});
		} catch (error) {
			console.error("Falha ao criar pergunta:", error);
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="rounded-full h-10 px-6 cursor-pointer text-white font-bold">
					<HelpCircleIcon className="mr-2 size-4" />
					Fazer uma pergunta
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Criar nova pergunta</DialogTitle>
					<DialogDescription>
						Detalhe sua dúvida para que a comunidade possa te ajudar.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Título</FormLabel>
									<FormControl>
										<Input
											placeholder="Ex: Como implementar uma árvore binária em JS?"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Conteúdo</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Descreva seu problema em detalhes..."
											className="min-h-[120px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="subjectId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Matéria</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isLoadingSubjects}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Selecione a matéria" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{availableSubjects?.map((subject) => (
												<SelectItem key={subject.id} value={subject.id}>
													{subject.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<UploadFile />

						<DialogFooter>
							<Button
								type="submit"
								form="create-question-form"
								className={`font-bold text-white cursor-pointer ${isPending && "cursor-not-allowed"}`}
								disabled={isPending}
							>
								{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Enviar pergunta
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
