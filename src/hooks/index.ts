import { useUserStore } from "../stores";

function useGetAccountId() {
  const { user } = useUserStore();
  return user?.id;
}

export { useGetAccountId };
