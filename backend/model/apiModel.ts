import axios from "axios";
import https from 'https'
import fs from 'fs';
import { getImage } from "../../utils/apiClient";

export const db = require('../config/database');

module.exports = {
   
   verifyAdmin : async (username: string,password: string) => {
      var res;
      const centre = await db.query("select * from eb_centre where `default` = 1");
      if(centre && centre.length > 0){
         res = await db.query("select v.* from eb_admin v where v.username = '"+username+"' and v.password = '"+password+"' and (v.centre_id = "+centre[0].id+" or v.centre_id = 0)");
         return res && res[0];
      }
   },

   verifyVoter : async (username:string, password:string) => {
      var res;
      const centre = await db.query("select * from eb_centre where `default` = 1");
      if(centre && centre.length > 0)
         res = await db.query("select v.*,m.voted as vote_status from eb_voter v left join eb_voter m on (v.tag = m.tag and v.centre_id = m.centre_id) where v.tag = '"+username+"' and v.password = '"+password+"' and v.centre_id = "+centre[0].id);
      return res && res[0];
   },

   fetchTest : async () => {
      var res;
      const centre = await db.query("select * from eb_centre where `default` = 1");
      if(centre && centre.length > 0) res = centre[0]
        return res;
   },


   /* ELECTIONS MODELS */

   fetchElectionByVoter : async (username:string) => {
      var res;
      const vt = await db.query("select v.* from eb_voter v left join eb_centre c on v.centre_id = c.id where  c.`default` = 1 and v.verified = 1 and v.tag = '"+username+"'");
      if(vt && vt.length == 1){
         const dm = await db.query("select en.* from eb_election en where en.centre_id = "+vt[0].centre_id);
         if(dm && dm.length > 0){
            const dt = [];
            for(var d of dm){
               var vm = {}
               const et = await db.query("select ev.vote_status,ev.vote_time,ev.vote_sum from eb_elector ev where ev.tag = '"+username+"' and ev.election_id = "+d.id);
               if(et && et.length > 0){
                  vm = { ...et[0] }
               }else{
                  vm = { vote_status: 0, vote_time: null, vote_sum: null }
               }
               dt.push({ ...d,...vm })
            }
            res = dt;
         }
      }
      return res;
   },

   fetchElectionDataByVoter : async (username:string) => {
      var resm;
      //const vt = await db.query("select v.* from electo.voter v left join electo.centre c on v.centre_id = c.id where c.`default` = 1 and v.verified = 1 and v.tag = '"+username+"'");
      const vt = await db.query("select v.* from eb_voter v left join eb_centre c on v.centre_id = c.id where c.`default` = 1 and v.tag = '"+username+"'");
      
      if(vt && vt.length == 1){
        const dm = await db.query("select en.* from eb_election en where en.live_status = 1 and en.centre_id = "+vt[0].centre_id);
        if(dm && dm.length > 0){
            const dt = [];
            for(var d of dm){
              var vm = <any>{}
              const et = await db.query("select ev.vote_status,ev.vote_time,ev.vote_sum from eb_elector ev where ev.tag = '"+username+"' and ev.election_id = "+d.id);
              if(et && et.length > 0){
                vm = { ...et[0] }
              }else{
                vm = { vote_status: 0, vote_time: null, vote_sum: null }
              } 
              // FETCH ELECTION
              var data = <any>{};
              // Portfolio data
              var res1 = await db.query(
                "select * from eb_portfolio where status = 1 and election_id = " + d.id
              );
              console.log(d.id,res1)
              
              if (res1 && res1.length > 0) data.portfolios = res1;
              // Candidate data
              var res2 = await db.query(
                "select c.*,p.name as portfolio,p.id as pid from eb_candidate c left join eb_portfolio p on c.portfolio_id = p.id where c.status = 1 and p.election_id = " +
                  d.id
              );
              if (res2 && res2.length > 0) data.candidates = res2;
              // Election data
              var res3 = await db.query(
                "select e.* from eb_election e where e.id = "+d.id);
              if (res3 && res3.length > 0) data.election = res3;
              // Voters data
              var res4 = await db.query(
                "select * from eb_elector where election_id = " + d.id);
              if (res4 && res4.length > 0) data.electors = res4;
          
              // Voters data
              var res5 = await db.query(
                "select * from eb_elector where election_id = " + d.id+" and tag = '" +
                username +
                "'"
              );
              if (res5 && res5.length > 0) data.voter = res5[0];
              dt.push({ status: vm.vote_status, data })
            }
            resm = dt;
            console.log(dt)
        }
      }
      return resm;
   },

   
   fetchCentres : async () => {
      var res;
      const et = await db.query("select * from eb_centre");
      if(et && et.length > 0) return et;
      return res;
   },

   activateCentre : async (cid:string) => {
      var res;
      const er = await db.query("update eb_centre set `default` = 0");
      const et = await db.query("update eb_centre set `default` = 1 where id ="+cid);
      if(et && et.affectedRows > 0) return et;
      return res;
   },

   resetCentreElections : async (id:string) => {
      var res;
      const en = await db.query("select * from eb_election where centre_id = "+id);
      if(en && en.length > 0){
        // Update Centre Voter DataS
        await db.query("update eb_voter set voted = 0, verified = 0, verified_at = null where centre_id = "+id+"")
        for(var es of en){
          // Load Candidates of portfolios of elections
          await db.query("update eb+candidate c left join eb_portfolio p on p.id = c.portfolio_id set votes = 0 where p.election_id = "+es.id)
          // Delete Elector
          await db.query("delete from eb_elector where election_id = "+es.id)
        }
        return en
      }
      return res;
   },

   loadCentreData : async (cid:string) => {
      var res;
      const er = await db.query("select tag,id from eb_centre where id ="+cid);
      if(er && er.length > 0){
        let count = 0
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const rs = await axios.get(`https://ehub.ucc.edu.gh/zeus/evs/loadcentredata/${er[0].tag}/regular`,{httpsAgent})
        if(rs && rs.data.length > 0){
          const voters = rs.data;
          console.log(voters)
          
          for(const vs of voters){
            const m =  await db.query("select * from eb_voter where tag = '"+vs.regno+"' and centre_id ="+er[0].id);
            if(m && m.length == 0){
              const dt = { tag:vs.regno, name:vs.name, descriptor: vs.programme, centre_id:er[0].id, status:1, voted:0 }
              const et = await db.query("insert into eb_voter set ?", dt);
              if(et && et.affectRows > 0) count+=1
            }
          }
        }
        if(count > 0){
          const x =  await db.query("select * from eb_voter where centre_id = "+er[0].id);
          const m =  await db.query("select * from eb_election where centre_id = "+er[0].id);
          if(m && m.length > 0){
            for( const ms of m){
              const et = await db.query("update eb_election set voters_count = "+x.length+" where id ="+cid);
              if(et && et.affectRows > 0) count+=1
            }
          }
          return count
        } 
      }
      return res ;
  },


  
  loadCentrePhotos : async (cid:string) => {
    var res;
    const m =  await db.query("select * from eb_voter where centre_id ="+cid);
    if(m && m.length > 0){
      let count = 0;
      const dest = `./public/upload/voter/`
      for(var vs of m){
        const cleanTag = vs.tag.replaceAll(/\//gi,"").toLowerCase()+'.jpg'
        const imgurl = `https://ehub.ucc.edu.gh/api/photos/?tag=${encodeURIComponent(vs.tag)}`
        
        console.log(cleanTag,imgurl)
        const rs = await getImage(imgurl,dest+cleanTag,fs)
        count+=1
      }
    }
    return res ;
},



   fetchElectionByCentre : async (cid:string) => {
      var res;
      const et = await db.query("select en.* from eb_election en where en.id = "+cid);
      if(et && et.length > 0) return et;
      return res;
   },

   fetchElectionByActiveCentre : async () => {
      var res;
      const ct = await db.query("select * from eb_centre en where `default` = 1");
      if(ct && ct.length > 0){
         const et = await db.query("select en.* from eb_election en where en.centre_id = "+ct[0].id);
         if(et && et.length > 0) return et;
      }
      return res;
   },

   fetchVotersByActiveCentre : async (search:any,page:any) => {
        var res;
        const ct = await db.query("select * from eb_centre en where `default` = 1");
        if(ct && ct.length > 0){
          const sql = search ?
           "select ev.* from eb_voter ev where (ev.tag like '%"+search+"%' or ev.name like '%"+search+"%')  and ev.centre_id = "+ct[0].id+" limit 10" : 
           "select ev.* from eb_voter ev where ev.centre_id = "+ct[0].id+" limit 10";
          const et = await db.query(sql);
          if(et && et.length > 0) return et;
        }
        return res;
    },
   

   fetchVerifiedByActiveCentre : async () => {
      var res;
      const ct = await db.query("select * from eb_centre en where `default` = 1");
      if(ct && ct.length > 0){
         const sql = "select v.* from eb_voter v where v.verified = 1 and v.voted = 0 and v.centre_id = "+ct[0].id
         const et = await db.query(sql);
         console.log(sql)
         if(et && et.length > 0) return et;
      }
      return res;
   },
   
   
   fetchElectionDataById : async (eid:string,tag:string) => {
    var data = <any>{};
    // Portfolio data
    var res = await db.query(
      "select * from eb_portfolio where status = 1 and election_id = " + eid
    );
    if (res && res.length > 0) data.portfolios = res;
    // Candidate data
    var res = await db.query(
      "select c.*,p.name as portfolio,p.id as pid from eb_candidate c left join eb_portfolio p on c.portfolio_id = p.id where c.status = 1 and p.election_id = " +
        eid
    );
    if (res && res.length > 0) data.candidates = res;
    // Election data
    var res = await db.query(
      "select e.* from eb_election e where e.id = "+eid);
    if (res && res.length > 0) data.election = res;
    // Voters data
    var res = await db.query(
      "select * from eb_elector where election_id = " + eid);
    if (res && res.length > 0) data.electors = res;

    // Voters data
    var res = await db.query(
      "select * from eb_elector where election_id = " + eid+" and tag = '" +
      tag +
      "'"
    );
    if (res && res.length > 0) data.voter = res[0];
    
    return data;
   },

   fetchMonitor: async (mid:string) => {
      var data = <any>{};
      // Portfolio data
      var res = await db.query(
        "select * from eb_portfolio where status = 1 and election_id = " + mid
      );
      if (res && res.length > 0) data.portfolios = res;
      // Candidate data
      var res = await db.query(
        "select c.*,p.name as portfolio from eb_candidate c left join eb_portfolio p on c.portfolio_id = p.id where c.status = 1 and p.election_id = " +
          mid
      );
      if (res && res.length > 0) data.candidates = res;
      // Election data
      var res = await db.query("select * from eb_election where id = " + mid);
      if (res && res.length > 0) data.election = res;
      // Voters data
      var res = await db.query(
        "select * from eb_elector where election_id = " + mid
      );
      if (res && res.length > 0) data.electors = res;
  
      return data;
    },


    fetchReceipt: async (rid:string, tag:string) => {
      // Voters data
      let data = <any>{},
        selections = [];
      var res = await db.query(
        "select * from eb_elector where election_id = " + rid
      );
      if (res && res.length > 0) data.electors = res;
      var res = await db.query(
        "select * from eb_elector where election_id = " +
          rid +
          " and tag = '" +
          tag +
          "'"
      );
      if (res && res.length > 0) {
        const candidates = res[0].vote_sum && res[0].vote_sum.split(",");
        if (candidates) {
          for (const candid of candidates) {
            var cs = await db.query(
              "select c.*,p.name as portfolio from eb_candidate c left join eb_portfolio p on c.portfolio_id = p.id where p.election_id = " +
                rid +
                " and c.id = " +
                candid
            );
            if (cs && cs.length > 0) selections.push(cs[0]);
          }
        }
      }
      return { ...data, selections };
    },

    
    fetchRegister: async (id:string) => {
      // Voters data
      var res = await db.query("select * from eb_election where id = " + id);
      if (res && res.length > 0) {
        var voters = await db.query("select v.*,ifnull(ev.vote_status,0) as voted from eb_voter v left join eb_elector ev on (v.tag = ev.tag and ev.election_id = "+id+") where v.centre_id = " + res[0].centre_id);
        return { ...(res && res[0]), electors:voters };
      } 
      return null;
    },

    postVoteData: async (data:any) => {
      const { id, tag, votes, name } = data;
  
      // START TRANSACTION
      //await db.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
      //await db.beginTransaction();
      try {
        // Get Portfolio count & Verify whether equal to data posted
        var res = await db.query(
          "select * from eb_portfolio where status = 1 and election_id = " + id
        );
        if (res && res.length > 0) {
          const count = res.length;
          var vt = await db.query(
            "select * from eb_elector where election_id = " +
              id +
              " and trim(tag) = '" +
              tag +
              "' and vote_status = 1"
          );
          if (vt && vt.length <= 0) {
            if (count == Object.values(votes).length) {
              // Update Candidate Votes Count
              const vals = Object.values(votes);
              var update_count = 0;
              if (vals.length > 0) {
                for (var val of vals) {
                  const cs = await db.query(
                    "select * from eb_candidate where id = " + val
                  );
                  if (cs && cs.length > 0) {
                    const ups = await db.query(
                      "update eb_candidate set votes = (votes+1) where id = " +
                        val
                    );
                    if (ups.affectedRows > 0) update_count += 1;
                  }
                }
              }
  
              if (count != update_count) {
                throw new Error(`Votes partially received`);
                //return { success: false, msg: 'Votes partially recorded', code: 1001 }
              }
              // Insert Into Elector Database
              const dm = {
                vote_status: 1,
                vote_sum: Object.values(votes).join(","),
                vote_time: new Date(),
                name,
                tag,
                election_id: id,
              };
              const ins = await db.query("insert into eb_elector set ?", dm);
  
              if (ins && ins.insertId > 0) {
                //await db.commit();
                return { success: true, msg: "Voted successfully", code: 1000 };
              } else {
                throw new Error(`Votes saved for elector`);
                //return { success: false, msg: 'Votes saved for elector', code: 1002 }
              }
            } else {
              // Votes Not Received
              throw new Error(`Votes partially received`);
              //return { success: false, msg: 'Votes partially received', code: 1003 }
            }
          } else {
            // Voted Already
            throw new Error(`Elector already voted`);
            //return { success: false, msg: 'Elector already voted', code: 1004 }
          }
        } else {
          throw new Error(`Portfolio not found`);
          //return { success: false, msg: 'Portfolio not found', code: 1005 }
        }
      } catch (e) {
        //db.rollback();
        //console.info('Rollback successful');
        return {
          success: false,
          msg: "Please Submit Again",
          code: 1004,
        };
      }
    },

    updateControl: async (id:string, data:any) => {
      const sql = "update eb_election set ? where id = " + id;
      const res = await db.query(sql, data);
      return res;
    },


    fetchPhoto: async (tag:string, eid:string) => {
      var res;
      if (tag == "logo") {
        res = await db.query("select logo as path from eb_election where id = ?", [eid]);
      }else if (tag == "centre") {
         res = [{path:`./upload/logos/${eid.split(' ').join('').toLowerCase()}.jpg`}]
      }else if (tag == "voter") {
        res = [{path:`./upload/voter/${eid.split('/').join('').toLowerCase()}.jpg`}]
      }else if (tag == "candid") {
        res = await db.query("select photo as path from eb_candidate where id = ?", [eid]);
      }
      return res;
    },

    // VOTER MODELS
    fetchEligibleVoters : async () => {
      var res;
      const ct = await db.query("select * from eb_centre en where `default` = 1");
      if(ct && ct.length > 0){
         const et = await db.query("select v.* from eb_voter v where v.centre_id = "+ct[0].id);
         if(et && et.length > 0) return et;
      }
      return res;
   },

   
   activateVoter: async (id:string) => {
    const sql = "update eb_voter set ? where id = " + id;
    const res = await db.query(sql, { verified: 1, verified_at: new Date() });
    return res;
  },

  postVoteStatus: async (id:string,tag:string) => {
    const sql = "update eb_voter set ? where tag = '"+tag+"' and centre_id = " + id;
    const res = await db.query(sql, { verified: 0, voted: 1 });
    return res;
  },

  

   // FETCH VOTERS - AFTER VERIFIED ACTION


  // CONTROLS && ACTIONS
  saveControl: async (data:any) => {
    var res;
    const { id, data:body } = data;
    if(data){
      const sql = "update eb_election set ? where id = "+id;
      const res = await db.query(sql, body);
    } 
    return res;
  },


};

