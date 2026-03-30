import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "../../api/TaskAPI";
import ViewTaskModal from "./ViewTaskModal";

type ViewTaskQueryProps = {
  projectId: string;
  taskId: string;
};

export default function ViewTaskQuery({ projectId, taskId }: ViewTaskQueryProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId,
    retry: false,
  });

  if (isLoading || isError || !data) return null;

  return <ViewTaskModal task={data} projectId={projectId} />;
}
