"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { HelpCircleIcon, Loader2 } from "lucide-react"
import { getAvailableSubjects } from "@/server/get-available-subjects"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import UploadFile from "@/components/ui/upload-file"
import Tiptap from "@/components/ui/tiptap"
import { is } from "zod/v4/locales"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const createAnswerSchema = z.object({
  content: z.string().min(1, "O conteúdo é obrigatório.").max(5000, "O conteúdo deve ter no máximo 5000 caracteres."),
  questionId: z.string().min(1, "ID da pergunta é obrigatório"),
  file: z.any().optional()
});

type CreateAnswerFormData = z.infer<typeof createAnswerSchema>;

export default function CreateAnswerModal() {
  // const { mutateAsync: createanswerFn, isPending } = useCreateanswer();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.location.hash === '#answer') {
      setIsModalOpen(true);
    }
  }, [pathname, searchParams]);

  const handleChangeModal = (open: boolean) => {
    if (!open) {
      const url = new URL(window.location.href);
      url.hash = '';
      window.history.replaceState(null, '', url.toString());

      setIsModalOpen(false);
    }
  }

  const isPending = false; // Placeholder for actual mutation function

  const form = useForm<CreateAnswerFormData>({
    resolver: zodResolver(createAnswerSchema),
    defaultValues: { content: "", questionId: "" },
  });

  const onSubmit = async (data: CreateAnswerFormData) => {
    console.log("ENVIANDO DADOS");

    // let fileUrl: string | undefined = undefined;
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
      //   const { file: _, ...answerData } = data;

      // const promise = createanswerFn({ ...answerData, file: fileUrl });


    } catch (error) {
      console.error("Falha ao criar pergunta:", error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleChangeModal}>
      <DialogContent className="sm:max-w-7xl h-3/4">
        <DialogHeader>
          <DialogTitle>
            Responder pergunta
          </DialogTitle>
          <DialogDescription>
            Ajude a comunidade respondendo a pergunta
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tiptap />


            <UploadFile />

            <DialogFooter>
              <Button type="submit" className={`font-bold text-white cursor-pointer ${isPending && "cursor-not-allowed"}`} disabled={isPending}>
                {isPending && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                Enviar pergunta
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}