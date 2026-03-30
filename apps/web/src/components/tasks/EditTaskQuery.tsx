import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "../../api/TaskAPI";
import EditTaskModal from "./EditTaskModal";

type EditTaskQueryProps = {
  projectId: string;
  taskId: string;
};

export default function EditTaskQuery({ projectId, taskId }: EditTaskQueryProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId,
    retry: false,
  });

  if (isLoading || isError || !data) return null;

  return <EditTaskModal task={data} projectId={projectId} />;
}
