import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { fetchMonitor } from "../../utils/apiClient";
import { useUserStore } from "../../utils/store";

const styles = {
  wrapper: `w-full p-2 bg-white rounded-lg border border-slate-100`,
  main: `w-full p-2 bg-white flex flex-col`,
  main2: `w-full p-2 bg-white flex justify-between`,
  indicator: `w-full mx-auto mt-3 p-2 flex flex-row flex-wrap items-center justify-center space-x-2`,
  stats: `mx-auto p-2 flex flex-row items-center justify-center space-x-2 border-2 border-dotted rounded-lg`,
  aside: ``,
};

export default function Strongroom({setPage, eid:id, ename: sname, logo}:any) {
  //const { user, eid, ename, tag } = useUserStore.getState();
  const { user, eid, ename } = useUserStore((state) => state);
  const [electors, setElectors] = useState<any>(null);
  const [evsdata, setEvsdata] = useState<any>({});
  const [chartData, setChartData] = useState<any>([]);
  const [pageview, setPageview] = useState(0);
  
  const monitorNow = async () => {
    const resp = await fetchMonitor(id || eid);
    if (resp.success) {
       setEvsdata({ ...resp.data, name: sname || ename, id: id || eid });
    }
  };

  const getPortfolio = (name: string) => {
    return (
      evsdata &&
      evsdata.candidates &&
      evsdata?.candidates.filter((r: any) => r.portfolio == name)
    );
  };
   
  const getChartData = (name: string) => {
    var data = [["Candidate", "Votes"]];
    const dm = chartData?.filter((r: any) => r.portfolio == name);
    if (dm && dm.length > 0) {
      const dmx = dm
        ?.filter((r: any) => r.votes > 0)
        .sort((a: any, b: any) => b.votes - a.votes);
      for (var i = 0; i < dmx.length; i++) {
        const d = dmx[i];
        //const n = [d.tag && d.tag.toUpperCase(),d.votes]
        // const n = [`LEADER ${i + 1}`, d.votes];
        const n = [d.tag && d.tag.toUpperCase(), d.votes];
        data.push(n);
      }
    }
    return data;
  };
  

  const changeView = () => {
    setTimeout(() => {
      const index = (pageview + 1) % evsdata.portfolios?.length;
      setPageview(index);
    }, 5000);
  };

  const syncData = async () => {
    const resp = await fetchMonitor(id || eid);
    console.log(resp)
    if (resp.success) {
      resp.data.candidates && setChartData(resp.data.candidates);
      resp.data.electors && setElectors(resp.data.electors);
    }
  };

  useEffect(() => {
    syncData()
    monitorNow();
  }, []);

  useEffect(() => {
    evsdata.candidates && setChartData(evsdata.candidates);
    const timer = setInterval(() => {
      syncData()
      monitorNow()
    }, 10000);
    changeView();

    return () => {
      clearInterval(timer);
    };
  }, [evsdata]);

  useEffect(() => {
    changeView();
  }, [pageview]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.main2}>
          <h3 className="w-full flex items-center justify-between text-2xl font-bold text-slate-500 text-center">
            <span>{evsdata?.name}</span>
            <div className="px-0.5 h-16 rounded-full bg-slate-50 flex items-center justify-center">
              <img src={`/api/photos/?tag=logo&eid=${logo}`} className="h-16 object-cover opacity-70 rounded"/>
            </div>
          </h3>
        </div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.stats}>
            <span className=" px-10 py-1 text-xl font-bold text-slate-600 bg-slate-50 rounded-full shadow-xs border-2 border-slate-300">
              TURNOUT: <span className="font-extrabold text-yellow-700">{electors?.length || evsdata.electors?.length || 0}</span>
            </span>

            {/*
          <span className="px-4 py-1 font-semibold bg-slate-50 rounded-full shadow-xs border-2 border-slate-300">
            Absent: 56565
          </span>
          */}
        </div>
        

        <div className={styles.indicator}>
          {evsdata &&
            evsdata.portfolios &&
            evsdata.portfolios.map((row: any, i: React.Key) => (
              <span
                className={`w-5 h-5 my-1 rounded-full shadow-xs border-2 border-slate-300 ${
                  pageview == i ? "bg-slate-500" : "bg-slate-200"
                }`}
                key={i}
              >
                &nbsp;
              </span>
            ))}
        </div>

        {evsdata.portfolios?.map((row: any, i: React.Key) =>
         
            <div className={`${pageview == i ? 'flex':'hidden'} transition-all duration-200 w-full p-2 bg-white flex-col`}>
              <h2 className="w-auto my-4 py-1 px-8 font-extrabold tracking-widest border-2 bg-slate-100 text-slate-500 rounded-full">
                {row.name}
              </h2>
              <div className="hidden flex-col ">
                <div className="my-1 pb-2 flex flex-row items-start justify-center border-dotted border-b-2 border-slate-100">
                  {chartData && (
                    <Chart
                      key={i}
                      chartType="PieChart"
                      data={getChartData(row.name)}
                      options={{ is3D: true }}
                      width={"100%"}
                      height={"400px"}
                    />
                  )}
                </div>

                {/* Main Strongroom Statistics */}


              </div>
       
              <div className="flex flex-wrap items-center justify-between">
                    {getPortfolio(row.name) &&
                      getPortfolio(row.name)
                        //.sort((a: any, b: any) => b.votes - a.votes)
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
                                <h3 className="text-base font-bold uppercase">
                                  {r.name}
                                </h3>
                                <p className="text-sm font-medium italic uppercase text-slate-500/80">
                                  {r.teaser} {r.order_no ? <span className="font-extrabold text-lg text-blue-900/60"> - #{r.order_no}</span>:''}
                                </p>
                                <div className="flex space-x-2">
                                  <span className="w-24 my-1 py-0.3 px-2 text-[1.1em] text-center text-blue-900 font-extrabold border-2 border-solid border-slate-700 rounded-full">
                                    {r.votes}
                                  </span>
                                  <span className="w-24 my-1 py-0.3 px-2 text-[1em] text-center italic text-slate-800 font-semibold border-2 border-solid border-slate-700 rounded-full">
                                    { electors?.length > 0 ? (
                                      (parseInt(r.votes) / electors?.length) *
                                      100
                                    ).toFixed(1) : 0 }
                                    %
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
              </div>


            </div>
         
        )}
        {/* <div className={styles.aside}></div> */}
      </div>
    </>
  );
}
