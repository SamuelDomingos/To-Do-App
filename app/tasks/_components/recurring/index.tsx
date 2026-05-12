import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import ItemDrawer from "./itemDrawer"

const RecurringTasks = ({ recurringTasks }) => {
  return (
    <div className="mt-8 px-4 space-y-3">
      {recurringTasks.map((task) => (
        <ItemDrawer
          key={task.id}
          task={task}
          trigger={
            <Item variant="outline" className="cursor-pointer">
              <ItemMedia
                variant="icon"
                className="rounded-lg p-2"
                style={{
                  backgroundColor: task.color,
                }}
              >
                <task.icon className="h-5 w-5 text-black" strokeWidth={2.5} />
              </ItemMedia>

              <ItemContent>
                <ItemTitle>{task.title}</ItemTitle>

                <ItemDescription>{task.type}</ItemDescription>
              </ItemContent>
            </Item>
          }
        />
      ))}
    </div>
  )
}

export default RecurringTasks
