import { Category } from "@/generated/prisma/client"
import { getCategories } from "@/lib/api/categories"
import { useEffect, useState } from "react"

const useGetCategory = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)

        const response = await getCategories()

        if (!response.data) {
          throw new Error(response.error || "Erro ao buscar categorias")
        }

        setCategories(response.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
  }
}

export default useGetCategory
