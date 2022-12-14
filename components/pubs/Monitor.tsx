import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie,Doughnut } from 'react-chartjs-2';
import { fetchMonitor } from "../../utils/apiClient";
import { useUserStore } from "../../utils/store";
import { chartColors } from "../../utils/colors";
import type { ChartData, ChartOptions } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend);

const styles = {
  wrapper: `w-full p-2 bg-white rounded-lg border border-slate-100`,
  main: `w-full p-2 bg-white flex flex-col`,
  main2: `w-full p-2 bg-white flex justify-between`,
  indicator: `w-full mx-auto mt-3 p-2 flex flex-row flex-wrap items-center justify-center space-x-2`,
  stats: `mx-auto p-2 flex flex-row items-center justify-center space-x-2 border-2 border-dotted rounded-lg`,
  aside: ``,
};

export default function Monitor({setPage, eid:id, ename: sname, logo}:any) {
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
        const n = [`LEADER ${i + 1}`, d.votes];
        data.push(n);
      }
    } return data;
  };

  const getChartDataOffline = (name: string) => {
    /*
    const data = {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    */
    var data:any = {
      labels:[],
      datasets:[
        {
          label: 'ELECTION LEADERBOARD ',
          backgroundColor:[],
          borderColor:[],
          borderWidth: 1.5,
          data: [],
        },
      ],
      
    };
    const dm = chartData?.filter((r: any) => r.portfolio == name);
    if (dm && dm.length > 0) {
      const dmx = dm
        ?.filter((r: any) => r.votes > 0)
        .sort((a: any, b: any) => b.votes - a.votes);
      for (var i = 0; i < dmx.length; i++) {
        const d = dmx[i];
        const n = [`LEADER ${i + 1} - [ (${d.votes}) | ${(d.votes/electors.length*100).toFixed(1)}% ]`];
        data?.labels?.push(n);
        data?.datasets[0].data?.push(d.votes);
        data?.datasets[0].backgroundColor?.push(chartColors[i]);
        data?.datasets[0].borderColor?.push("#333");
      }
    } return data;
  };

  /*
   
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
  
  */

  const changeView = () => {
    setTimeout(() => {
      const index = (pageview + 1) % evsdata.portfolios?.length;
      setPageview(index);
    }, 5000);
  };

  const syncData = async () => {
    const resp = await fetchMonitor(id || eid);
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
    const timer = setInterval(() => syncData(), 10000);
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
          pageview == i ? (
            <div className={styles.main}>
              <h2 className="w-auto my-4 py-1 px-8 font-bold tracking-widest bg-slate-100 text-slate-500 rounded-full">
                {row.name}
              </h2>
              <div className="flex flex-col ">
                <div className="my-1 pb-2 flex flex-col items-start justify-center border-dotted border-b-2 border-slate-100">
                  {false && chartData && (
                    <Chart
                      key={i}
                      chartType="PieChart"
                      data={getChartData(row.name)}
                      options={{ is3D: true }}
                      width={"100%"}
                      height={"400px"}
                    />
                   
                  )}

                  {chartData && (
                  <Doughnut
                    data={getChartDataOffline(row.name)}
                  />
                  )}
                  
                </div>
              </div>
            </div>
          ) : null
        )}
        {/* <div className={styles.aside}></div> */}
      </div>
    </>
  );
}
