import {
  CreateCategoryDTO,
  createCategorySchema,
} from "@/lib/validations/category"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as Icons from "lucide-react"
import { createCategory, updateCategory } from "@/lib/api/categories"

export const useCategory = ({
  mode,
  categoryId,
  onSuccess,

  category,
}: {
  mode: "create" | "edit"
  categoryId?: string
  onSuccess?: () => void
  category?: {
    id: string
    name: string
    icon: string
    color: string
  }
}) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isIconDialogOpen, setIsIconDialogOpen] = useState(false)
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CreateCategoryDTO>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      icon: "Folder",
      color: "#4F46E5",
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setIsLoading(true)

      let response

      if (mode === "create") {
        response = await createCategory({
          name: values.name,
          icon: values.icon,
          color: values.color,
        })

        if (response.error) {
          toast.error(response.error)
          return
        }

        toast.success("Categoria criada com sucesso!")
      } else {
        if (!categoryId) {
          toast.error("ID da categoria não encontrado")
          return
        }

        response = await updateCategory(categoryId, {
          name: values.name,
          icon: values.icon,
          color: values.color,
        })

        if (response.error) {
          toast.error(response.error)
          return
        }

        toast.success("Categoria atualizada com sucesso!")
      }

      form.reset()
      setOpen(false)
      router.refresh()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast.error(
        `Erro ao ${mode === "create" ? "criar" : "atualizar"} categoria`
      )
    } finally {
      setIsLoading(false)
    }
  })

  useEffect(() => {
    if (open && category) {
      form.reset({
        name: category.name,
        icon: category.icon,
        color: category.color,
      })
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        icon: "Folder",
        color: "#4F46E5",
      })
    }
  }, [open, category, form, mode])

  return {
    form,
    isLoading,
    handleSubmit,
    isIconDialogOpen,
    setIsIconDialogOpen,
    isColorDialogOpen,
    setIsColorDialogOpen,
    open,
    setOpen,
  }
}
