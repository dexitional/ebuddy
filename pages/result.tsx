import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { fetchMonitor } from "../utils/apiClient";
import { useUserStore } from "../utils/store";
import { GiVote } from 'react-icons/gi'

const styles = {
  wrapper: `w-full p-2 bg-white rounded-lg border border-slate-100`,
  main: `w-full p-2 bg-white flex flex-col`,
  indicator: `w-full mx-auto p-2 flex flex-row flex-wrap items-center justify-center space-x-2`,
  stats: `mx-auto p-2 flex flex-row items-center justify-center space-x-2 border-2 border-dotted rounded-lg`,
  aside: ``,
};
const PaperResult = () => {
  const [electors, setElectors] = useState([]);
  const [evsdata, setEvsdata] = useState<any>({});
  const { user, eid, ename } = useUserStore((state) => state);
  const router = useRouter();
  const getPortfolio = (name: string) => {
    return (
      evsdata &&
      evsdata.candidates &&
      evsdata?.candidates.filter((r: any) => r.portfolio.name == name)
    );
  };

  const goBack = () => {
    router.back();
  };

  const syncData = async () => {
    const resp = await fetchMonitor(eid);
    if (resp.success) {
      resp.data.electors && setElectors(resp.data.electors);
    }
  };

  const voteNow = async () => {
    const resp = await fetchMonitor(eid);
    if (resp.success) {
      setEvsdata({ ...resp.data, id: eid });
    }
  };

  useEffect(() => {
    voteNow();
    syncData();
  }, []);

  if(!evsdata || (evsdata && evsdata?.election && evsdata.election[0].allow_result == 0)) router.back()
  
  return (
    <div className="w-full max-w-4xl mx-auto print:m-3">
      <div className="block my-2 print:hidden">
        <div className="w-full max-w-4xl mx-auto">
          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => window.print()}
              className="p-2 bg-red-900 ring ring-red-900 text-white border-2 border-white"
            >
              &nbsp;&nbsp;PRINT&nbsp;&nbsp; {evsdata && evsdata.ui_prim_color}
            </button>
            <button
              onClick={goBack}
              className="p-2 bg-blue-900 ring ring-blue-900 border-2 border-white text-white "
            >
              &nbsp;&nbsp;BACK&nbsp;&nbsp; {evsdata && evsdata.ui_prim_color}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="cover">
          <div>
            <section className="w-full max-w-4xl">
              <div className="my-6 rounded border-4 border-blue-900">
                <header className="m-4 flex justify-between">
                  <div className="">
                    <h2 className="p-1 px-3 bg-blue-900 text-white text-lg font-semibold">
                      {ename?.toUpperCase()}
                    </h2>
                    <h1 className="my-3 bg-red-800 text-white text-3xl font-semibold tracking-widest p-3 border-l-8 border-slate-300 rounded-r-lg">
                      FINAL ELECTION RESULTS
                    </h1>
                    <h2 className="p-1 px-2 no-space bg-blue-500/60 text-white text-lg font-bold ">
                      OFFICE OF THE ELECTORAL COMMISSIONER
                    </h2>
                  </div>
                  
                  <GiVote className="w-40 h-40 p-3 rounded-md border-t-8 text-blue-900 border-blue-300 shadow-lg fit-contain" />
                </header>
                <table className="w-full overflow-hidden">
                  {evsdata &&
                    evsdata.portfolios &&
                    evsdata.portfolios.map((row: any, i: React.Key) => (
                      <>
                        <tr>
                          <td className="h-4">&nbsp;</td>
                        </tr>
                        <tr className="bg-blue-900 ring-8 ring-blue-900 border-4 border-white mt-4">
                          <td className="p-3 text-white font-semibold text-center text-3xl tracking-widest">
                            <h3>{row.name}</h3>
                          </td>
                        </tr>
                        <tr className="body">
                          <td className="relative">
                           {getPortfolio(row.name) &&
                                getPortfolio(row.name)
                                  .sort((a: any, b: any) => b.votes - a.votes)
                                  .map((r: any, j: any) => 
                                    r.tag == 'skip' ?
                                (<div className="absolute -top-[3.5rem] left-2 my-3 flex flex-wrap items-center justify-center"><span className="pl-2 py-1 text-xs bg-slate-50/90 border rounded text-blue-900 font-bold italic">
                                  SKIPPED VOTES 
                                  <span className="mx-1 text-red-800">{r.votes || 0} - {" "} 
                                {(
                                  (parseInt(r.votes) /
                                        electors.length || 0) *
                                      100
                                    ).toFixed(1)}%
                                    </span></span></div>
                                  ):null 
                                )}
                            <div className="my-3 flex flex-wrap items-center justify-center space-x-3">
                              {getPortfolio(row.name) &&
                                getPortfolio(row.name)
                                  .sort((a: any, b: any) => b.votes - a.votes)
                                  .map((r: any, j: any) => 
                                    r.name.toLowerCase() != 'skip' ? 
                                    (j == 0 )  ? 
                                    (
                                    <div className="my-2 w-56 overflow-hidden rounded-md border-2 border-green-800">
                                      <img
                                        //src={`/api/photos/?tag=candid&eid=${r.id}`}
                                        src={`/upload/2022/${r.photo_id}.jpg`}
                                        className="w-full h-52 object-cover object-top"
                                      />
                                      <div className="p-2 bg-green-800 text-white text-center font-semibold">
                                        <h3 className="text-center print:truncate">
                                          {r.name}
                                        </h3>
                                        <h4 className="m-2 px-1 py-1.5 rounded-md bg-slate-200/90 text-green-900 text-lg text-bold flex flex-row items-center justify-center space-x-3">
                                          <b>{r.votes}</b>{" "}
                                          <em className="mx-2 px-2 p-0.5 bg-green-900 text-white text-bold text-sm rounded">
                                            {(
                                              (parseInt(r.votes) /
                                                electors.length || 0) *
                                              100
                                            ).toFixed(1)}
                                            %
                                          </em>
                                        </h4>
                                      </div>
                                    </div>
                                    ):
                                    (
                                      <div className="my-2 w-56 overflow-hidden rounded-md border-2 border-blue-900">
                                        <img
                                          //src={`/api/photos/?tag=candid&eid=${r.id}`}
                                          src={`/upload/2022/${r.photo_id}.jpg`}
                                          className="w-full h-52 object-cover object-top"
                                        />
                                        <div className="p-2 bg-blue-900 text-white text-center font-semibold">
                                          <h3 className="text-center print:truncate">
                                            {r.name}
                                          </h3>
                                          <h4 className="m-2 px-1 py-1.5 rounded-md bg-slate-200/90 text-blue-900 text-lg text-bold flex flex-row items-center justify-center space-x-3">
                                            <b>{r.votes}</b>{" "}
                                            <em className="mx-2 px-2 p-0.5 bg-blue-900 text-white text-bold text-sm rounded">
                                              {(
                                                (parseInt(r.votes) /
                                                  electors.length || 0) *
                                                100
                                              ).toFixed(1)}
                                              %
                                            </em>
                                          </h4>
                                        </div>
                                      </div>
                                      ): null
                                  )}
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}
                  <tr className="bg-red-900 ring-8 ring-red-900 border-4 border-white mt-4 break-before-page">
                    <td className="p-3 text-white font-semibold text-center text-3xl tracking-widest">
                      <h3>ELECTION STATISTICS</h3>
                    </td>
                  </tr>
                  <tr className="body">
                    <td>
                      <footer className="flex flex-col">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="p-4 m-4 flex flex-col items-center rounded bg-blue-900/20 text-blue-900/90 font-bold text-xl">
                            <h3 className="text-2xl text-red-900">
                              {(evsdata && evsdata.voters_count) || 0}
                            </h3>
                            <p>REGISTERED</p>
                          </div>
                          <div className="p-4 m-4 flex flex-col items-center rounded bg-blue-900/20 text-blue-900/90 font-bold text-xl">
                            <h3 className="text-2xl text-red-900">
                              {electors
                                ? electors.length
                                : evsdata && evsdata.electors
                                ? evsdata.electors.length
                                : 0}
                            </h3>
                            <p>TURNOUT</p>
                          </div>
                          <div className="p-4 m-4 flex flex-col items-center rounded bg-blue-900/20 text-blue-900/90 font-bold text-xl">
                            <h3 className="text-2xl text-red-900">
                              {Math.max(
                                0,
                                ((evsdata && evsdata.voters_count) || 0) -
                                  (electors
                                    ? electors.length
                                    : evsdata && evsdata.electors
                                    ? evsdata.electors.length
                                    : 0)
                              )}
                            </h3>
                            <p>ABSENT</p>
                          </div>
                        </div>
                      </footer>
                    </td>
                  </tr>
                </table>
              </div>
            </section>

            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperResult;
