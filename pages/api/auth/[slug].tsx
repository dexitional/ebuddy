import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect'
import API from '../../../backend/controller/apiController'
const app = nc<NextApiRequest, NextApiResponse>({
    onError: (err,req,res,next) => {
       console.error(err.stack);
       res.status(500).end("Something broke!");
    },
    onNoMatch: (req,res) => {
       res.status(404).end("Page is not found")
    }
})

//app.use()
app.get((req,res) => {
  return API.fetchTest(req,res)
})

app.post((req,res) => {
  const { slug } = req.query
  if(slug == "admin") return API.authenticateAdmin(req,res)
  if(slug == "voter") return API.authenticateVoter(req,res)
})

export default app;
