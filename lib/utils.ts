import { clsx, type ClassValue } from "clsx"

import { format } from "date-fns"

import { ptBR } from "date-fns/locale"

import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formattedDate(dateString: string) {
  const date = new Date(dateString + 'T12:00:00')
  
  return format(date, "EEEE, d 'de' MMMM", {
    locale: ptBR,
  })
}

export const parseLocalDate = (dateString: string) => {
  const normalized = dateString.split("T")[0]

  const [year, month, day] = normalized
    .split("-")
    .map(Number)

  return new Date(year, month - 1, day)
}