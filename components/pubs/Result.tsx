import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { fetchMonitor } from "../../utils/apiClient";
import { useUserStore } from "../../utils/store";
import Winner from "../../public/winner.png";

const styles = {
  wrapper: `w-full p-2 bg-white rounded-lg border border-slate-100`,
  main: `w-full p-2 bg-white flex flex-col`,
  main2: `w-full p-2 bg-white flex justify-between`,
  indicator: `w-full mx-auto p-2 flex flex-row flex-wrap items-center justify-center space-x-2`,
  stats: `mx-auto p-2 flex flex-row items-center justify-center space-x-2 border-2 border-dotted rounded-lg`,
  aside: ``,
};

export default function Result({setPage}: any) {
  const [voter, setVoter] = useState<any>({});
  const [pageview, setPageview] = useState<number>(0);
  const [electors, setElectors] = useState([]);
  const [evsdata, setEvsdata] = useState<any>({});
  const { user, eid, ename } = useUserStore((state) => state);
  const router = useRouter();
  const getPortfolio = (name: string) => {
    return (
      evsdata &&
      evsdata.candidates &&
      evsdata?.candidates.filter((r: any) => r.portfolio == name)
    );
  };

  /*
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

  */

  /*
  const changeView = () => {
    setTimeout(() => {
      const index = (pageview + 1) % evsdata.portfolios?.length;
      setPageview(index);
    }, 5000);
  };

  const changeViews = () => {
    setTimeout(() => {
      const index =
        (pageview + 1) %
        (evsdata && evsdata.portfolios && evsdata.portfolios.length);
      setPageview(index);
    }, 5000);
  };

  */

  const printResult = () => {
    router.push("/result");
  };

  const printContract = () => {
    router.push("/contract");
  };

  const changeView = (action: any) => {
    if (action == "prev") setPageview(Math.max(0, pageview - 1));
    if (action == "next")
      setPageview(
        Math.min(
          evsdata
            ? parseInt(evsdata.portfolios && evsdata.portfolios.length) - 1
            : 0,
          pageview + 1
        )
      );
  };
  const changeViews = () => {
    setTimeout(() => {
      const index =
        (pageview + 1) %
        (evsdata && evsdata.portfolios && evsdata.portfolios.length);
      setPageview(index);
    }, 5000);
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

  const syncData = async () => {
    const resp = await fetchMonitor(eid);
    console.log(resp);
    if (resp.success) {
      resp.data.electors && setElectors(resp.data.electors);
    }
  };

  const voteNow = async () => {
    const resp = await fetchMonitor(eid);
    if (resp.success) {
       setEvsdata({ ...resp.data, name: ename, id: eid });
    }
  };

  useEffect(() => {
    voteNow();
    syncData();
  }, []);

  useEffect(() => {
    //changeView();
  }, [pageview]);

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
        <div className={styles.stats}>
         
        <span className="px-4 py-1 font-semibold bg-slate-50 rounded-full shadow-xs border-2 border-slate-300">
          Registered: {evsdata && evsdata.election && evsdata.election[0].voters_count}
        </span>
       
        <span className=" px-4 py-1 font-semibold bg-slate-50 rounded-full shadow-xs border-2 border-slate-300">
          Turnout: {(electors?.length || 0) }
        </span>
        
        <span className="px-4 py-1 font-semibold bg-slate-50 rounded-full shadow-xs border-2 border-slate-300">
          Absent: {(evsdata && evsdata.election && evsdata?.election[0]?.voters_count || 0) - (electors?.length || 0)}
        </span>
          {/**/}
        </div>

        <div className={styles.indicator}>
          <span
            className={`cursor-pointer mx-2 border-2 border-slate-400 px-2 p-1 rounded-md text-sm font-bold text-slate-400 ${
              pageview == 0 && "visible"
            }`}
            onClick={() => changeView("prev")}
          >
            PREV
          </span>
          <div className="flex-1 flex flex-wrap items-center justify-center space-x-2">
            {evsdata.portfolios?.map((row: any, i: React.Key) => (
              <span
                className={`w-5 h-5 rounded-full shadow-xs border-2 ${
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
          </div>
          <span
            className={`cursor-pointer ml-3 border-2 border-slate-400 px-2 p-1 rounded-md text-sm font-bold text-slate-400 ${
              (!allowNext() ||
                pageview == parseInt(evsdata.portfolios.length) - 1) &&
              "visible"
            }`}
            onClick={() => changeView("next")}
          >
            NEXT
          </span>
        </div>

        {evsdata &&
          evsdata.portfolios &&
          evsdata.portfolios.map(
            (row: any, i: React.Key) =>
              pageview == i && (
                <div className={styles.main}>
                  <h2 className="w-auto my-4 py-1 px-8 font-bold tracking-widest bg-slate-100 text-slate-500 rounded-full">
                    {row.name}
                  </h2>
                  <div className="flex flex-col ">
                    {getPortfolio(row.name) &&
                      getPortfolio(row.name)
                        .sort((a: any, b: any) => b.votes - a.votes)
                        .map((r: any, j: React.Key) => (
                          <div className="my-1 pb-2 flex flex-row items-start justify-between border-dotted border-b-2 border-slate-100">
                            <div className="my-2 pb-4 flex flex-row items-start space-x-6 ">
                              <img
                                src={`/api/photos/?tag=candid&eid=${r.id}`}
                                alt={r.name}
                                loading="lazy"
                                className="h-24 w-22 p-2 border border-1 border-slate-200 rounded-md"
                              />

                              {/*
                              <Image
                                src={`${API_URL}/photos/evs/?tag=${r.id}&eid=${r.id}`}
                                //layout="fill"
                                objectFit="contain"
                                height={200}
                                width={200}
                              />
                        */}
                              <div className="flex flex-col">
                                <h3 className="text-base font-semibold">
                                  {r.name}
                                </h3>
                                <p className="text-sm text-slate-500/80">
                                  {r.teaser}
                                </p>
                                <div className="flex space-x-2">
                                  <span className="w-24 my-1 py-0.3 px-2 text-[0.9em] text-center text-green-800 font-semibold border-2 border-solid border-slate-700 rounded-full">
                                    {r.votes}
                                  </span>
                                  <span className="w-24 my-1 py-0.3 px-2 text-[0.9em] text-center text-slate-800 font-semibold border-2 border-solid border-slate-700 rounded-full">
                                    { electors.length <= 0 ? (
                                      (parseInt(r.votes) / electors.length) *
                                      100
                                    ).toFixed(1) : 0 }
                                    %
                                  </span>
                                  {(j == 0 ||
                              (j == 1 &&
                                getPortfolio(row.name) &&
                                getPortfolio(row.name).sort(
                                  (a: any, b: any) => b.votes - a.votes
                                )[0]["votes"] == r.votes)) && (
                               <span className="font-bold text-green-700 mt-6 self-center">ELECTED</span>
                              )}
                                </div>
                              </div>
                            </div>
                            {(j == 0 ||
                              (j == 1 &&
                                getPortfolio(row.name) &&
                                getPortfolio(row.name).sort(
                                  (a: any, b: any) => b.votes - a.votes
                                )[0]["votes"] == r.votes)) && (
                              <img
                                className="w-20 my-1 mr-5 py-1 px-4 self-center"
                                src={Winner.src}
                              />
                            )}
                          </div>
                        ))}

                    <div className="w-auto my-4 py-2 px-8 border flex items-center justify-center space-x-3 font-bold tracking-widest bg-slate-100 text-slate-500 rounded-full">
                      <button
                        onClick={printResult}
                        className="w-full m-1 p-2 rounded-xl bg-blue-900 text-white/90"
                      >
                        PRINT RESULTS
                      </button>
                      <button
                        onClick={printContract}
                        className="w-full m-1 p-2 rounded-xl bg-blue-900 text-white/90"
                      >
                        PRINT AGREEMENT
                      </button>
                    </div>
                  </div>
                </div>
              )
          )}
      </div>
    </>
  );
}
