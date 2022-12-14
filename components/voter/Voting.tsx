import React, { useState, useEffect } from "react";
import { useUserStore } from "../../utils/store";
import { fetchElectionDataById, fetchMonitor, postData } from "../../utils/apiClient";
import Thumb from '../../public/thumb.png'
import Image from "next/image";
import Notiflix from "notiflix";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const styles = {
  wrapper: `w-full p-2 bg-white rounded-lg border border-slate-100`,
  main: `w-full p-2 bg-white flex flex-col`,
  indicator: `w-full mx-auto p-2 flex flex-row flex-wrap items-center justify-center space-x-2`,
  aside: ``,
};

export default function Voting({ setPage }: any) {
  const [voter, setVoter] = useState<any>({});
  const [pageview, setPageview] = useState<number>(0);
  const [evsdata, setEvsdata] = useState<any>({});
  const { user, eid,ename } = useUserStore((state) => state);

  const getPortfolio = (name: string) => {
    return (
      evsdata &&
      evsdata.candidates &&
      evsdata?.candidates.filter((r: any) => r.portfolio == name)
    );
  };

  const choose = (e: any, pid: number, cid: number) => {
    e.preventDefault();
    setVoter({ ...voter, [pid]: cid });
    changeView("next")
    //setTimeout(() => changeView("next"), 500);
  };

  const chosenIcon = (pid: string, cid: string) => {
    return voter[pid] == cid;
  };

  const changeView = (action: string) => {
    if (action == "prev") setPageview(Math.max(0, pageview - 1));
    if (action == "next")
      setPageview(
        Math.min(
          evsdata ? parseInt(evsdata.portfolios.length) - 1 : 0,
          pageview + 1
        )
      );
  };

  const pageComplete = (key: React.Key) => {
    return voter[key];
  };

  const allowNext = () => {
    const portfolio =
      evsdata &&
      evsdata.portfolios &&
      evsdata.portfolios?.find((r: any, i: React.Key) => i == pageview);
    if (portfolio) return voter[portfolio?.id];
    return false;
  };

  const allowSubmit = () => {
    const count = evsdata?.portfolios?.length;
    const vcount = Object.values(voter).length;
    return count == vcount;
  };

  const submitVote = async (e: any, id: any) => {
    e.preventDefault();
    const data = {
      id,
      tag: user?.tag,
      name: user?.name,
      votes: voter,
    };
    const ok = window.confirm(`SUBMIT VOTE FOR CHOSEN CANDIDATES ?`);
    if (ok) {
      if (allowSubmit()) {
        const resp = await postData(data);
        if (resp.success) {
          //alert(`VOTE HAS SUBMITTED SUCCESSFULLY!`);
          Notiflix.Notify.success('VOTED SUCCESSFULLY!');
          useUserStore.setState({ user: { ...user, vote_status: 1 } });
          setPage("receipt");
        } else {
          //alert(resp.msg.toUpperCase());
          Notiflix.Notify.failure(resp.msg.toUpperCase());
          if (resp.code == 1004) setTimeout(() => setPage("list"), 2000);
        }
      } else {
       // alert(`PLEASE FINALIZE CANDIDATE SELECTIONS`);
        Notiflix.Notify.info('PLEASE FINALIZE CANDIDATE SELECTIONS');
          
      }
    } else {
      //
    }
  };

  const initialize = async () => {
    const resp = await fetchElectionDataById(eid, user?.tag);
    console.log(eid,user?.tag,resp);
    if (resp.success) {
      setEvsdata({ ...resp.data, id: eid });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <h3 className="text-lg font-bold text-slate-400 text-center">
            <span className="px-4 py-2 bg-slate-100/80 rounded-md">
              {ename}
            </span>
          </h3>
        </div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.indicator}>
          <button
            className={`cursor-pointer rounded px-2 py-0.5 font-semibold text-sm text-slate-500 bg-slate-200 prev`} disabled={
              pageview == 0}
            onClick={() => changeView("prev")}
          >
            PREV
          </button>
          {evsdata.portfolios?.map((row: any, i: React.Key) => (
            <span
              className={`w-5 h-5 my-1 rounded-full shadow-xs border-2 ${
                pageview == i && !pageComplete(row.id)
                  ? "bg-slate-200 border-slate-300"
                  : pageview == i && pageComplete(row.id)
                  ? "bg-slate-100 border-green-500"
                  : pageview != i &&
                    pageComplete(row.id) &&
                    "bg-green-500 border-green-500"
              }`}
              key={i}
            >
              &nbsp;
            </span>
          ))}
          <button
            className={`cursor-pointer rounded px-2 py-0.5 font-semibold text-sm text-slate-500 bg-slate-200 next`} disabled={
              (!allowNext() ||
                pageview == parseInt(evsdata.portfolios.length) - 1) 
            }
            onClick={() => changeView("next")}
          >
            NEXT
          </button>
        </div>

        {(evsdata &&
          evsdata.portfolios &&
          evsdata.portfolios.map((row: any, i: React.Key) =>
            pageview == i ? (
              <div className={styles.main}>
                <h2 className="w-auto my-4 py-1 px-8 font-bold tracking-widest bg-slate-100 text-slate-500 rounded-full">
                  {row.name}
                </h2>
                <div className="flex flex-col ">
                  {getPortfolio(row.name) &&
                    getPortfolio(row.name).map((r: any, j: React.Key) => (
                      <div
                        key={r.id}
                        className="my-1 pb-2 flex flex-row items-start justify-between border-dotted border-b-2 border-slate-100"
                      >
                        <div className="my-2 pb-4 flex flex-row items-start space-x-6 ">
                          <div className="h-24 w-24 overflow-hidden border border-1 border-slate-200 rounded-md">
                          <img
                            src={`/api/photos/?tag=candid&eid=${r.id}`}
                            alt={r.name}
                            loading="lazy"
                            className="object-contain"
                          />
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-base font-semibold">
                              {r.name}
                            </h3>
                            <p className="text-sm text-slate-500/80">
                              {r.teaser}
                            </p>
                            {chosenIcon(row.id, r.id) && (
                              <span className="w-16 my-1 py-0.3 px-1 text-[0.7em] text-center text-green-800 font-semibold border-2 border-solid border-green-700 rounded-full">
                                CHOSEN
                              </span>
                            )}
                          </div>
                        </div>
                        {!chosenIcon(row.id, r.id) &&
                        <button
                          onClick={(e) => choose(e, row.id, r.id)}
                          className="w-24 my-1 py-1 px-4 self-center text-sm text-center text-slate-500 font-semibold border-2 border-solid border-slate-500 rounded-full"
                        >
                          CHOOSE
                        </button>
                        }
                        {chosenIcon(row.id, r.id) &&<img src={Thumb.src} className="mr-4 h-20 w-auto self-center" /> }
                      </div>
                    ))}

                  {allowSubmit() && (
                    <div className="w-auto my-4 py-2 px-8 font-bold tracking-widest bg-slate-100 text-blue-100 border rounded-full">
                      <button
                        onClick={(e) => submitVote(e, evsdata && eid)}
                        className="w-full m-1 p-2 rounded-xl bg-blue-900 text-white/90"
                      >
                        SUBMIT VOTE
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : null
          )) || <div className="h-screen w-full flex items-center justify-center"><span className="text-sm font-serif font-semibold">LOADING ...</span></div>}

        {/* <div className={styles.aside}></div> */}
      </div>
    </>
  );
}
