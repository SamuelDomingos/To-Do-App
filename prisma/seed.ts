import prisma from "@/lib/prisma"

const DEFAULT_CATEGORIES = [
  {
    name: "Trabalho",
    color: "#4F46E5",
    icon: "Briefcase",
    isGlobal: true,
  },
  {
    name: "Estudos",
    color: "#14B8A6",
    icon: "GraduationCap",
    isGlobal: true,
  },
  {
    name: "Saúde",
    color: "#22C55E",
    icon: "Heart",
    isGlobal: true,
  },
  {
    name: "Esportes",
    color: "#3B82F6",
    icon: "Activity",
    isGlobal: true,
  },
  {
    name: "Meditação",
    color: "#A855F7",
    icon: "Brain",
    isGlobal: true,
  },
  {
    name: "Finanças",
    color: "#F59E0B",
    icon: "DollarSign",
    isGlobal: true,
  },
  {
    name: "Casa",
    color: "#8B5CF6",
    icon: "Home",
    isGlobal: true,
  },
  {
    name: "Nutrição",
    color: "#10B981",
    icon: "Apple",
    isGlobal: true,
  },
  {
    name: "Social",
    color: "#EC4899",
    icon: "Users",
    isGlobal: true,
  },
  {
    name: "Entretenimento",
    color: "#F43F5E",
    icon: "Clapperboard",
    isGlobal: true,
  },
  {
    name: "Arte",
    color: "#D946EF",
    icon: "Palette",
    isGlobal: true,
  },
  {
    name: "Ar Livre",
    color: "#06B6D4",
    icon: "Trees",
    isGlobal: true,
  },
  {
    name: "Leitura",
    color: "#6366F1",
    icon: "BookOpen",
    isGlobal: true,
  },
  {
    name: "Família",
    color: "#F97316",
    icon: "Users",
    isGlobal: true,
  },
  {
    name: "Viagem",
    color: "#0EA5E9",
    icon: "Plane",
    isGlobal: true,
  },
  {
    name: "Outros",
    color: "#6B7280",
    icon: "MoreHorizontal",
    isGlobal: true,
  },
]

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  const existingGlobalCategories = await prisma.category.findMany({
    where: { isGlobal: true },
  })

  if (existingGlobalCategories.length === 0) {
    console.log("📦 Criando categorias padrão globais...")

    for (const category of DEFAULT_CATEGORIES) {
      await prisma.category.upsert({
        where: {
          id: category.name,
        },
        update: {},
        create: category,
      })
    }

    console.log(`✅ Criadas ${DEFAULT_CATEGORIES.length} categorias globais`)
  } else {
    console.log(
      `ℹ️ Já existem ${existingGlobalCategories.length} categorias globais. Nenhuma nova categoria foi criada.`
    )
  }

  console.log("🎉 Seed concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
