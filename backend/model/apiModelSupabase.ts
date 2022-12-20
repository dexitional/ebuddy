import axios from "axios";
import https from 'https'
import fs from 'fs';
import { getImage } from "../../utils/apiClient";
import db from '../../supabase'
import sms from '../config/sms'
//export const db = require('../../supabase');

module.exports = {

  verifyAdmin: async (username: string, password: string) => {
    // Supabase
    const { data } = await db
      .from('eb_admin')
      .select('*')
      .eq('username', username)
      .eq('password', password).single();
    if (data) return data;
  },

  verifyVoter: async (username: string, password: string) => {
    const { data: centre } = await db.from("eb_centre").select('*').eq('default', 1);

    if (centre && centre.length > 0) {
      // Supabase
      var { data: res } = await db
        .from('eb_voter')
        .select(`*`)
        .eq('tag', username?.toUpperCase())
        .eq('password', password)
        .eq('centre_id', centre[0].id || 0).single();
      if (res) return res;
    }

  },

  fetchTest: async () => {
    // Supabase
    const { data } = await db
      .from('eb_centre')
      .select('*')
      .eq('default', 1)
    if (data && data.length > 0) return data && data[0];
  },


  /* ELECTIONS MODELS */

  fetchElectionByVoter: async (username: string) => {
    var res;
    //const vt = await db.query("select v.* from eb_voter v left join eb_centre c on v.centre_id = c.id where  c.`default` = 1 and v.verified = 1 and v.tag = '"+username+"'");
    const { data: vt } = await db.from('eb_centre').select('*').eq('eb_centre.default', 1).eq('tag', username)
    if (vt && vt.length == 1) {
      //const dm = await db.query("select en.* from eb_election en where en.centre_id = "+vt[0].centre_id);
      const { data: dm } = await db.from('eb_election').select('*').eq('centre_id', 1).eq('tag', vt[0].centre_id)
      if (dm && dm.length > 0) {
        const dt = [];
        for (var d of dm) {
          var vm = {}
          //const et = await db.query("select ev.vote_status,ev.vote_time,ev.vote_sum from eb_elector ev where ev.tag = '"+username+"' and ev.election_id = "+d.id);
          const { data: et } = await db.from('eb_elector').select(`vote_status,vote_time,vote_sum`).eq('tag', username).eq('election_id', d.id)

          if (et && et.length > 0) {
            vm = { ...et[0] }
          } else {
            vm = { vote_status: 0, vote_time: null, vote_sum: null }
          }
          dt.push({ ...d, ...vm })
        }
        res = dt;
      }
    }
    return res;
  },

  fetchElectionDataByVoter: async (username: string) => {
    var resm;
    //const vt = await db.query("select v.* from electo.voter v left join electo.centre c on v.centre_id = c.id where c.`default` = 1 and v.verified = 1 and v.tag = '"+username+"'");
    //const vt = await db.query("select v.* from eb_voter v left join eb_centre c on v.centre_id = c.id where c.`default` = 1 and v.tag = '"+username+"'");
    const { data: vt } = await db.from('eb_voter').select(`*,eb_centre(id)`).eq('tag', username).eq('eb_centre.default', 1)
    if (vt && vt.length == 1) {
      //const dm = await db.query("select en.* from eb_election en where en.live_status = 1 and en.centre_id = "+vt[0].centre_id);
      const { data: dm } = await db.from('eb_election').select(`*`).eq('live_status', 1).eq('centre_id', vt[0].centre_id)
      if (dm && dm.length > 0) {
        const dt = [];
        for (var d of dm) {
          var vm = <any>{}
          //const et = await db.query("select ev.vote_status,ev.vote_time,ev.vote_sum from eb_elector ev where ev.tag = '"+username+"' and ev.election_id = "+d.id);
          const { data: et } = await db.from('eb_elector').select(`vote_status,vote_time,vote_sum`).eq('tag', username).eq('election_id', d.id)

          if (et && et.length > 0) {
            vm = { ...et[0] }
          } else {
            vm = { vote_status: 0, vote_time: null, vote_sum: null }
          }
          // FETCH ELECTION
          var data = <any>{};
          // Portfolio data
          //var res1 = await db.query("select * from eb_portfolio where status = 1 and election_id = " + d.id);
          const { data: res1 } = await db.from('eb_portfolio').select('*').eq('status', 1).eq('election_id', d.id)
          if (res1 && res1.length > 0) data.portfolios = res1;
          // Candidate data
          //var res2 = await db.query("select c.*,p.name as portfolio,p.id as pid from eb_candidate c left join eb_portfolio p on c.portfolio_id = p.id where c.status = 1 and p.election_id = " +d.id);
          const { data: res2 } = await db.from('eb_candidate').select(`*, portfolio:eb_portfolio(name),pid:portfolio_id`).eq('status', 1).eq('eb_portfolio.election_id', d.id).order('order_no', { ascending: true })
          if (res2 && res2.length > 0) data.candidates = res2;
          // Election data
          //var res3 = await db.query("select e.* from eb_election e where e.id = "+d.id);
          const { data: res3 } = await db.from('eb_election').select('*').eq('id', d.id)
          if (res3 && res3.length > 0) data.election = res3;
          // Voters data
          //var res4 = await db.query("select * from eb_elector where election_id = " + d.id);
          const { data: res4 } = await db.from('eb_elector').select('*').eq('election_id', d.id)
          if (res4 && res4.length > 0) data.electors = res4;

          // Voters data
          //var res5 = await db.query("select * from eb_elector where election_id = " + d.id+" and tag = '" +username +"'");
          const { data: res5 } = await db.from('eb_elector').select('*').eq('tag', username).eq('election_id', d.id)
          if (res5 && res5.length > 0) data.voter = res5[0];
          dt.push({ status: vm.vote_status, data })
        }
        resm = dt;
      }
    }
    return resm;
  },


  fetchCentres: async () => {
    var res;
    //const et = await db.query("select * from eb_centre");
    const { data: et } = await db.from('eb_centre').select('*')
    if (et && et.length > 0) return et;
    return res;
  },

  activateCentre: async (cid: string) => {
    var res;
    //const er = await db.query("update eb_centre set `default` = 0");
    //const et = await db.query("update eb_centre set `default` = 1 where id ="+cid);
    //if(et && et.affectedRows > 0) return et;
    await db.from('eb_centre').update({ default: 0 }).eq('id', 1)
    const { data: et }: any = await db.from('eb_centre').update({ default: 1 }).eq('id', cid)
    if (et.status === 200) return et;
    return res;
  },

  resetCentreElections: async (id: string) => {
    var res;
    //const en = await db.query("select * from eb_election where centre_id = "+id);
    const { data: en } = await db.from('eb_election').select(`*`).eq('centre_id', id)
    if (en && en.length > 0) {
      // Update Centre Voter Data
      //await db.query("update eb_voter set voted = 0, verified = 0, verified_at = null where centre_id = "+id+"")
      await db.from('eb_voter').update({ voted: 0, verified: 1, verified_at: null }).eq('centre_id', id)
      for (var es of en) {
        // Load Candidates of portfolios of elections
        const { data: ct } = await db.from('eb_candidate').select(`*,eb_portfolio(id)`).eq('eb_portfolio.election_id', es.id)
        if (ct && ct.length > 0) {
          for (const cs of ct) {
            // Reset Candidate votes
            //await db.query("update eb_candidate c left join eb_portfolio p on p.id = c.portfolio_id set votes = 0 where p.election_id = "+es.id)
            await db.from('eb_candidate').update({ votes: 0 }).eq('id', cs.id)
          }
        }
        // Delete Elector
        //await db.query("delete from eb_elector where election_id = "+es.id)
        await db.from('eb_elector').delete().eq('election_id', es.id)
      }
      return en
    }
    return res;
  },

  loadCentreData: async (cid: string) => {
    var res;
    return res;
  },

  loadCentrePhotos: async (cid: string) => {
    var res;
    return res;
  },

  sendCrendentials: async (id: string) => {
    console.log("working")
    var count = 0;
    const { data: en } = await db.from('eb_voter').select(`*`).eq('centre_id', id)
    if (en && en.length > 0) {
      for (var es of en) {
        if (!es.sms_status || es.sms_status != 1000) {
          // Generate Password
          const password = es.password ? es.password : `${Math.random() * 1000}`
          //const msg = `Hi, Please vote with Username: ${es.tag} , Password: ${es.password} , Goto https://ebuddy.vercel.app to vote!`
          const msg = `Hi, Please vote with Username: ${es.tag} , Password: ${es.password} , Please goto the Auditorium to vote!`
          const phone = es.phone[0] == '0' ? es.phone : `0${es.phone}`
          const sender = `eVote`
          // Send SMS
          const sms_status = await sms(phone, msg, sender)
          console.log(sms_status, phone, msg, sender)
          if (sms_status.code == 1000) count += 1
          // Update SMS Status 
          await db.from('eb_voter').update({ sms_status: sms_status.code, password }).eq('id', es.id)
        }
      }
    } return count;
  },

  sendToVoter: async (id: string) => {
    var count = 0;
    const { data: en } = await db.from('eb_voter').select(`*`).eq('id', id)
    if (en && en.length > 0) {
      for (var es of en) {
        // Generate Password
        const password = es.password ? es.password : `${Math.random() * 1000}`
        //const msg = `Hi, Please vote with Username: ${es.tag} , Password: ${es.password} , Goto https://ebuddy.vercel.app to vote!`
        const msg = `Hi, Please vote with Username: ${es.tag} , Password: ${es.password} , Please goto the Auditorium to vote!`
        const phone = es.phone[0] == '0' ? es.phone : `0${es.phone}`
        const sender = `eVote`
        // Send SMS
        const sms_status = await sms(phone, msg, sender)
        console.log(sms_status, phone, msg, sender)
        if (sms_status.code == 1000) count += 1
        // Update SMS Status 
        await db.from('eb_voter').update({ sms_status: sms_status.code, password }).eq('id', es.id)
      }
    } return count;
  },

  loadVoters: async () => {
    var count = 0;
    const data = require('../data.json')
    if (data && data.length > 0) {
      for (const dt of data) {
        //console.log(dt)
        // Check whether voter exists
        const { data: ev } = await db.from('eb_voter').select(`*`).eq('tag', dt.tag).single()
        console.log(ev)
        // Generate Password
        const password = `${Math.round(Math.random() * 1000000)}`
        const dm = { ...dt, tag: dt.tag?.toUpperCase()?.replaceAll(' ', ''), name: dt.name?.toUpperCase()?.replaceAll('  ', ' '), password, descriptor: 'ESIAMA-NMTC', voted: 0, verified: 1, centre_id: 1 }

        if (!ev) {
          // Insert Voter if not Present
          const { data: ins, error }: any = await db.from('eb_voter').insert(dm).select()
          console.log(ins, error)
          if (ins?.status === 200) count += 1
        } else {
          // Insert Voter if not Present
          const { data: ups, error }: any = await db.from('eb_voter').update(dm).eq('id', ev.id).select()
          console.log(ups, error)
          if (ups?.status === 200) count += 1
        }
      }
    } return count;
  },



  fetchRegister: async (id: string) => {
    // Voters data
    //var res = await db.query("select * from eb_election where id = " + id);
    var { data: res } = await db.from('eb_election').select('*').eq('id', id)
    if (res && res.length > 0) {
      //var voters = await db.query("select v.*,ifnull(ev.vote_status,0) as voted from eb_voter v left join eb_elector ev on (v.tag = ev.tag and ev.election_id = "+id+") where v.centre_id = " + res[0].centre_id);
      var { data: voters } = await db.from('eb_voter').select(`*,voted:vote_status`).eq('centre_id', id)
      return { ...(res && res[0]), electors: voters };
    }
    return null;
  },


  fetchElectionByCentre: async (cid: string) => {
    var res;
    //const et = await db.query("select en.* from eb_election en where en.id = "+cid);
    const { data: et } = await db.from('eb_election').select(`*`).eq('id', cid)
    if (et && et.length > 0) return et;
    return res;
  },

  fetchElectionByActiveCentre: async () => {
    var res;
    //const ct = await db.query("select * from eb_centre en where `default` = 1");
    const { data: ct, error } = await db.from('eb_centre').select(`*`).eq('default', 1)
    if (ct && ct.length > 0) {
      //const et = await db.query("select en.* from eb_election en where en.centre_id = "+ct[0].id);
      const { data: et } = await db.from('eb_election').select(`*`).eq('centre_id', ct[0].id)
      if (et && et.length > 0) return et;
    }
    return res;
  },

  fetchVotersByActiveCentre: async (search: any, page: any) => {
    var res;
    //const ct = await db.query("select * from eb_centre en where `default` = 1");
    const { data: ct } = await db.from('eb_centre').select(`*`).eq('default', 1)
    if (ct && ct.length > 0) {
      /*
      const sql = search ?
       "select ev.* from eb_voter ev where (ev.tag like '%"+search+"%' or ev.name like '%"+search+"%')  and ev.centre_id = "+ct[0].id+" limit 10" : 
       "select ev.* from eb_voter ev where ev.centre_id = "+ct[0].id+" limit 10";
      const et = await db.query(sql);
      */
      const { data: et } = search ?
        //await db.from('eb_voter').select(`*`).ilike('tag', `%${search}%`)
        //await db.from('eb_voter').select(`*`).or(`or(name.ilike.%${search}%,tag.ilike.%${search}%),or(email.ilike.%$search_term%,account.ilike.%$search_term%)`)
        await db.from('eb_voter').select(`*`).or(`or(name.ilike.%${search}%,tag.ilike.%${search}%)`)
        : await db.from('eb_voter').select(`*`).eq('centre_id', ct[0].id)
      if (et && et.length > 0) return et;
    }
    return res;
  },


  fetchVerifiedByActiveCentre: async () => {
    var res;
    //const ct = await db.query("select * from eb_centre en where `default` = 1");
    const { data: ct } = await db.from('eb_centre').select(`*`).eq('default', 1)
    if (ct && ct.length > 0) {
      //const sql = "select v.* from eb_voter v where v.verified = 1 and v.voted = 0 and v.centre_id = "+ct[0].id
      //const et = await db.query(sql);
      const { data: et } = await db.from('eb_voter').select(`*`).eq('verified', 1).eq('voted', 1).eq('centre_id', ct[0].id)
      if (et && et.length > 0) return et;
    }
    return res;
  },


  fetchElectionDataById: async (eid: string, tag: string) => {
    var data = <any>{};
    // Portfolio data
    //var res1 = await db.query("select * from eb_portfolio where status = 1 and election_id = " +eid);
    const { data: res1 } = await db.from('eb_portfolio').select('*').eq('status', 1).eq('election_id', eid)
    if (res1 && res1.length > 0) data.portfolios = res1;
    // Candidate data
    //var res2 = await db.query("select c.*,p.name as portfolio,p.id as pid from eb_candidate c left join eb_portfolio p on c.portfolio_id = p.id where c.status = 1 and p.election_id = " +eid);
    const { data: res2 } = await db.from('eb_candidate').select(`*,portfolio:eb_portfolio(name),pid:portfolio_id`).eq('status', 1).eq('eb_portfolio.election_id', eid)
    if (res2 && res2.length > 0) data.candidates = res2;
    // Election data
    //var res3 = await db.query("select e.* from eb_election e where e.id = "+eid);
    const { data: res3 } = await db.from('eb_election').select('*').eq('id', eid)
    if (res3 && res3.length > 0) data.election = res3;
    // Voters data
    //var res4 = await db.query("select * from eb_elector where election_id = " + eid);
    const { data: res4 } = await db.from('eb_elector').select('*').eq('election_id', eid)
    if (res4 && res4.length > 0) data.electors = res4;

    // Voters data
    //var res5 = await db.query("select * from eb_elector where election_id = " + eid+" and tag = '" +tag +"'");
    const { data: res5 } = await db.from('eb_elector').select('*').eq('tag', tag).eq('election_id', eid)
    if (res5 && res5.length > 0) data.voter = res5[0];

    return data;
  },

  fetchMonitor: async (mid: string) => {
    var data = <any>{};
    // Portfolio data
    //var res1 = await db.query("select * from eb_portfolio where status = 1 and election_id = " +mid);
    const { data: res1 } = await db.from('eb_portfolio').select('*').eq('status', 1).eq('election_id', mid)
    if (res1 && res1.length > 0) data.portfolios = res1;
    // Candidate data
    //var res2 = await db.query("select c.*,p.name as portfolio,p.id as pid from eb_candidate c left join eb_portfolio p on c.portfolio_id = p.id where c.status = 1 and p.election_id = " +mid);
    const { data: res2, error } = await db.from('eb_candidate').select(`*, portfolio:eb_portfolio(name),pid:portfolio_id`).eq('status', 1).eq('eb_portfolio.election_id', mid)
    console.log(res2, error)
    if (res2 && res2.length > 0) data.candidates = res2;
    // Election data
    //var res3 = await db.query("select e.* from eb_election e where e.id = "+mid);
    const { data: res3 } = await db.from('eb_election').select('*').eq('id', mid)
    if (res3 && res3.length > 0) data.election = res3;
    // Voters data
    //var res4 = await db.query("select * from eb_elector where election_id = " + eid);
    const { data: res4 } = await db.from('eb_elector').select('*').eq('election_id', mid)
    if (res4 && res4.length > 0) data.electors = res4;
    console.log(data)

    return data;
  },


  fetchReceipt: async (rid: string, tag: string) => {
    // Voters data
    let data = <any>{},
      selections = [];
    //var res = await db.query("select * from eb_elector where election_id = " + rid);
    var { data: res } = await db.from('eb_elector').select('*').eq('election_id', rid)
    if (res && res.length > 0) data.electors = res;
    //var res = await db.query("select * from eb_elector where election_id = " +rid +" and tag = '" +tag +"'");
    var { data: res } = await db.from('eb_elector').select('*').eq('election_id', rid).eq('tag', tag)
    if (res && res.length > 0) {
      const candidates = res[0].vote_sum && res[0].vote_sum.split(",");
      if (candidates) {
        for (const candid of candidates) {
          //var cs = await db.query("select c.*,p.name as portfolio from eb_candidate c left join eb_portfolio p on c.portfolio_id = p.id where p.election_id = " +rid +" and c.id = " +candid);
          var { data: cs } = await db.from('eb_candidate').select(`*,portfolio:eb_portfolio(name)`).eq('eb_portfolio.election_id', rid).eq('id', candid)
          if (cs && cs.length > 0) selections.push(cs[0]);
        }
      }
    }
    return { ...data, selections };
  },


  postVoteData: async (data: any) => {
    const { id, tag, votes, name } = data;
    // START TRANSACTION
    try {
      // Get Portfolio count & Verify whether equal to data posted
      //var res = await db.query("select * from eb_portfolio where status = 1 and election_id = " + id);
      var { data: chk } = await db.from('eb_log').select('tag').eq('tag', tag).eq('election_id', id)
      var { data: res } = await db.from('eb_portfolio').select('*').eq('status', 1).eq('election_id', id)
      if (res && res.length > 0) {
        const count = res.length;
        //var vt = await db.query("select * from eb_elector where election_id = " +id +" and trim(tag) = '" +tag +"' and vote_status = 1");
        var { data: vt } = await db.from('eb_elector').select('*').eq('tag', tag).eq('election_id', id).eq('vote_status', 1)
        if (vt && chk && vt.length <= 0 && chk.length <= 0) {
          if (count == Object.values(votes).length) {
            const vals = Object.values(votes);
            var update_count = 0;
            // Update Logs
            await db.from('eb_log').insert({ tag, election_id: id, meta: Object.values(votes).join(",") }).eq('id', val).select()
            // Update Candidate Votes Count
            if (vals.length > 0) {
              for (var val of vals) {
                //const cs = await db.query("select * from eb_candidate where id = " + val);
                var { data: cs } = await db.from('eb_candidate').select('*').eq('id', val)
                if (cs && cs.length > 0) {
                  /*
                  const ups = await db.query("update eb_candidate set votes = (votes+1) where id = " + val);
                  if (ups.affectedRows > 0) update_count += 1;
                  */
                  //var { data:ups,error }:any = await db.from('eb_candidate').update({ votes: parseInt(votes+1) }).eq('id', val).select()
                  //if (ups?.status === 200) update_count += 1;
                  await db.rpc('logvote', { row_id: val })
                  update_count += 1;

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
            //const ins = await db.query("insert into eb_elector set ?", dm);
            //if (ins && ins.insertId > 0) {
            const { data: ins, error }: any = await db.from('eb_elector').insert(dm).select()
            if (ins && ins.length > 0) {
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
          throw new Error(`Votes already submitted`);
          //return { success: false, msg: 'Elector already voted', code: 1004 }
        }
      } else {
        throw new Error(`Portfolio not found`);
        //return { success: false, msg: 'Portfolio not found', code: 1005 }
      }
    } catch (e: any) {
      //db.rollback();
      //console.info('Rollback successful');
      return {
        success: false,
        msg: e.message,
        code: 1004,
      };
    }
  },


  syncVoteData: async () => {
    try {
      var { data: res } = await db.from('eb_elector').select('*')
      if (res && res.length > 0) {
        await db.from('eb_candidate').update({ votes2: 0 })
        for (const vs of res) {
          const votes = vs.vote_sum.split(",")
          if (votes && votes.length > 0) {
            for (const vm of votes) {
              const { data: vc }: any = await db.from('eb_candidate').select("votes2").eq('id', vm.trim()).single()
              const { data: rm } = await db.from('eb_candidate').update({ votes2: (vc.votes2 + 1) }).eq('id', vm.trim()).select()
              console.log(rm)
            }
          }
        }
        return res
      }
    } catch (e: any) {
      return {
        success: false,
        msg: e.message,
        code: 1004,
      };
    }
  },

  updateControl: async (id: string, data: any) => {
    /*const sql = "update eb_election set ? where id = " + id;
    const res = await db.query(sql, data);*/
    var { data: res } = await db.from('eb_election').update(data).eq('id', id)
    return res;
  },


  fetchPhoto: async (tag: string, eid: string) => {
    var res;
    if (tag == "logo") {
      //res = await db.query("select logo as path from eb_election where id = ?", [eid]);
      var { data: res }: any = await db.from('eb_election').select(`path:logo`).eq('id', eid)
    } else if (tag == "centre") {
      res = [{ path: `/upload/logos/${eid.split(' ').join('').toLowerCase()}.jpg` }]
    } else if (tag == "voter") {
      res = [{ path: `/upload/voter/${eid.split('/').join('').toLowerCase()}.jpg` }]
    } else if (tag == "candid") {
      //res = await db.query("select photo as path from eb_candidate where id = ?", [eid]);
      var { data: res }: any = await db.from('eb_candidate').select(`path:photo`).eq('id', eid)
    }
    return res;
  },

  // VOTER MODELS
  fetchEligibleVoters: async () => {
    var res;
    //const ct = await db.query("select * from eb_centre en where `default` = 1");
    var { data: ct }: any = await db.from('eb_centre').select(`*`).eq('default', 1)
    if (ct && ct.length > 0) {
      //const et = await db.query("select v.* from eb_voter v where v.centre_id = "+ct[0].id);
      var { data: et }: any = await db.from('eb_voter').select(`*`).eq('centre_id', ct[0].id)
      if (et && et.length > 0) return et;
    }
    return res;
  },


  activateVoter: async (id: string) => {
    /*const sql = "update eb_voter set ? where id = " + id;
    const res = await db.query(sql, { verified: 1, verified_at: new Date() });*/
    var { data: res }: any = await db.from('eb_voter').update({ verified: 1, verified_at: new Date() }).eq('id', id)
    return res;
  },

  postVoteStatus: async (id: string, tag: string) => {
    /*const sql = "update eb_voter set ? where tag = '"+tag+"' and centre_id = " + id;
    const res = await db.query(sql, { verified: 0, voted: 1 });*/
    var { data: res }: any = await db.from('eb_voter').update({ verified: 0, voted: 1 }).eq('tag', tag).eq('centre_id', id).select()
    return res;
  },



  // FETCH VOTERS - AFTER VERIFIED ACTION


  // CONTROLS && ACTIONS
  saveControl: async (data: any) => {
    var res;
    const { id, data: body } = data;
    if (data) {
      //const sql = "update eb_election set ? where id = "+id;
      //const res = await db.query(sql, body);
      var { data: res }: any = await db.from('eb_election').update(body).eq('id', id)
      return res
    }
    return res;
  },


};

