import { UserResponseDTO } from '@/backend/service/userService/types';

export interface UserStore {
  user: UserResponseDTO | null;
  setUser: (user: UserResponseDTO | null) => void;
}

const createUserStore: (
  set: (
    nextStateOrUpdater: object | ((state: any) => void),
    shouldReplace?: boolean | undefined,
  ) => void,
) => UserStore = (set) => ({
  user: null,
  setUser(user: UserResponseDTO | null) {
    set((store) => {
      if (!user) {
        store.user.user = null;
      }
      store.user.user = user;
    });
  },
});

export default createUserStore;
