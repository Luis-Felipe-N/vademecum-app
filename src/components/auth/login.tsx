"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlusIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useFileUpload } from "@/hooks/use-file-upload"
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
import { Textarea } from "@/components/ui/textarea"
import z4 from "zod/v4"
import { useCharacterLimit } from '@/hooks/use-character-limit'
import { tr } from 'zod/v4/locales'
import { Checkbox } from 'radix-ui'
import { signIn } from 'next-auth/react'
import Logo from '../navbar-components/logo'

const MAXLENGTH = 180

const loginFormSchema = z4.object({
  email: z4.string().min(1, "Informe o nome de usuário"),
  password: z4
    .string()
    .nonempty('Este campo é obrigatório')
    .min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
})

type LoginFormData = z4.infer<typeof loginFormSchema>

export default function Login() {
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength: MAXLENGTH,
    initialValue:
      "Insira uma breve descrição sobre você. Este campo é opcional.",
  })

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  })

  async function handleLogin(data: LoginFormData) {
    try {
      const resposeData = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      console.log('Login response:', resposeData)
      if (!resposeData) return

      if (resposeData.error == 'CredentialsSignin') {
        throw new Error('Usuário ou senha inválidos')
      } else if (resposeData.error) {
        throw new Error(resposeData.error)
      } else {
        toast.success("Login realizado com sucesso", {
          description: "Você vai ser redirecionado para a página inicial.",
          action: {
            label: "Fechar",
            onClick: () => console.log("Fechar"),
          },
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error("Erro ao fazer login", {
          description: "Erro: " + (error instanceof Error ? error.message : String(error)),
          action: {
            label: "Fechar",
            onClick: () => console.log("Fechar"),
          },
        })
    }
  }


  return (
     <Dialog>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            <Logo />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Bem vindo</DialogTitle>
            <DialogDescription className="sm:text-center">
              Informe seus dados para acessar sua conta.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={`email`}>Email</Label>
              <Input
                {...register('email', { required: true })}
                placeholder="oi@gmail.com"
                type="email"
                required
              />
            </div>
            <div className="*:not-first:mt-2">
              <Label htmlFor={`password`}>Senha</Label>
              <Input
                {...register('password', { required: true })}
                placeholder='******'
                type="password"
                required
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <a className="text-sm underline hover:no-underline" href="#">
              Esqueceu sua senha?
            </a>
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        {/* <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-muted-foreground text-xs">Or</span>
        </div>

        <Button variant="outline">Login with Google</Button> */}
      </DialogContent>
    </Dialog>
  )
}

function ProfileBg() {


  const currentImage = 'https://docs.uft.edu.br/share/proxy/alfresco-noauth/api/internal/shared/node/KyDCAa_pTxq58EXmS9TX1Q/content/Bandeira.jpg'

  return (
    <div className="h-32">
      <div className="bg-muted relative flex size-full items-center justify-center overflow-hidden">
        {currentImage && (
          <img
            className="size-full object-cover"
            src={currentImage}
            alt="Logo da UFT"
            width={512}
            height={96}
          />
        )}
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
  )
}


function Avatar() {
  const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
  })

  const currentImage = files[0]?.preview || null

  return (
    <div className="-mt-10 px-6">
      <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
        {currentImage && (
          <img
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
  )
}
