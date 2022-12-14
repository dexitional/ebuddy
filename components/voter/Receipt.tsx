import moment from "moment";
import React, { useEffect, useState } from "react";
import { fetchReceipt } from "../../utils/apiClient";
import { useUserStore } from "../../utils/store";
import Thumb from '../../public/thumb.png'

const styles = {
  wrapper: `w-full p-2 bg-white rounded-lg border border-slate-100`,
  main: `w-full p-2 bg-white flex flex-col`,
  main2: `w-full p-2 bg-white flex justify-between`,
  indicator: `w-96 mx-auto p-2 flex flex-row items-center justify-center space-x-2`,
  aside: ``,
};

export default function Receipt({setPage}:any) {
  const [evsdata, setEvsdata] = useState<any>({});
  const { user, eid, ename } = useUserStore((state) => state);
    
  const viewReceipt = async () => {
    //const { eid, tag, ename } = useUserStore.getState();
    const resp = await fetchReceipt(eid, user?.tag);
    console.log(resp)
    if (resp.success) {
      setEvsdata({
        data: { ...resp.data },
        id: eid,
        name: ename,
      });
    }
  };

  useEffect(() => {
    viewReceipt();
  }, []);

  useEffect(() => {
    console.log(evsdata);
  }, [evsdata]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.main2}>
          <h3 className="text-lg font-bold text-slate-500 text-center">
            <span>{evsdata?.name}</span>
          </h3>
          <button onClick={()=> setPage('list')} className="px-3 rounded-md border border-blue-900 font-semibold text-blue-900 text-[11px]">BACK</button>
        </div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.main}>
          <h2 className="w-auto my-4 py-1 px-8 font-semibold bg-slate-100 text-slate-500 rounded-full">
            VOTE TIME:{" "}
            {moment(evsdata.data?.electors[0]?.vote_time).format("LLL").toUpperCase() }
          </h2>
          <div className="flex flex-col ">
            {evsdata.data?.selections?.map((r: any, i: React.Key) => (
              <div
                key={r.id}
                className="my-1 pb-2 flex flex-row items-start justify-between border-dotted border-b-2 border-slate-100"
              >
                <div className="my-2 pb-4 flex flex-row items-start space-x-6 ">
                  <img
                    src={`/api/photos/?tag=candid&eid=${r.id}`}
                    alt="Candidate"
                    loading="lazy"
                    className="h-24 w-22 object-contain p-2 border border-1 border-slate-200 rounded-md"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold">{r.name}</h3>
                    <p className="text-sm text-slate-500/80 font-semibold">
                      {r.portfolio}
                    </p>
                    <button className="w-20 my-1 py-0.5 px-2 text-xs text-center text-green-800 font-semibold border border-solid border-green-700 rounded-full">
                      CHOSEN
                    </button>
                  </div>
                </div>
                {/*
            <button className="w-24 my-1 py-1 px-4 self-center text-sm text-center text-green-800 font-semibold border-2 border-solid border-green-700 rounded-full">
              CHOSEN
            </button>
            */}
              <img src={Thumb.src} className="mr-4 h-20 w-auto self-center" /> 
                      
              </div>
            ))}
            {/*
          <div className="w-auto my-4 py-2 px-8 font-bold tracking-widest bg-slate-100 text-slate-500 rounded-full">
            <button className="w-full m-1 p-2 rounded-xl bg-slate-700 text-white/90">
              VOTE TIME: AUG 18, 2020 11:30 AM
            </button>
          </div>
          */}
          </div>
        </div>
        {/* <div className={styles.aside}></div> */}
      </div>
    </>
  );
}
