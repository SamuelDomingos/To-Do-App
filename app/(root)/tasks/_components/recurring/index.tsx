import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import ItemDrawer from "./itemDrawer"

import * as Icons from "lucide-react"
import { LucideIcon } from "lucide-react"

import { RecurringTask } from "@/lib/api/types/tasks.types"

const RecurringTasks = ({
  recurringTasks,
}: {
  recurringTasks: RecurringTask[]
}) => {
  return (
    <div className="mt-8 space-y-3 px-4">
      {recurringTasks.map((task) => {
        const Icon = Icons[
          task.category.icon as keyof typeof Icons
        ] as LucideIcon

        return (
          <ItemDrawer
            key={task.id}
            task={task}
            trigger={
              <Item variant="outline" className="cursor-pointer">
                <ItemMedia
                  variant="icon"
                  className="rounded-lg p-2"
                  style={{
                    backgroundColor: task.category.color,
                  }}
                >
                  <Icon className="h-6! w-6!" />
                </ItemMedia>

                <ItemContent>
                  <ItemTitle>{task.title}</ItemTitle>

                  <ItemDescription>{task.note}</ItemDescription>
                </ItemContent>
              </Item>
            }
          />
        )
      })}
    </div>
  )
}

export default RecurringTasks
