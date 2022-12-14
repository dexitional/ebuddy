import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect'
import API from '../../backend/controller/apiController'
const app = nc<NextApiRequest, NextApiResponse>({
    onError: (err,req,res,next) => {
       console.error(err.stack);
       res.status(500).end("Something broke!");
    },
    onNoMatch: (req,res) => {
       res.status(404).end("Page is not found")
    }
})



app.get((req,res) => {
 
   const {verify } = req.query
  if(verify) return API.activateVoter(req,res)  // FETCH ELECTIONS BY CENTRE ID
   /*else if(cid) return API.fetchElectionByCentre(req,res) // FETCH VOTER ELECTIONS BY CENTRE ID
  else if(eid) return API.fetchElectionDataById(req,res) // FETCH ELECTION DATA BY ELECTION ID
  else if(mid) return API.fetchMonitor(req,res) // FETCH MONITOR DATA BY ELECTION ID
  else if(rid) return API.fetchReceipt(req,res) // FETCH BALLOT DATA BY ELECTION ID
  else if(gid) return API.fetchRegister(req,res) // FETCH BALLOT DATA BY ELECTION ID
  else if(centre) return API.fetchElectionByActiveCentre(req,res) // FETCH ELECTIONS OF ACTIVATED CENTRE
  else if(verify) return API.fetchVerifiedByActiveCentre(req,res) // FETCH ELECTIONS OF ACTIVATED CENTRE
  else if(username) return API.fetchElectionByVoter(req,res)  // FETCH ELECTIONS BY CENTRE ID
  //else if(username && (!eid || !rid || !edata)) return API.fetchElectionByVoter(req,res)  // FETCH ELECTIONS BY CENTRE ID
  */
  return API.fetchVotersByActiveCentre(req,res)  // FETCH ELECTIONS BY CENTRE ID
})

app.post((req,res) => {
   const { action } = req.query
   if(action == 'vote') return API.postData(req,res)
   if(action == 'control') return API.postData(req,res)
})

export default app;
