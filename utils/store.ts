import axios from "axios";
import create from "zustand";
import { persist } from "zustand/middleware";

interface Props {
  user: any;
  admin: any;
  eid: any;
  ename: any;
  evsdata: any;
  receipt: any;
  centre_id: any;
  showSidebar: any;
  fetchHelpers: any;
}

export const useUserStore = create(
  persist<Props>(
    (set) => ({
      user: null,
      admin: null,
      eid: null,
      ename: null,
      evsdata: null,
      centre_id: null,
      receipt: null,
      showSidebar: false,
      fetchHelpers: async () => {
        const res = await axios.get('/api/helpers');
        if(res.data.success){
          set({ receipt: res.data.data })
        }
      },
    }),
    {
      name: "electoStore", // name of item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
    }
  )
);
