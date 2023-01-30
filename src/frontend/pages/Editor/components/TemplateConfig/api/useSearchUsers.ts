import { useCallback, useState } from 'react';
import { request } from '@/frontend/utils';
import { UserResponseDTO } from '@/backend/service/userService/types';

export const useSearchUsers = () => {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [usersMap, setUsersMap] = useState<Map<number, UserResponseDTO>>(
    new Map(),
  );

  const searchUsers = useCallback(async (name: string) => {
    const response = await request(`/api/search/users/?name=${name}`);
    if (response && response.data && response.data.list) {
      setUsers(response.data.list);
      setUsersMap(
        response.data.list.reduce(
          (map: Map<number, UserResponseDTO>, user: UserResponseDTO) => {
            map.set(user.id, user);
            return map;
          },
          new Map(),
        ),
      );
    }
  }, []);

  return {
    users,
    usersMap,
    searchUsers,
  };
};
