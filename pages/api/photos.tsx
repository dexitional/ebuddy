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
  return API.fetchPhoto(req,res)  // FETCH ELECTIONS BY CENTRE ID
})

app.post((req,res) => {
   const { action } = req.query
   if(action == 'vote') return API.postData(req,res)
   if(action == 'control') return API.postData(req,res)
})

export default app;
