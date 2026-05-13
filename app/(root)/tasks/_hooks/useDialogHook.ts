import { useState } from "react"

const useDialogHook = () => {
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [openChecklistDialog, setOpenChecklistDialog] = useState(false)

  return {
    openCategoryDialog,
    setOpenCategoryDialog,
    openDatePicker,
    setOpenDatePicker,
    openChecklistDialog,
    setOpenChecklistDialog,
  }
}

export default useDialogHook
