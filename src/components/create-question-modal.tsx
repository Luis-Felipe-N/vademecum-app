"use client"

import { HelpCircleIcon, Loader2 } from "lucide-react"

import { useCharacterLimit } from "@/hooks/use-character-limit"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useQuery } from "@tanstack/react-query"
import { useCreateQuestion } from "@/http/use-create-question"
import { toast } from "sonner"
import type { CreateQuestionData } from "@/types/question"

type getAvailableSubjectsResponse = {
  id: string
  name: string
}[]

async function getAvailableSubjects() { 
  const response = await fetch("/api/subject/list")
  const data: getAvailableSubjectsResponse = await response.json()

  return data
}
const MAX_LENGHT = 2000

export default function CreateQuestionModal() {
  const { mutateAsync: createQuestion } = useCreateQuestion()
  
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength: MAX_LENGHT,
    initialValue: "",
  })

  const { data: availableSubjects, isLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getAvailableSubjects,
  })
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    const data: CreateQuestionData = {
      subjectId: formData.get("subject") as string | null,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    }

    const promise = createQuestion(data);

    toast.promise(promise, {
      loading: "Publicando sua pergunta...",
      success: () => {
        // Você pode fechar o modal aqui se desejar
        return "Pergunta publicada com sucesso!";
      },
      error: (err) => `Erro: ${err.message}`,
    });
      
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isLoading} className="rounded-full h-12 px-8 cursor-pointer" >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <HelpCircleIcon className="mr-2 size-4" />
          )}
          Fazer uma pergunta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form id="create-question-form" onSubmit={handleSubmit} className="grid gap-4 py-4">
        <DialogHeader>
          <DialogTitle className="mb-1">Criar nova pergunta</DialogTitle>
          <DialogDescription>
            Detalhe sua dúvida para que a comunidade possa te ajudar. Quanto
            mais claro você for, melhores serão as respostas.
          </DialogDescription>
        </DialogHeader>
        
          <div className="">
            <Label htmlFor={`title`} className="text-right">
              Título
            </Label>

            <Input
              id={`title`}
              name="title"
              placeholder="Ex: Como implementar uma árvore binária em JavaScript?"
              className="h-12 px-4 mt-1"
              required
            />
          </div>

          <div className="">
            <Label htmlFor={`content`} className="pt-2 text-right flex items-center gap-2 justify-between">
              Conteúdo 
              <p
                id={`char-count`}
                className="text-muted-foreground text-right text-xs"
                role="status"
                aria-live="polite"
              >
                <span className="tabular-nums">{limit - characterCount}</span>{" "}
                caracteres restantes
              </p>
            </Label>
            {/* Campo para o conteúdo (content) da pergunta */}
            <div className="">
              <Textarea
                id={`content`}
                name="content"
                placeholder="Descreva seu problema em detalhes. Inclua o que você já tentou e onde está travado."
                maxLength={MAX_LENGHT}
                onChange={handleChange}
                value={value}
                className="min-h-[120px] p-4 mt-1"
                required
                aria-describedby={`char-count`}
              />
              
            </div>
          </div>

          { availableSubjects && availableSubjects.length > 0 ? (
            <div className="">
            <Label htmlFor="subject" className="text-right">
              Matéria
            </Label>
            <Select name="subject" required>
              <SelectTrigger id="subject" className="w-full" >
                <SelectValue placeholder="Selecione a matéria"  />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          ) : null }
          
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          {/* O botão de salvar agora submete o formulário */}
             <Button type="submit" form="create-question-form">
                Publicar pergunta
            </Button>
          
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}