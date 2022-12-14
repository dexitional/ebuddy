import React, { useState, useEffect } from "react";
import { useUserStore } from "../../utils/store";
import { fetchElectionDataById, fetchElectionDataByVoter, fetchMonitor, finalizeVote, postData } from "../../utils/apiClient";
import Thumb from '../../public/thumb.png'
import Notiflix from "notiflix";
import Router from "next/router";

const styles = {
  wrapper: `w-full p-1 bg-white rounded-t rounded-b  border border-slate-100`,
  main: `w-full p-0 bg-white flex flex-col`,
  indicator: `w-full mx-auto p-1 flex flex-row flex-wrap items-center justify-center space-x-2`,
  aside: ``,
};

export default function OmegaVoting({ setPage }: any) {
  const [voter, setVoter] = useState<any>({});
  const [pageview, setPageview] = useState<number>(0);
  const [evsdata, setEvsdata] = useState<any>({});
  const [elections, setElections] = useState<any>([]);
  const [electionIndex, setElectionIndex] = useState<number>(0);
  const { user, eid } = useUserStore((state) => state);

  const getPortfolio = (name: string) => {
    return (
      evsdata?.candidates?.filter((r: any) => r.portfolio == name)
    );
  };

  const choose = (e: any, pid: number, cid: number) => {
    e.preventDefault();
    const cm = window.confirm("SUBMIT VOTE ?")
    if(cm){
      setVoter({ ...voter, [pid]: cid });
    }
  };

  const chosenIcon = (pid: string, cid: string) => {
    return voter[pid] == cid;
  };

  const changeView = async (action: string) => {
    if (action == "prev") setPageview(Math.max(0, pageview - 1));
    if (action == "next" && pageview < evsdata?.portfolios?.length-1)
      setPageview(
        Math.min(
          evsdata ? evsdata?.portfolios?.length - 1 : 0,
          pageview + 1
        )
      );
    if (action == "next" && pageview == evsdata?.portfolios?.length-1){
      submitVote(evsdata?.election[0]?.id)
    }
  };

  const pageComplete = (key: React.Key) => {
    return voter[key];
  };

  const allowNext = () => {
    const portfolio =
    evsdata?.portfolios?.find((r: any, i: React.Key) => i == pageview);
    if (portfolio) return voter[portfolio?.id];
    return false;
  };

  const allowSubmit = () => {
    const count = evsdata?.portfolios?.length;
    const vcount = Object.values(voter).length;
    return count == vcount;
  };

  const submitVote = async (id: any) => {
    const data = {
      id,
      tag: user?.tag,
      name: user?.name,
      votes: voter,
    };
    //const ok = window.confirm(`SUBMIT VOTE FOR CHOSEN CANDIDATES ?`);
    //if (ok) {
      if (allowSubmit()) {
        const resp = await postData(data);
        if (resp.success) {
          if(electionIndex == elections.length-1) {
            //Update Voter Status && Verification Status
            const ac = await finalizeVote(user?.centre_id,user?.tag);
            if(ac.success){
              Notiflix.Notify.success('VOTED SUCCESSFULLY!');
              Router.push('/voterlogin')
              useUserStore.setState({ user:null})
            }
          }else{
            
              //setPageview(-1)
              //setVoter({})
              //initiate()
             
              const index = Math.min(electionIndex+1,elections.length-1);
              setPageview(-1) // Fix for Quick Transition Setting to -1
              setVoter({}) // Automatically causes transition
              setElectionIndex(index)
              setEvsdata(elections[index].data)
          }
        } else {
          Notiflix.Notify.failure(resp.msg.toUpperCase());
        }
      } else {
        Notiflix.Notify.info('PLEASE FINALIZE CANDIDATE SELECTIONS');
      }
   // }
  };


  const initiate = async () => {
    const resp = await fetchElectionDataByVoter(user?.tag);
    if (resp.success) {
      const elecs = resp.data.filter( (r:any) => r.status == 0)
      console.log(elecs)
    
      if(elecs.length > 0){
         //setVoter({})
         setElections([...elecs])
         setElectionIndex(0);
         setEvsdata({...elecs[0].data})
      }
    }
  };

  
  useEffect(() => {
    var ignore = false;
    if(!ignore){
       changeView("next")
    }
    return () => {
      ignore = true;
    }
  }, [voter]);
  /**/

  useEffect(() => {
   console.log(pageview)
  }, [pageview]);

  /*
  useEffect(() => {
    setPageview(0)
    setVoter({})
  }, [evsdata]);
  */

   /*
  useEffect(() => {
    var ignore = false;
    if(!ignore){
      setVoter({})
      setPageview(0)
    }
    return () => {
      ignore = true;
    }
  },[electionIndex]);
 */

  useEffect(() => {
    user && initiate();
    console.log(evsdata)
    console.log(evsdata)
  }, [user]);

  useEffect(() => {
    console.log(evsdata)
  }, [evsdata]);
  
    
  
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <h3 className="text-lg font-bold text-gray-500 text-center">
            <span className="px-4 py-2 bg-slate-100/80 ">
              {evsdata && evsdata.election && evsdata.election[0]?.name}
            </span>
          </h3>
        </div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.indicator}>
          <button
            className={`hidden cursor-pointer rounded px-2 py-0.5 font-semibold text-sm text-slate-500 bg-slate-200 prev`} disabled={
              pageview == 0}
            onClick={() => changeView("prev")}
          >
            PREV
          </button>
          {evsdata?.portfolios?.map((row1: any, i: React.Key) => (
            <span
              className={`w-5 h-5 my-1 rounded-full shadow-xs border-2 ${
                pageview == i && !pageComplete(row1.id)
                  ? "bg-slate-200 border-slate-300"
                  : pageview == i && pageComplete(row1.id)
                  ? "bg-slate-100 border-green-500"
                  : pageview != i &&
                    pageComplete(row1.id) &&
                    "bg-green-500 border-green-500"
              }`}
              key={i}
            >
              &nbsp;
            </span>
          ))}
          <button
            className={`hidden cursor-pointer rounded px-2 py-0.5 font-semibold text-sm text-slate-500 bg-slate-200 next`} disabled={
              (!allowNext() ||
                pageview == parseInt(evsdata?.portfolios.length) - 1) 
            }
            onClick={() => changeView("next")}
          >
            NEXT
          </button>
        </div>

        {(evsdata?.portfolios?.map((row: any, i: React.Key) => 
            pageview == i ? (
              <div key={row.id} className={styles.main}>
                <h2 className="w-auto my-2 py-4 sm:py-1 px-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:items-center justify-between font-bold tracking-widest bg-slate-100 text-slate-500 sm:rounded-full">
                  <span className="text-sm sm:text-xl text-center ">{row.name}</span>
                 { getPortfolio(row.name)?.find((r: any) => r.tag == 'skip') &&
                 <button onClick={(e) => choose(e, row.id, (getPortfolio(row.name)?.find((r: any) => r.tag == 'skip').id))} className="p-0.5 px-2 border-2 ring-1 ring-red-900 rounded-full text-[10px] text-white font-bold bg-red-800">SKIP PORTFOLIO</button> }
                </h2>
                <div className="flex flex-col">
                  <div className="flex flex-col sm:grid sm:gap-x-2 sm:grid-cols-4">
                  {
                    getPortfolio(row.name)?.map((r: any, j: React.Key) => r.tag != 'skip' ? (
                      
                      <div
                        key={r.id}
                        onClick={(e) => choose(e, row.id, r.id)}
                        className="my-1 pb-2 px-2 cursor-pointer flex flex-row items-start justify-between rounded bg-blue-50/30 hover:bg-yellow-50/70 border border-slate-200 group"
                      >
                        <div className="mt-2 pb-1 flex flex-col items-start space-x-6 ">
                          <div className="flex items-center justify-between">
                            <div className="overflow-hidden flex-col text-center items-center border border-1 border-slate-200 rounded-md">
                                <img
                                  src={`/api/photos/?tag=candid&eid=${r.id}`}
                                  alt={r.name}
                                  loading="lazy"
                                  className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-110"
                                />
                                <p className="my-3 text-sm uppercase font-bold text-red-900/80">
                                  {r.teaser}
                                </p>
                            </div>
                            <div className="ml-4 flex-col justify-center items-center">
                              <p className="font-bold italic text-4xl text-gray-700 transition-transform duration-200 group-hover:scale-125 group-hover:text-blue-900">
                                #{r.order_no}
                              </p>
                              {chosenIcon(row.id, r.id) && (
                                <span className="w-16 my-1 py-0.3 px-1 text-[0.7em] text-center text-green-800 font-semibold border-2 border-solid border-green-700 rounded-full">
                                  CHOSEN
                                </span>
                              )}
                              {!chosenIcon(row.id, r.id) &&
                                <button
                                  //onClick={(e) => choose(e, row.id, r.id)}
                                  className="w-16 my-1 py-0.3 px-1 text-[0.7em] text-center text-slate-500 font-semibold border-2 border-solid border-slate-500 rounded-full"
                                >
                                  CHOOSE
                                </button>
                              }
                            </div>
                          </div>
                          <h3 className="my-2 text-[12px] italic text-slate-800 font-bold uppercase">
                            {r.name}
                          </h3>
                        </div>
                       
                        {chosenIcon(row.id, r.id) &&<img src={Thumb.src} className="hidden mr-4 h-20 w-auto self-center" /> }
                      </div>
                    ):null)}
                  </div>
                  {false && allowSubmit() && (
                  <div className="w-auto my-4 py-2 px-8 font-bold tracking-widest bg-slate-100 text-blue-100 border rounded-full">
                    <button
                      onClick={(e) => submitVote(evsdata && eid)}
                      className="w-full m-1 p-2 rounded-xl bg-blue-900 text-white/90"
                    >
                      SUBMIT VOTE
                    </button>
                  </div>
                  )}
                </div>
              </div>
            ) : null
          )) || <div className="h-56 w-full flex items-center justify-center"><span className="text-sm font-serif font-semibold">PLEASE WAIT ...</span></div>}

        {/* <div className={styles.aside}></div> */}
      </div>
    </>
  );
}
